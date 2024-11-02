mod generators;
mod processor;
mod utils;

use std::ops::Deref;

use generators::ComponentDeclaration;
use swc_core::common::comments::CommentKind;
use swc_core::common::comments::Comments;
use swc_core::common::BytePos;
use swc_core::common::Spanned;
use swc_core::common::DUMMY_SP;
use swc_core::ecma::ast::Ident;
use swc_core::ecma::ast::ImportDecl;
use swc_core::ecma::ast::ImportDefaultSpecifier;
use swc_core::ecma::ast::ImportPhase;
use swc_core::ecma::ast::ImportSpecifier;
use swc_core::ecma::ast::ModuleDecl;
use swc_core::ecma::ast::ModuleItem;
use swc_core::ecma::ast::Program;
use swc_core::ecma::visit::{as_folder, FoldWith, VisitMut, VisitMutWith};
use swc_core::plugin::plugin_transform;
use swc_core::plugin::proxies::TransformPluginProgramMetadata;

use generators::generate_component_declaration;

pub struct TransformVisitor {
    comments: Option<Box<dyn Comments>>,
    has_component: bool,
    has_palta_import: bool,
}

impl TransformVisitor {
    fn is_component(&self, pos: BytePos) -> bool {
        if self.comments.is_none() {
            return false;
        }

        let comments = self.comments.as_ref().unwrap();

        if !comments.has_leading(pos) {
            return false;
        }

        let leading_comments = comments.to_owned().get_leading(pos).unwrap();

        let is_component = leading_comments.iter().any(|comment| {
            comment.kind == CommentKind::Line && comment.text.trim() == "@Palta.component"
        });

        if is_component {
            comments.take_leading(pos);
        }

        is_component
    }
}

impl VisitMut for TransformVisitor {
    fn visit_mut_function(&mut self, node: &mut swc_core::ecma::ast::Function) {
        if self.is_component(node.span_lo()) {
            generate_component_declaration(ComponentDeclaration::Function(node));
            self.has_component = true;
        } else {
            node.visit_mut_children_with(self);
        }
    }

    fn visit_mut_var_decl(&mut self, node: &mut swc_core::ecma::ast::VarDecl) {
        if self.is_component(node.span_lo()) {
            generate_component_declaration(ComponentDeclaration::VarDecl(node));
            self.has_component = true;
        } else {
            node.visit_mut_children_with(self);
        }
    }

    fn visit_mut_export_default_decl(&mut self, node: &mut swc_core::ecma::ast::ExportDefaultDecl) {
        if self.is_component(node.span_lo()) {
            if let swc_core::ecma::ast::DefaultDecl::Fn(func) = &mut node.decl {
                generate_component_declaration(ComponentDeclaration::Function(&mut func.function));
                self.has_component = true;
                return;
            }
        }

        node.visit_mut_children_with(self);
    }

    fn visit_mut_import_decl(&mut self, node: &mut ImportDecl) {
        node.visit_mut_children_with(self);

        if node.src.deref().value == "palta" {
            node.specifiers = node
                .specifiers
                .iter()
                .filter_map(|specifier| match specifier {
                    ImportSpecifier::Default(import) => {
                        let mut new_import = import.clone();
                        new_import.local.sym = "Palta".into();
                        self.has_palta_import = true;
                        Some(ImportSpecifier::Default(new_import))
                    }
                    ImportSpecifier::Named(import) => {
                        if import.local.sym == "$effect"
                            || import.local.sym == "$state"
                            || import.local.sym == "Children"
                        {
                            None
                        } else {
                            Some(specifier.clone())
                        }
                    }
                    _ => None,
                })
                .collect();

            if node.specifiers.is_empty() {
                self.has_palta_import = true;
                node.specifiers
                    .push(ImportSpecifier::Default(ImportDefaultSpecifier {
                        span: DUMMY_SP,
                        local: Ident {
                            sym: "Palta".into(),
                            ..Ident::default()
                        },
                    }));
            }
        }
    }

    fn visit_mut_module(&mut self, node: &mut swc_core::ecma::ast::Module) {
        node.visit_mut_children_with(self);

        if !self.has_component || self.has_palta_import {
            return;
        }

        let mut new_imports = vec![ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
            span: Default::default(),
            specifiers: vec![ImportSpecifier::Default(ImportDefaultSpecifier {
                span: DUMMY_SP,
                local: Ident {
                    sym: "Palta".into(),
                    ..Ident::default()
                },
            })],
            src: Box::new("palta".into()),
            type_only: false,
            with: None,
            phase: ImportPhase::Evaluation,
        }))];

        new_imports.append(&mut node.body);

        node.body = new_imports;
    }
}

#[plugin_transform]
pub fn process_transform(program: Program, metadata: TransformPluginProgramMetadata) -> Program {
    program.fold_with(&mut as_folder(TransformVisitor {
        comments: match metadata.comments {
            Some(comments) => Some(Box::new(comments)),
            None => None,
        },
        has_component: false,
        has_palta_import: false,
    }))
}

#[cfg(test)]
mod tests {
    use std::path::PathBuf;

    use swc_core::{
        ecma::{
            parser::{EsSyntax, Syntax, TsSyntax},
            transforms::testing::{test_fixture, FixtureTestConfig},
            visit::as_folder,
        },
        testing,
    };

    use crate::TransformVisitor;

    #[testing::fixture("tests/**/input.tsx")]
    fn typescript(input: PathBuf) {
        let output = input.with_file_name("output.ts");
        test_fixture(
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
            &|t| {
                as_folder(TransformVisitor {
                    comments: Some(Box::new(t.comments.clone())),
                    has_component: false,
                    has_palta_import: false,
                })
            },
            &input,
            &output,
            FixtureTestConfig {
                sourcemap: false,
                allow_error: false,
            },
        );
    }

    #[testing::fixture("tests/**/input.jsx")]
    fn javascript(input: PathBuf) {
        let output = input.with_file_name("output.js");
        test_fixture(
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            &|t| {
                as_folder(TransformVisitor {
                    comments: Some(Box::new(t.comments.clone())),
                    has_component: false,
                    has_palta_import: false,
                })
            },
            &input,
            &output,
            FixtureTestConfig {
                sourcemap: false,
                allow_error: false,
            },
        );
    }
}
