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
use std::collections::VecDeque;
use std::ops::Deref;

use swc_core::atoms::Atom;
use swc_core::common::DUMMY_SP;
use swc_core::ecma::ast::{
    ArrayLit, AssignExpr, AssignOp, AssignTarget, AssignTargetPat, BinExpr, CondExpr, Expr,
    ExprOrSpread, Ident, IdentName, Invalid, JSXElementChild, JSXExpr, JSXMemberExpr, JSXObject,
    KeyValueProp, Lit, MemberExpr, MemberProp, ObjectLit, ObjectPatProp, Pat, Prop, PropName,
    PropOrSpread, SimpleAssignTarget, SpreadElement, Str,
};

use crate::processor::ElementChildren;

pub fn jsx_expr_to_expr(expression: &JSXExpr) -> Expr {
    match expression {
        JSXExpr::Expr(expr) => *(*expr).clone(),
        JSXExpr::JSXEmptyExpr(empty_expr) => Expr::Lit(Lit::Str(Str {
            span: empty_expr.span,
            value: Atom::new("".to_string()),
            raw: None,
        })),
    }
}

pub fn jsx_member_expr_to_member_expr(member_expression: &JSXMemberExpr) -> MemberExpr {
    MemberExpr {
        obj: match &member_expression.obj {
            JSXObject::Ident(ident) => Box::new(Expr::Ident(ident.clone())),
            JSXObject::JSXMemberExpr(member_expression) => Box::new(Expr::Member(
                jsx_member_expr_to_member_expr(member_expression),
            )),
        },
        prop: MemberProp::Ident(member_expression.prop.clone()),
        ..MemberExpr::default()
    }
}

pub fn pat_to_expr(pat: &Pat) -> Expr {
    match pat {
        Pat::Ident(binding_ident) => Expr::Ident(binding_ident.id.clone()),
        Pat::Array(array_pat) => Expr::Array(ArrayLit {
            span: array_pat.span,
            elems: array_pat
                .elems
                .iter()
                .map(|elem| {
                    elem.as_ref().map(|pat| ExprOrSpread {
                        spread: None,
                        expr: Box::new(pat_to_expr(pat)),
                    })
                })
                .collect(),
        }),
        Pat::Object(object_pat) => Expr::Object(ObjectLit {
            span: object_pat.span,
            props: object_pat
                .props
                .iter()
                .map(|prop| match prop {
                    ObjectPatProp::Rest(rest) => PropOrSpread::Spread(SpreadElement {
                        dot3_token: rest.dot3_token,
                        expr: Box::new(pat_to_expr(&rest.arg.clone())),
                    }),
                    ObjectPatProp::KeyValue(key_value) => {
                        PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                            key: key_value.key.clone(),
                            value: Box::new(pat_to_expr(&key_value.value.clone())),
                        })))
                    }
                    ObjectPatProp::Assign(assign_pat) => {
                        PropOrSpread::Prop(Box::new(match assign_pat.value.clone() {
                            Some(expr) => Prop::KeyValue(KeyValueProp {
                                key: PropName::Ident(IdentName {
                                    span: assign_pat.key.id.span,
                                    sym: assign_pat.key.id.sym.clone(),
                                }),
                                value: expr,
                            }),
                            None => Prop::Shorthand(assign_pat.key.id.clone()),
                        }))
                    }
                })
                .collect(),
        }),
        Pat::Assign(assign_pat) => Expr::Assign(AssignExpr {
            span: assign_pat.span,
            op: AssignOp::Assign,
            left: match assign_pat.left.deref() {
                Pat::Ident(ident) => AssignTarget::Simple(SimpleAssignTarget::Ident(ident.clone())),
                Pat::Array(array_pat) => {
                    AssignTarget::Pat(AssignTargetPat::Array(array_pat.clone()))
                }
                Pat::Object(object_pat) => {
                    AssignTarget::Pat(AssignTargetPat::Object(object_pat.clone()))
                }
                _ => AssignTarget::Simple(SimpleAssignTarget::Invalid(Invalid { span: DUMMY_SP })),
            },
            right: Box::new(assign_pat.right.deref().clone()),
        }),
        Pat::Invalid(invalid) => Expr::Invalid(*invalid),
        Pat::Expr(expr) => *expr.clone(),
        _ => Expr::Invalid(Invalid { span: DUMMY_SP }),
    }
}

