use swc_core::atoms::Atom;
use swc_core::common::DUMMY_SP;
use swc_core::ecma::ast::{
    ArrayLit, ArrowExpr, BindingIdent, BlockStmt, BlockStmtOrExpr, CallExpr, Callee, Decl, Expr,
    ExprOrSpread, ExprStmt, Function, Ident, IdentName, JSXExpr, KeyValueProp, Lit, MemberExpr,
    MemberProp, Null, Number, ObjectLit, ObjectPat, ParenExpr, Pat, Prop, PropName, PropOrSpread,
    ReturnStmt, Stmt, Str, TsEntityName, TsQualifiedName, TsType, TsTypeAnn,
    TsTypeParamInstantiation, TsTypeRef, VarDecl, VarDeclKind, VarDeclarator,
};

use crate::processor::{
    ComponentElementDescriptor, ComponentName, ElementChildren, ElementDescriptor,
    FragmentElementDescriptor, Processor, TagElementDescriptor,
};
use crate::utils::jsx_expr_to_expr;

pub enum ComponentDeclaration<'a> {
    Function(&'a mut Function),
    VarDecl(&'a mut VarDecl),
}

fn generate_children_array(children: &[ElementChildren]) -> ExprOrSpread {
    ExprOrSpread {
        spread: None,
        expr: Box::new(Expr::Array(ArrayLit {
            elems: children
                .iter()
                .map(|child| {
                    Some(match child {
                        ElementChildren::Text(text) => ExprOrSpread {
                            spread: None,
                            expr: Box::new(Expr::Lit(Lit::Str(Str {
                                span: DUMMY_SP,
                                value: Atom::new(text.clone()),
                                raw: None,
                            }))),
                        },
                        ElementChildren::Element(index) => ExprOrSpread {
                            spread: None,
                            expr: Box::new(Expr::Ident(Ident {
                                sym: format!("element${}", index).into(),
                                ..Ident::default()
                            })),
                        },
                    })
                })
                .collect(),
            ..ArrayLit::default()
        })),
    }
}

fn generate_palta_element_call(element: &TagElementDescriptor) -> Option<Box<Expr>> {
    Some(Box::new(Expr::Call(CallExpr {
        callee: Callee::Expr(Box::new(Expr::Member(MemberExpr {
            obj: Box::new(Expr::Ident(Ident {
                sym: "Palta".into(),
                ..Ident::default()
            })),
            prop: MemberProp::Ident(IdentName {
                sym: "createElement".into(),
                ..IdentName::default()
            }),
            ..MemberExpr::default()
        }))),
        args: vec![
            ExprOrSpread {
                spread: None,
                expr: Box::new(Expr::Lit(Lit::Str(Str {
                    span: DUMMY_SP,
                    value: Atom::new(element.tag.clone()),
                    raw: None,
                }))),
            },
            generate_children_array(&element.children),
        ],
        ..CallExpr::default()
    })))
}

fn generate_palta_component_call(element: &ComponentElementDescriptor) -> Option<Box<Expr>> {
    Some(Box::new(Expr::Call(CallExpr {
        callee: Callee::Expr(Box::new(Expr::Member(MemberExpr {
            obj: Box::new(Expr::Ident(Ident {
                sym: "Palta".into(),
                ..Ident::default()
            })),
            prop: MemberProp::Ident(IdentName {
                sym: "createComponent".into(),
                ..IdentName::default()
            }),
            ..MemberExpr::default()
        }))),
        args: vec![
            ExprOrSpread {
                spread: None,
                expr: match &element.component {
                    ComponentName::MemberExpression(member_expression) => {
                        Box::new(Expr::Member(member_expression.clone()))
                    }
                    ComponentName::Identifier(identifier) => {
                        Box::new(Expr::Ident(identifier.clone()))
                    }
                },
            },
            generate_children_array(&element.children),
        ],
        ..CallExpr::default()
    })))
}

fn generate_palta_fragment_call(element: &FragmentElementDescriptor) -> Option<Box<Expr>> {
    Some(Box::new(Expr::Call(CallExpr {
        callee: Callee::Expr(Box::new(Expr::Member(MemberExpr {
            obj: Box::new(Expr::Ident(Ident {
                sym: "Palta".into(),
                ..Ident::default()
            })),
            prop: MemberProp::Ident(IdentName {
                sym: "createFragment".into(),
                ..IdentName::default()
            }),
            ..MemberExpr::default()
        }))),
        args: vec![generate_children_array(&element.children)],
        ..CallExpr::default()
    })))
}

fn generate_palta_children_call() -> Option<Box<Expr>> {
    Some(Box::new(Expr::Call(CallExpr {
        callee: Callee::Expr(Box::new(Expr::Member(MemberExpr {
            obj: Box::new(Expr::Ident(Ident {
                sym: "Palta".into(),
                ..Ident::default()
            })),
            prop: MemberProp::Ident(IdentName {
                sym: "children".into(),
                ..IdentName::default()
            }),
            ..MemberExpr::default()
        }))),
        args: vec![],
        ..CallExpr::default()
    })))
}

fn generate_element_creation_call(element: &ElementDescriptor) -> Option<Box<Expr>> {
    match element {
        ElementDescriptor::Tag(tag) => generate_palta_element_call(tag),
        ElementDescriptor::Component(component) => generate_palta_component_call(component),
        ElementDescriptor::Fragment(fragment) => generate_palta_fragment_call(fragment),
        ElementDescriptor::Children => generate_palta_children_call(),
    }
}

fn generate_component_update_function(processor: &Processor, props: Pat) -> Box<Expr> {
    match processor.get_update_statements().len() {
        0 => Box::new(Expr::Ident(Ident {
            sym: "undefined".into(),
            ..Ident::default()
        })),
        _ => Box::new(Expr::Arrow(ArrowExpr {
            body: Box::new(BlockStmtOrExpr::BlockStmt(BlockStmt {
                stmts: processor.get_update_statements().clone(),
                ..BlockStmt::default()
            })),
            params: vec![props],
            ..ArrowExpr::default()
        })),
    }
}

fn generate_element_declaration(index: usize, element: &ElementDescriptor) -> Stmt {
    Stmt::Decl(Decl::Var(Box::new(VarDecl {
        kind: VarDeclKind::Const,
        decls: vec![VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(BindingIdent {
                id: Ident {
                    sym: format!("element${}", index).into(),
                    ..Ident::default()
                },
                ..BindingIdent::default()
            }),
            init: generate_element_creation_call(element),
            definite: false,
        }],
        ..VarDecl::default()
    })))
}

