use swc_core::atoms::Atom;
use swc_core::ecma::ast::{
    Expr, JSXExpr, JSXMemberExpr, JSXObject, Lit, MemberExpr, MemberProp, Str,
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
