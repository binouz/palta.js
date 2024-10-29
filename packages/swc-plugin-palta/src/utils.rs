use std::ops::Deref;

use swc_core::atoms::Atom;
use swc_core::common::DUMMY_SP;
use swc_core::ecma::ast::{
    ArrayLit, AssignExpr, AssignOp, AssignTarget, AssignTargetPat, Expr, ExprOrSpread, Ident,
    IdentName, Invalid, JSXExpr, JSXMemberExpr, JSXObject, KeyValueProp, Lit, MemberExpr,
    MemberProp, ObjectLit, ObjectPatProp, Pat, Prop, PropName, PropOrSpread, SimpleAssignTarget,
    SpreadElement, Str,
};

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