fn generate_root_declaration_statement(processor: &Processor) -> Stmt {
    Stmt::Decl(Decl::Var(Box::new(VarDecl {
        kind: VarDeclKind::Let,
        decls: vec![VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(BindingIdent {
                id: Ident {
                    sym: "root".into(),
                    ..Ident::default()
                },
                ..BindingIdent::default()
            }),
            init: Some(Box::new(match processor.get_root_element() {
                Some(position) => Expr::Ident(Ident {
                    sym: format!("element${}", position).into(),
                    ..Ident::default()
                }),
                None => Expr::Lit(Lit::Null(Null { span: DUMMY_SP })),
            })),
            definite: false,
        }],
        ..VarDecl::default()
    })))
}

fn generate_component_return_statement(processor: &Processor, props: Pat) -> Stmt {
    Stmt::Return(ReturnStmt {
        arg: Some(Box::new(Expr::Object(ObjectLit {
            props: vec![
                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(IdentName {
                        sym: "elements".into(),
                        ..IdentName::default()
                    }),
                    value: Box::new(Expr::Array(ArrayLit {
                        elems: processor
                            .get_elements()
                            .iter()
                            .enumerate()
                            .map(|(i, _)| {
                                Some(ExprOrSpread {
                                    spread: None,
                                    expr: Box::new(Expr::Ident(Ident {
                                        sym: format!("element${}", i).into(),
                                        ..Ident::default()
                                    })),
                                })
                            })
                            .collect::<Vec<Option<ExprOrSpread>>>(),
                        ..ArrayLit::default()
                    })),
                }))),
                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(IdentName {
                        sym: "update".into(),
                        ..IdentName::default()
                    }),
                    value: generate_component_update_function(processor, props),
                }))),
                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(IdentName {
                        sym: "getRoot".into(),
                        ..IdentName::default()
                    }),
                    value: Box::new(Expr::Arrow(ArrowExpr {
                        body: Box::new(BlockStmtOrExpr::Expr(Box::new(Expr::Paren(ParenExpr {
                            expr: Box::new(Expr::Ident(Ident {
                                sym: "root".into(),
                                ..Ident::default()
                            })),
                            ..ParenExpr::default()
                        })))),
                        params: vec![],
                        ..ArrowExpr::default()
                    })),
                }))),
            ],
            ..ObjectLit::default()
        }))),
        ..ReturnStmt::default()
    })
}

fn generate_component_statements(processor: &Processor, props: Pat) -> Vec<Stmt> {
    let mut statements = vec![];

    for (index, element) in processor.get_elements().iter().enumerate() {
        statements.push(generate_element_declaration(index, element));
    }

    statements.reverse();

    statements.push(generate_root_declaration_statement(processor));
    statements.push(generate_component_return_statement(processor, props));

    statements
}

fn generate_type_annotation_from_props(pat: Pat) -> Option<Box<TsType>> {
    match pat {
        Pat::Ident(object) => object.type_ann.map(|type_ann| type_ann.type_ann),
        Pat::Array(array) => array.type_ann.map(|type_ann| type_ann.type_ann),
        Pat::Rest(rest) => rest.type_ann.map(|type_ann| type_ann.type_ann),
        Pat::Object(object) => object.type_ann.map(|type_ann| type_ann.type_ann),
        _ => None,
    }
}