fn get_next_element_variable(elements: &mut VecDeque<ElementChildren>) -> Expr {
    match elements.pop_front() {
        Some(element) => match element {
            ElementChildren::Text(text) => Expr::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                value: text.into(),
                raw: None,
            })),
            ElementChildren::Element(position) => Expr::Ident(Ident {
                sym: format!("__$element${}", position).into(),
                ..Ident::default()
            }),
        },
        None => Expr::Invalid(Invalid { span: DUMMY_SP }),
    }
}

fn replace_jsx_elements_in_jsx_element_child(
    child: &JSXElementChild,
    elements: &mut VecDeque<ElementChildren>,
) -> Option<ExprOrSpread> {
    match child {
        JSXElementChild::JSXText(value) => Some(ExprOrSpread {
            spread: None,
            expr: Box::new(Expr::Lit(Lit::Str(Str {
                span: value.span,
                value: value.value.clone(),
                raw: Some(value.raw.clone()),
            }))),
        }),
        JSXElementChild::JSXExprContainer(jsx_expr) => match &jsx_expr.expr {
            JSXExpr::Expr(expr) => Some(ExprOrSpread {
                spread: None,
                expr: Box::new(replace_jsx_elements_in_expression(expr, elements)),
            }),
            JSXExpr::JSXEmptyExpr(_) => None,
        },
        JSXElementChild::JSXSpreadChild(spread_child) => Some(ExprOrSpread {
            spread: None,
            expr: spread_child.expr.clone(),
        }),
        JSXElementChild::JSXElement(_) => Some(ExprOrSpread {
            spread: None,
            expr: Box::new(get_next_element_variable(elements)),
        }),
        JSXElementChild::JSXFragment(fragment) => Some(ExprOrSpread {
            spread: None,
            expr: Box::new(Expr::Array(ArrayLit {
                elems: fragment
                    .children
                    .iter()
                    .map(|child| replace_jsx_elements_in_jsx_element_child(child, elements))
                    .collect(),
                ..ArrayLit::default()
            })),
        }),
    }
}

pub fn replace_jsx_elements_in_expression(
    expr: &Expr,
    elements: &mut VecDeque<ElementChildren>,
) -> Expr {
    match expr {
        Expr::Paren(paren_expr) => replace_jsx_elements_in_expression(&paren_expr.expr, elements),
        Expr::JSXElement(_) => get_next_element_variable(elements),
        Expr::JSXFragment(fragment) => Expr::Array(ArrayLit {
            elems: fragment
                .children
                .iter()
                .map(|child| replace_jsx_elements_in_jsx_element_child(child, elements))
                .collect(),
            ..ArrayLit::default()
        }),
        Expr::Bin(bin_expr) => Expr::Bin(BinExpr {
            span: bin_expr.span,
            op: bin_expr.op,
            left: bin_expr.left.clone(),
            right: Box::new(replace_jsx_elements_in_expression(
                &bin_expr.right,
                elements,
            )),
        }),
        Expr::Cond(cond_expr) => Expr::Cond(CondExpr {
            span: cond_expr.span,
            test: cond_expr.test.clone(),
            cons: Box::new(replace_jsx_elements_in_expression(
                &cond_expr.cons,
                elements,
            )),
            alt: Box::new(replace_jsx_elements_in_expression(&cond_expr.alt, elements)),
        }),
        _ => expr.clone(),
    }
}
