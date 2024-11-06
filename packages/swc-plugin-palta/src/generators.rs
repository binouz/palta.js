/**
 * Copyright 2024 Aubin REBILLAT
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
use swc_core::atoms::Atom;
use swc_core::common::DUMMY_SP;
use swc_core::ecma::ast::{
    ArrayLit, ArrowExpr, AssignExpr, AssignOp, AssignTarget, BinExpr, BinaryOp, BindingIdent,
    BlockStmt, BlockStmtOrExpr, CallExpr, Callee, CondExpr, Decl, EmptyStmt, Expr, ExprOrSpread,
    ExprStmt, Function, Ident, IdentName, KeyValueProp, Lit, MemberExpr, MemberProp, Null, Number,
    ObjectLit, ObjectPat, ParenExpr, Pat, Prop, PropName, PropOrSpread, ReturnStmt,
    SimpleAssignTarget, Stmt, Str, TsEntityName, TsQualifiedName, TsType, TsTypeAnn,
    TsTypeParamInstantiation, TsTypeRef, UnaryExpr, UnaryOp, VarDecl, VarDeclKind, VarDeclarator,
};

use crate::processor::{
    ComponentElementDescriptor, ComponentName, ElementChildren, ElementDescriptor, Processor,
    StateDescriptor, TagElementDescriptor,
};
use crate::utils::pat_to_expr;

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
                                sym: format!("__$element${}", index).into(),
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

fn generate_palta_children_call() -> Option<Box<Expr>> {
    Some(Box::new(Expr::Call(CallExpr {
        callee: Callee::Expr(Box::new(Expr::Member(MemberExpr {
            obj: Box::new(Expr::Ident(Ident {
                sym: "Palta".into(),
                ..Ident::default()
            })),
            prop: MemberProp::Ident(IdentName {
                sym: "createChildren".into(),
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
        ElementDescriptor::Children => generate_palta_children_call(),
    }
}

fn generate_props_variable_declaration(props: Pat) -> Stmt {
    Stmt::Decl(Decl::Var(Box::new(VarDecl {
        kind: VarDeclKind::Let,
        decls: vec![VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(BindingIdent {
                id: Ident {
                    sym: "__$props".into(),
                    ..Ident::default()
                },
                type_ann: match props {
                    Pat::Ident(ident) => ident.type_ann.map(|_| {
                        Box::new(TsTypeAnn {
                            span: DUMMY_SP,
                            type_ann: Box::new(TsType::TsTypeRef(TsTypeRef {
                                span: DUMMY_SP,
                                type_name: TsEntityName::Ident(Ident {
                                    sym: "any".into(),
                                    ..Ident::default()
                                }),
                                type_params: None,
                            })),
                        })
                    }),
                    Pat::Object(object) => object.type_ann.map(|_| {
                        Box::new(TsTypeAnn {
                            span: DUMMY_SP,
                            type_ann: Box::new(TsType::TsTypeRef(TsTypeRef {
                                span: DUMMY_SP,
                                type_name: TsEntityName::Ident(Ident {
                                    sym: "any".into(),
                                    ..Ident::default()
                                }),
                                type_params: None,
                            })),
                        })
                    }),
                    _ => None,
                },
            }),
            init: Some(Box::new(Expr::Object({
                ObjectLit {
                    props: vec![],
                    span: DUMMY_SP,
                }
            }))),
            definite: false,
        }],
        ..VarDecl::default()
    })))
}

fn generate_run_effect_call(processor: &Processor) -> Vec<Stmt> {
    let mut result = vec![];

    for (index, effect) in processor.get_effects().iter().enumerate() {
        result.push(Stmt::Expr(ExprStmt {
            expr: Box::new(Expr::Call(CallExpr {
                callee: Callee::Expr(Box::new(Expr::Member(MemberExpr {
                    obj: Box::new(Expr::Ident(Ident {
                        sym: "Palta".into(),
                        ..Ident::default()
                    })),
                    prop: MemberProp::Ident(IdentName {
                        sym: "runEffect".into(),
                        ..IdentName::default()
                    }),
                    ..MemberExpr::default()
                }))),
                args: vec![
                    ExprOrSpread {
                        spread: None,
                        expr: Box::new(Expr::Ident(Ident {
                            sym: format!("__$effect${}", index).into(),
                            ..Ident::default()
                        })),
                    },
                    ExprOrSpread {
                        spread: None,
                        expr: Box::new(Expr::Arrow(ArrowExpr {
                            body: Box::new(BlockStmtOrExpr::BlockStmt(BlockStmt {
                                stmts: effect.callback.clone(),
                                ..BlockStmt::default()
                            })),
                            ..ArrowExpr::default()
                        })),
                    },
                    ExprOrSpread {
                        spread: None,
                        expr: match &effect.cleanup {
                            Some(cleanup) => Box::new(Expr::Arrow(ArrowExpr {
                                body: Box::new(BlockStmtOrExpr::BlockStmt(BlockStmt {
                                    stmts: cleanup.clone(),
                                    ..BlockStmt::default()
                                })),
                                ..ArrowExpr::default()
                            })),
                            None => Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
                        },
                    },
                    ExprOrSpread {
                        spread: None,
                        expr: Box::new(Expr::Array(ArrayLit {
                            elems: effect
                                .deps
                                .iter()
                                .map(|dependency| Some(dependency.clone()))
                                .collect(),
                            ..ArrayLit::default()
                        })),
                    },
                ],
                ..CallExpr::default()
            })),
            ..ExprStmt::default()
        }));
    }

    result
}

fn generate_component_update_function(processor: &Processor, props: Pat) -> Stmt {
    let mut stmts = vec![Stmt::Expr(ExprStmt {
        expr: Box::new(Expr::Assign(AssignExpr {
            op: AssignOp::Assign,
            left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                id: Ident {
                    sym: "__$props".into(),
                    ..Ident::default()
                },
                type_ann: None,
            })),
            right: Box::new(pat_to_expr(&props.clone())),
            ..AssignExpr::default()
        })),
        ..ExprStmt::default()
    })];

    stmts.append(&mut processor.get_update_statements().clone());
    stmts.append(&mut generate_run_effect_call(processor));

    match processor.get_update_statements().len() {
        0 => Stmt::Empty(EmptyStmt { span: DUMMY_SP }),
        _ => Stmt::Decl(Decl::Var(Box::new(VarDecl {
            kind: VarDeclKind::Const,
            decls: vec![VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(BindingIdent {
                    id: Ident {
                        sym: "__$update".into(),
                        ..Ident::default()
                    },
                    ..BindingIdent::default()
                }),
                init: Some(Box::new(Expr::Arrow(ArrowExpr {
                    body: Box::new(BlockStmtOrExpr::BlockStmt(BlockStmt {
                        stmts,
                        ..BlockStmt::default()
                    })),
                    params: vec![props],
                    ..ArrowExpr::default()
                }))),
                definite: false,
            }],
            ..VarDecl::default()
        }))),
    }
}

fn generate_element_declaration(index: usize, element: &ElementDescriptor) -> Stmt {
    Stmt::Decl(Decl::Var(Box::new(VarDecl {
        kind: VarDeclKind::Const,
        decls: vec![VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(BindingIdent {
                id: Ident {
                    sym: format!("__$element${}", index).into(),
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
                    sym: "__$root".into(),
                    ..Ident::default()
                },
                ..BindingIdent::default()
            }),
            init: Some(Box::new(match processor.get_root_element() {
                Some(position) => Expr::Ident(Ident {
                    sym: format!("__$element${}", position).into(),
                    ..Ident::default()
                }),
                None => Expr::Lit(Lit::Null(Null { span: DUMMY_SP })),
            })),
            definite: false,
        }],
        ..VarDecl::default()
    })))
}

fn generate_initialize_function(processor: &Processor, props: Pat) -> Box<Expr> {
    let mut stmts = vec![Stmt::Expr(ExprStmt {
        expr: Box::new(Expr::Assign(AssignExpr {
            op: AssignOp::Assign,
            left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                id: Ident {
                    sym: "__$props".into(),
                    ..Ident::default()
                },
                type_ann: None,
            })),
            right: Box::new(pat_to_expr(&props.clone())),
            ..AssignExpr::default()
        })),
        ..ExprStmt::default()
    })];

    stmts.append(&mut processor.get_initialze_statements().clone());

    Box::new(Expr::Arrow(ArrowExpr {
        body: Box::new(BlockStmtOrExpr::BlockStmt(BlockStmt {
            stmts,
            ..BlockStmt::default()
        })),
        params: vec![props],
        ..ArrowExpr::default()
    }))
}

fn generate_component_return_statement(processor: &Processor, props: Pat) -> Stmt {
    Stmt::Return(ReturnStmt {
        arg: Some(Box::new(Expr::Object(ObjectLit {
            props: vec![
                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(IdentName {
                        sym: "childrenElement".into(),
                        ..IdentName::default()
                    }),
                    value: Box::new(match processor.get_children_element() {
                        Some(pos) => Expr::Ident(Ident {
                            sym: format!("__$element${}", pos).into(),
                            ..Ident::default()
                        }),
                        _ => Expr::Lit(Lit::Null(Null { span: DUMMY_SP })),
                    }),
                }))),
                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(IdentName {
                        sym: "initialize".into(),
                        ..IdentName::default()
                    }),
                    value: generate_initialize_function(processor, props),
                }))),
                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(IdentName {
                        sym: "update".into(),
                        ..IdentName::default()
                    }),
                    value: Box::new(Expr::Ident(Ident {
                        sym: "__$update".into(),
                        ..Ident::default()
                    })),
                }))),
                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(IdentName {
                        sym: "getRoot".into(),
                        ..IdentName::default()
                    }),
                    value: Box::new(Expr::Arrow(ArrowExpr {
                        body: Box::new(BlockStmtOrExpr::Expr(Box::new(Expr::Paren(ParenExpr {
                            expr: Box::new(Expr::Ident(Ident {
                                sym: "__$root".into(),
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

fn generate_state_updater_function(state_variable_name: &Ident) -> Expr {
    Expr::Arrow(ArrowExpr {
        params: vec![Pat::Ident(BindingIdent {
            id: Ident {
                sym: "value".into(),
                ..Ident::default()
            },
            ..BindingIdent::default()
        })],
        body: Box::new(BlockStmtOrExpr::BlockStmt(BlockStmt {
            stmts: vec![
                Stmt::Expr(ExprStmt {
                    expr: Box::new(Expr::Assign(AssignExpr {
                        op: AssignOp::Assign,
                        left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                            id: state_variable_name.clone(),
                            ..BindingIdent::default()
                        })),
                        right: Box::new(Expr::Cond(CondExpr {
                            test: Box::new(Expr::Bin(BinExpr {
                                op: BinaryOp::EqEqEq,
                                left: Box::new(Expr::Unary(UnaryExpr {
                                    op: UnaryOp::TypeOf,
                                    arg: Box::new(Expr::Ident(Ident {
                                        sym: "value".into(),
                                        ..Ident::default()
                                    })),
                                    ..UnaryExpr::default()
                                })),
                                right: Box::new(Expr::Lit(Lit::Str(Str {
                                    span: DUMMY_SP,
                                    value: "function".into(),
                                    raw: None,
                                }))),
                                ..BinExpr::default()
                            })),
                            cons: Box::new(Expr::Call(CallExpr {
                                callee: Callee::Expr(Box::new(Expr::Ident(Ident {
                                    sym: "value".into(),
                                    ..Ident::default()
                                }))),
                                args: vec![ExprOrSpread {
                                    spread: None,
                                    expr: Box::new(Expr::Ident(state_variable_name.clone())),
                                }],
                                ..CallExpr::default()
                            })),
                            alt: Box::new(Expr::Ident(Ident {
                                sym: "value".into(),
                                ..Ident::default()
                            })),
                            ..CondExpr::default()
                        })),
                        ..AssignExpr::default()
                    })),
                    ..ExprStmt::default()
                }),
                Stmt::Expr(ExprStmt {
                    expr: Box::new(Expr::Call(CallExpr {
                        callee: Callee::Expr(Box::new(Expr::Member(MemberExpr {
                            obj: Box::new(Expr::Ident(Ident {
                                sym: "Palta".into(),
                                ..Ident::default()
                            })),
                            prop: MemberProp::Ident(IdentName {
                                sym: "componentUpdate".into(),
                                ..IdentName::default()
                            }),
                            ..MemberExpr::default()
                        }))),
                        args: vec![ExprOrSpread {
                            spread: None,
                            expr: Box::new(Expr::Arrow(ArrowExpr {
                                params: vec![],
                                body: Box::new(BlockStmtOrExpr::Expr(Box::new(Expr::Call(
                                    CallExpr {
                                        callee: Callee::Expr(Box::new(Expr::Ident(Ident {
                                            sym: "__$update".into(),
                                            ..Ident::default()
                                        }))),
                                        args: vec![ExprOrSpread {
                                            spread: None,
                                            expr: Box::new(Expr::Ident(Ident {
                                                sym: "__$props".into(),
                                                ..Ident::default()
                                            })),
                                        }],
                                        ..CallExpr::default()
                                    },
                                )))),
                                ..ArrowExpr::default()
                            })),
                        }],
                        ..CallExpr::default()
                    })),
                    ..ExprStmt::default()
                }),
            ],
            ..BlockStmt::default()
        })),
        ..ArrowExpr::default()
    })
}

fn generate_state_statements(
    statements: &mut Vec<Stmt>,
    state: &StateDescriptor,
    is_typescript: bool,
) {
    statements.push(Stmt::Decl(Decl::Var(Box::new(VarDecl {
        kind: VarDeclKind::Let,
        decls: vec![VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(BindingIdent {
                id: state.variable_name.clone(),
                ..BindingIdent::default()
            }),
            init: state.initial_value.clone().map(Box::new),
            definite: false,
        }],
        ..VarDecl::default()
    }))));

    if let Some(updater_name) = &state.updater_name {
        statements.push(Stmt::Decl(Decl::Var(Box::new(VarDecl {
            kind: VarDeclKind::Const,
            decls: vec![VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(BindingIdent {
                    id: updater_name.clone(),
                    type_ann: if is_typescript {
                        Some(Box::new(TsTypeAnn {
                            span: DUMMY_SP,
                            type_ann: Box::new(TsType::TsTypeRef(TsTypeRef {
                                span: DUMMY_SP,
                                type_name: TsEntityName::TsQualifiedName(Box::new(
                                    TsQualifiedName {
                                        span: DUMMY_SP,
                                        left: TsEntityName::Ident(Ident {
                                            sym: "Palta".into(),
                                            ..Ident::default()
                                        }),
                                        right: IdentName {
                                            sym: "StateUpdater".into(),
                                            ..IdentName::default()
                                        },
                                    },
                                )),
                                type_params: Some(Box::new(TsTypeParamInstantiation {
                                    span: DUMMY_SP,
                                    params: vec![match state.type_ann.clone() {
                                        Some(type_ann) => type_ann.type_ann.clone(),
                                        None => Box::new(TsType::TsTypeRef(TsTypeRef {
                                            span: DUMMY_SP,
                                            type_name: TsEntityName::Ident(Ident {
                                                sym: "any".into(),
                                                ..Ident::default()
                                            }),
                                            type_params: None,
                                        })),
                                    }],
                                })),
                            })),
                        }))
                    } else {
                        None
                    },
                }),
                init: Some(Box::new(generate_state_updater_function(
                    &state.variable_name,
                ))),
                definite: false,
            }],
            ..VarDecl::default()
        }))))
    }
}

fn generate_effect_statement(index: usize) -> Stmt {
    Stmt::Decl(Decl::Var(Box::new(VarDecl {
        kind: VarDeclKind::Const,
        decls: vec![VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(BindingIdent {
                id: Ident {
                    sym: format!("__$effect${}", index).into(),
                    ..Ident::default()
                },
                ..BindingIdent::default()
            }),
            init: Some(Box::new(Expr::Object(ObjectLit {
                props: vec![PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(IdentName {
                        sym: "deps".into(),
                        ..IdentName::default()
                    }),
                    value: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
                })))],
                ..ObjectLit::default()
            }))),
            definite: false,
        }],
        ..VarDecl::default()
    })))
}

fn generate_component_statements(
    processor: &Processor,
    props: Pat,
    is_typescript: bool,
) -> Vec<Stmt> {
    let mut statements = vec![];

    for (index, element) in processor.get_elements().iter().enumerate() {
        statements.push(generate_element_declaration(index, element));
    }

    statements.reverse();

    statements.push(generate_props_variable_declaration(props.clone()));

    for state in processor.get_states() {
        generate_state_statements(&mut statements, state, is_typescript);
    }

    for index in 0..processor.get_effects().len() {
        statements.push(generate_effect_statement(index));
    }

    statements.push(generate_component_update_function(processor, props.clone()));
    statements.push(generate_root_declaration_statement(processor));
    statements.push(generate_component_return_statement(
        processor,
        props.clone(),
    ));

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
    let props = match function.params.first() {
        Some(param) => param.pat.clone(),
        None => Pat::Object(ObjectPat {
            span: DUMMY_SP,
            props: vec![],
            optional: false,
            type_ann: None,
        }),
    };
    let props_type_annotation = generate_type_annotation_from_props(props.clone());

    processor.process_function(function);

    function.body = Some(BlockStmt {
        stmts: generate_component_statements(
            &processor,
            props.clone(),
            props_type_annotation.is_some(),
        ),
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
                        sym: "ComponentDefinition".into(),
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
                stmts: generate_component_statements(
                    &processor,
                    props.clone(),
                    props_type_annotation.is_some(),
                ),
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
                                sym: "ComponentDefinition".into(),
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

pub fn generate_expression_function(expression: &Expr) -> Box<Expr> {
    Box::new(Expr::Arrow(ArrowExpr {
        body: Box::new(BlockStmtOrExpr::BlockStmt(BlockStmt {
            stmts: vec![Stmt::Return(ReturnStmt {
                arg: Some(Box::new(expression.clone())),
                ..ReturnStmt::default()
            })],
            ..BlockStmt::default()
        })),
        ..ArrowExpr::default()
    }))
}

pub fn generate_element_update_child_call(
    element_position: usize,
    children_position: usize,
    expression: &Expr,
) -> Stmt {
    Stmt::Expr(ExprStmt {
        expr: Box::new(Expr::Call(CallExpr {
            callee: Callee::Expr(Box::new(Expr::Member(MemberExpr {
                obj: Box::new(Expr::Ident(Ident {
                    sym: format!("__$element${}", element_position).into(),
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

pub fn generate_element_update_props_call(element_position: usize, props: &ObjectLit) -> Stmt {
    Stmt::Expr(ExprStmt {
        expr: Box::new(Expr::Call(CallExpr {
            callee: Callee::Expr(Box::new(Expr::Member(MemberExpr {
                obj: Box::new(Expr::Ident(Ident {
                    sym: format!("__$element${}", element_position).into(),
                    ..Ident::default()
                })),
                prop: MemberProp::Ident(IdentName {
                    sym: "updateProps".into(),
                    ..IdentName::default()
                }),
                ..MemberExpr::default()
            }))),
            args: vec![ExprOrSpread {
                spread: None,
                expr: Box::new(Expr::Object(props.clone())),
            }],
            ..CallExpr::default()
        })),
        ..ExprStmt::default()
    })
}

pub fn generate_element_initialize_call(
    element_position: usize,
    props: &Option<ObjectLit>,
) -> Stmt {
    Stmt::Expr(ExprStmt {
        expr: Box::new(Expr::Call(CallExpr {
            callee: Callee::Expr(Box::new(Expr::Member(MemberExpr {
                obj: Box::new(Expr::Ident(Ident {
                    sym: format!("__$element${}", element_position).into(),
                    ..Ident::default()
                })),
                prop: MemberProp::Ident(IdentName {
                    sym: "initialize".into(),
                    ..IdentName::default()
                }),
                ..MemberExpr::default()
            }))),
            args: vec![ExprOrSpread {
                spread: None,
                expr: Box::new(Expr::Object(match props {
                    Some(props) => props.clone(),
                    None => ObjectLit {
                        span: DUMMY_SP,
                        props: vec![],
                    },
                })),
            }],
            ..CallExpr::default()
        })),
        ..ExprStmt::default()
    })
}