fn generate_function_component_declaration(function: &mut Function) {
    let mut processor: Processor = Processor::new();
    let props = function.params.first().unwrap().pat.clone();
    let props_type_annotation = generate_type_annotation_from_props(props.clone());

    processor.process_function(function);

    function.body = Some(BlockStmt {
        stmts: generate_component_statements(&processor, props.clone()),
        ..BlockStmt::default()
    });
    function.params = vec![];
    function.return_type = props_type_annotation.map(|type_annotation| {
        Box::new(TsTypeAnn {
            span: DUMMY_SP,
            type_ann: Box::new(TsType::TsTypeRef(TsTypeRef {
                span: DUMMY_SP,
                type_name: TsEntityName::TsQualifiedName(Box::new(TsQualifiedName {
                    span: DUMMY_SP,
                    left: TsEntityName::Ident(Ident {
                        sym: "Palta".into(),
                        ..Ident::default()
                    }),
                    right: IdentName {
                        sym: "Component".into(),
                        ..IdentName::default()
                    },
                })),
                type_params: Some(Box::new(TsTypeParamInstantiation {
                    span: DUMMY_SP,
                    params: vec![type_annotation],
                })),
            })),
        })
    });
}

fn generate_arrow_function_component_declaration(var_decl: &mut VarDecl) {
    // TODO: Error handling for the unwrap calls
    match var_decl
        .decls
        .first_mut()
        .unwrap()
        .init
        .as_mut()
        .unwrap()
        .as_mut_arrow()
    {
        Some(expression) => {
            let mut processor: Processor = Processor::new();
            let props = match expression.params.first() {
                Some(param) => param.clone(),
                None => Pat::Object(ObjectPat {
                    span: DUMMY_SP,
                    props: vec![],
                    optional: false,
                    type_ann: None,
                }),
            };
            let props_type_annotation = generate_type_annotation_from_props(props.clone());

            processor.process_arrow_expression(expression);

            expression.body = Box::new(BlockStmtOrExpr::BlockStmt(BlockStmt {
                stmts: generate_component_statements(&processor, props.clone()),
                ..BlockStmt::default()
            }));
            expression.params = vec![];
            expression.return_type = props_type_annotation.map(|type_annotation| {
                Box::new(TsTypeAnn {
                    span: DUMMY_SP,
                    type_ann: Box::new(TsType::TsTypeRef(TsTypeRef {
                        span: DUMMY_SP,
                        type_name: TsEntityName::TsQualifiedName(Box::new(TsQualifiedName {
                            span: DUMMY_SP,
                            left: TsEntityName::Ident(Ident {
                                sym: "Palta".into(),
                                ..Ident::default()
                            }),
                            right: IdentName {
                                sym: "Component".into(),
                                ..IdentName::default()
                            },
                        })),
                        type_params: Some(Box::new(TsTypeParamInstantiation {
                            span: DUMMY_SP,
                            params: vec![type_annotation],
                        })),
                    })),
                })
            });
        }
        None => {
            panic!("Component declaration must be an arrow function");
        }
    }
}

pub fn generate_component_declaration(node: ComponentDeclaration) {
    match node {
        ComponentDeclaration::Function(function) => {
            generate_function_component_declaration(function);
        }
        ComponentDeclaration::VarDecl(var_decl) => {
            generate_arrow_function_component_declaration(var_decl);
        }
    };
}

pub fn generate_expression_function(expression: &JSXExpr) -> Box<Expr> {
    Box::new(Expr::Arrow(ArrowExpr {
        body: Box::new(BlockStmtOrExpr::BlockStmt(BlockStmt {
            stmts: vec![Stmt::Return(ReturnStmt {
                arg: Some(Box::new(jsx_expr_to_expr(expression))),
                ..ReturnStmt::default()
            })],
            ..BlockStmt::default()
        })),
        ..ArrowExpr::default()
    }))
}

pub fn generate_element_set_children_call(
    element_position: usize,
    children_position: usize,
    expression: &Expr,
) -> Stmt {
    Stmt::Expr(ExprStmt {
        expr: Box::new(Expr::Call(CallExpr {
            callee: Callee::Expr(Box::new(Expr::Member(MemberExpr {
                obj: Box::new(Expr::Ident(Ident {
                    sym: format!("element${}", element_position).into(),
                    ..Ident::default()
                })),
                prop: MemberProp::Ident(IdentName {
                    sym: "updateChild".into(),
                    ..IdentName::default()
                }),
                ..MemberExpr::default()
            }))),
            args: vec![
                ExprOrSpread {
                    spread: None,
                    expr: Box::new(Expr::Lit(Lit::Num(Number {
                        span: DUMMY_SP,
                        value: children_position as f64,
                        raw: None,
                    }))),
                },
                ExprOrSpread {
                    spread: None,
                    expr: Box::new(expression.clone()),
                },
            ],
            ..CallExpr::default()
        })),
        ..ExprStmt::default()
    })
}
