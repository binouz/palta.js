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
use core::panic;
use std::collections::VecDeque;
use std::ops::Deref;

use swc_core::common::DUMMY_SP;
use swc_core::ecma::ast::{
    ArrowExpr, BlockStmt, BlockStmtOrExpr, Bool, CallExpr, Callee, Decl, Expr, ExprOrSpread,
    ExprStmt, Function, Ident, JSXAttrName, JSXAttrOrSpread, JSXAttrValue, JSXElement,
    JSXElementChild, JSXElementName, JSXExpr, JSXExprContainer, JSXFragment, JSXOpeningElement,
    JSXText, KeyValueProp, Lit, MemberExpr, ObjectLit, ParenExpr, Pat, Prop, PropName,
    PropOrSpread, ReturnStmt, Stmt, TsTypeAnn, VarDecl, VarDeclarator,
};

use crate::generators::{
    generate_element_initialize_call, generate_element_update_child_call,
    generate_element_update_props_call, generate_expression_function,
};
use crate::utils::{
    jsx_expr_to_expr, jsx_member_expr_to_member_expr, replace_jsx_elements_in_expression,
};

const HTML_ELEMENT_TAGS: &[&str] = &[
    "a",
    "abbr",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "bdi",
    "bdo",
    "big",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "center",
    "cite",
    "code",
    "col",
    "colgroup",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "keygen",
    "label",
    "legend",
    "li",
    "link",
    "main",
    "map",
    "mark",
    "menu",
    "menuitem",
    "meta",
    "meter",
    "nav",
    "noindex",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "picture",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "search",
    "slot",
    "script",
    "section",
    "select",
    "small",
    "source",
    "span",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "table",
    "template",
    "tbody",
    "td",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "u",
    "ul",
    "var",
    "video",
    "wbr",
    // SVG
    "svg",
    "animate",
    "animateMotion",
    "animateTransform",
    "circle",
    "clipPath",
    "defs",
    "desc",
    "ellipse",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "filter",
    "foreignObject",
    "g",
    "image",
    "line",
    "linearGradient",
    "marker",
    "mask",
    "metadata",
    "mpath",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "set",
    "stop",
    "switch",
    "symbol",
    "text",
    "textPath",
    "tspan",
    "use",
    "view",
];

#[derive(Debug)]
pub enum ElementChildren {
    Text(String),
    Element(usize),
}

#[derive(Debug, Clone)]
pub enum ComponentName {
    MemberExpression(MemberExpr),
    Identifier(Ident),
}

#[derive(Debug)]
pub struct TagElementDescriptor {
    pub tag: String,
    pub children: Vec<ElementChildren>,
    pub props: Option<ObjectLit>,
}

#[derive(Debug)]
pub struct ComponentElementDescriptor {
    pub component: ComponentName,
    pub children: Vec<ElementChildren>,
    pub props: Option<ObjectLit>,
}

#[derive(Debug)]
pub enum ElementDescriptor {
    Tag(TagElementDescriptor),
    Component(ComponentElementDescriptor),
    Children,
}

pub struct StateDescriptor {
    pub variable_name: Ident,
    pub updater_name: Option<Ident>,
    pub initial_value: Option<Expr>,
    pub type_ann: Option<Box<TsTypeAnn>>,
}

pub struct EffectDescriptor {
    pub deps: Vec<ExprOrSpread>,
    pub callback: Vec<Stmt>,
    pub cleanup: Option<Vec<Stmt>>,
}

pub struct Processor {
    elements: Vec<ElementDescriptor>,
    children_element: Option<usize>,
    initialize_statements: Vec<Stmt>,
    update_statements: Vec<Stmt>,
    root_element: Option<usize>,
    states: Vec<StateDescriptor>,
    effects: Vec<EffectDescriptor>,
}

fn is_palta_state_call(call_expression: &CallExpr) -> bool {
    if let Callee::Expr(callee) = &call_expression.callee {
        if let Expr::Ident(ident) = callee.deref() {
            return ident.sym == "$state";
        }
    }

    false
}

fn is_palta_effect_call(call_expression: &CallExpr) -> bool {
    if let Callee::Expr(callee) = &call_expression.callee {
        if let Expr::Ident(ident) = callee.deref() {
            return ident.sym == "$effect";
        }
    }

    false
}

impl Processor {
    pub fn new() -> Self {
        Processor {
            elements: vec![],
            children_element: None,
            initialize_statements: vec![],
            update_statements: vec![],
            root_element: None,
            states: vec![],
            effects: vec![],
        }
    }

    pub fn get_root_element(&self) -> Option<usize> {
        self.root_element
    }

    pub fn get_elements(&self) -> &Vec<ElementDescriptor> {
        &self.elements
    }

    pub fn get_children_element(&self) -> Option<usize> {
        self.children_element
    }

    pub fn get_initialze_statements(&self) -> &Vec<Stmt> {
        &self.initialize_statements
    }

    pub fn get_update_statements(&self) -> &Vec<Stmt> {
        &self.update_statements
    }

    pub fn get_states(&self) -> &Vec<StateDescriptor> {
        &self.states
    }

    pub fn get_effects(&self) -> &Vec<EffectDescriptor> {
        &self.effects
    }

    pub fn process_function(&mut self, node: &Function) {
        match &node.body {
            Some(block) => {
                self.process_block_statement(block);
            }
            None => {}
        }
    }

    pub fn process_arrow_expression(&mut self, node: &ArrowExpr) {
        match node.body.deref() {
            BlockStmtOrExpr::BlockStmt(ref block) => {
                self.process_block_statement(block);
            }
            BlockStmtOrExpr::Expr(expression) => match expression.deref() {
                Expr::JSXElement(element) => {
                    self.process_jsx_element(element.deref());
                }
                Expr::JSXFragment(fragment) => {
                    self.process_jsx_fragment(fragment);
                }
                _ => {
                    panic!("Arrow expression body is not JSX Element");
                }
            },
        }
    }

    fn process_block_statement(&mut self, block: &BlockStmt) {
        for stmt in &block.stmts {
            match stmt {
                Stmt::Block(block) => {
                    self.process_block_statement(block);
                }
                Stmt::Return(stmt) => {
                    self.process_return_statement(stmt);
                }
                Stmt::Decl(decl) => {
                    self.processs_declaration(decl);
                }
                Stmt::If(_) => {}
                Stmt::Expr(expr) => {
                    if let Expr::Call(call_expression) = expr.expr.deref() {
                        if is_palta_effect_call(&call_expression.clone()) {
                            self.process_palta_effect_call(call_expression);
                        }
                    } else {
                        self.update_statements.push(Stmt::Expr(expr.clone()));
                        self.initialize_statements.push(Stmt::Expr(expr.clone()));
                    }
                }
                stmt => {
                    self.update_statements.push(stmt.clone());
                    self.initialize_statements.push(stmt.clone());
                }
            }
        }
    }

    fn process_return_statement(&mut self, stmt: &ReturnStmt) {
        match &stmt.arg {
            Some(arg) => match arg.deref() {
                Expr::JSXElement(element) => {
                    self.root_element = match self.process_jsx_element(element.deref())[0] {
                        ElementChildren::Element(index) => Some(index),
                        _ => None,
                    }
                }
                Expr::JSXFragment(fragment) => {
                    self.process_jsx_fragment(fragment);
                }
                Expr::Paren(expr) => {
                    let children = self.process_parenthesis_expression(expr);

                    if children.len() != 1 {
                        return;
                    }

                    if let ElementChildren::Element(index) = children[0] {
                        self.root_element = Some(index);
                    }
                }
                _ => {
                    panic!("Return statement argument is not JSX Element");
                }
            },
            None => {}
        }
    }

    fn process_parenthesis_expression(&mut self, expr: &ParenExpr) -> Vec<ElementChildren> {
        match expr.expr.deref() {
            Expr::JSXElement(element) => self.process_jsx_element(element.deref()),
            Expr::JSXFragment(fragment) => self.process_jsx_fragment(fragment),
            _ => {
                panic!("Parenthesis expression is not JSX Element");
            }
        }
    }

    fn process_expression(&mut self, expr: &Expr) -> Vec<ElementChildren> {
        match expr {
            Expr::Paren(paren_expr) => self.process_parenthesis_expression(paren_expr),
            Expr::JSXElement(element) => self.process_jsx_element(element),
            Expr::JSXFragment(fragment) => self.process_jsx_fragment(fragment),
            Expr::Bin(bin_expr) => self.process_expression(bin_expr.right.deref()),
            Expr::Cond(cond_expr) => {
                let mut children = self.process_expression(cond_expr.cons.deref());
                children.append(&mut self.process_expression(cond_expr.alt.deref()));
                children
            }
            _ => {
                vec![]
            }
        }
    }

    fn processs_declaration(&mut self, decl: &Decl) {
        match decl {
            Decl::Var(var_decl) => self.process_var_declaration(var_decl),
            decl => {
                self.update_statements.push(Stmt::Decl(decl.clone()));
                self.initialize_statements.push(Stmt::Decl(decl.clone()));
            }
        }
    }

    fn process_var_declaration(&mut self, var_decl: &VarDecl) {
        let mut new_var_decl = var_decl.clone();

        new_var_decl.decls = vec![];

        for decl in &var_decl.decls {
            match &decl.init {
                Some(init) => {
                    if let Expr::Call(call_expression) = init.deref() {
                        if is_palta_state_call(&call_expression.clone()) {
                            self.process_palta_state_declaration(&decl.name, call_expression);
                        }
                    } else {
                        let expr_elements = self.process_expression(init);

                        new_var_decl.decls.push(VarDeclarator {
                            span: decl.span,
                            name: decl.name.clone(),
                            init: Some(Box::new(replace_jsx_elements_in_expression(
                                init,
                                &mut VecDeque::from(expr_elements),
                            ))),
                            definite: decl.definite,
                        });
                    }
                }
                None => {
                    new_var_decl.decls.push(decl.clone());
                }
            }
        }

        if !new_var_decl.decls.is_empty() {
            self.update_statements
                .push(Stmt::Decl(Decl::Var(Box::new(new_var_decl.clone()))));
            self.initialize_statements
                .push(Stmt::Decl(Decl::Var(Box::new(new_var_decl.clone()))));
        }
    }

    fn process_palta_state_declaration(&mut self, name: &Pat, call_expression: &CallExpr) {
        if let Pat::Array(array) = name {
            if (array.elems.len() != 1 && array.elems.len() != 2) || array.elems[0].is_none() {
                panic!("Palta state declaration should have one or two elements");
            }

            self.states.push(StateDescriptor {
                variable_name: match array.elems[0].clone().unwrap() {
                    Pat::Ident(ident) => ident.id,
                    _ => panic!("First element of Palta state declaration should be an identifier"),
                },
                updater_name: array.elems[1].clone().map(|pat| match pat {
                    Pat::Ident(ident) => ident.id,
                    _ => {
                        panic!("Second element of Palta state declaration should be an identifier")
                    }
                }),
                initial_value: if call_expression.args.is_empty() {
                    None
                } else {
                    Some(call_expression.args[0].expr.deref().clone())
                },
                type_ann: if let Pat::Ident(ident) = array.elems[0].clone().unwrap() {
                    ident.type_ann.clone()
                } else {
                    None
                },
            });
        } else {
            panic!("Palta state declaration should be an array pattern");
        }
    }

    fn process_palta_effect_call(&mut self, call_expression: &CallExpr) {
        if call_expression.args.len() != 2 {
            panic!("Palta effect should have two arguments");
        }

        let callback = match call_expression.args[0].expr.deref() {
            Expr::Arrow(arrow) => match arrow.body.deref() {
                BlockStmtOrExpr::BlockStmt(block) => block.stmts.clone(),
                BlockStmtOrExpr::Expr(expr) => vec![Stmt::Expr(ExprStmt {
                    span: DUMMY_SP,
                    expr: expr.clone(),
                })],
            },
            _ => panic!("First argument of Palta effect should be an arrow function"),
        };

        let deps = match call_expression.args[1].expr.deref() {
            Expr::Array(array) => array.elems.clone().into_iter().flatten().collect(),
            _ => panic!("Second argument of Palta effect should be an array"),
        };

        let cleanup = match call_expression.args[1].expr.deref() {
            Expr::Arrow(arrow) => match arrow.body.deref() {
                BlockStmtOrExpr::BlockStmt(block) => {
                    let return_statement = block
                        .stmts
                        .iter()
                        .find(|stmt| matches!(stmt, Stmt::Return(_)));

                    return_statement.map(|stmt| match stmt {
                        Stmt::Return(stmt) => match &stmt.arg {
                            Some(arg) => match arg.deref() {
                                Expr::Arrow(arrow) => match arrow.body.deref() {
                                    BlockStmtOrExpr::BlockStmt(block) => block.stmts.clone(),
                                    BlockStmtOrExpr::Expr(expr) => vec![Stmt::Expr(ExprStmt {
                                        span: DUMMY_SP,
                                        expr: expr.clone(),
                                    })],
                                },
                                _ => panic!(
                                    "Return value from an effect should be an arrow function"
                                ),
                            },
                            None => vec![],
                        },
                        _ => vec![],
                    })
                }
                _ => None,
            },
            _ => None,
        };

        self.effects.push(EffectDescriptor {
            deps,
            callback,
            cleanup,
        });
    }

    fn process_jsx_element(&mut self, element: &JSXElement) -> Vec<ElementChildren> {
        let element_descriptor = self.get_element_descriptor(&element.opening);

        if let ElementDescriptor::Children = element_descriptor {
            if self.children_element.is_some() {
                return vec![ElementChildren::Element(self.children_element.unwrap())];
            }
        }

        self.elements.push(element_descriptor);

        let position = self.elements.len() - 1;
        let children = self.process_jsx_children(&element.children, Some(position));
        let props = match self.elements[position] {
            ElementDescriptor::Tag(ref mut tag) => {
                tag.children = children;
                tag.props.clone()
            }
            ElementDescriptor::Component(ref mut component) => {
                component.children = children;
                component.props.clone()
            }
            ElementDescriptor::Children => {
                self.children_element = Some(position);
                None
            }
        };

        if matches!(self.elements[position], ElementDescriptor::Tag(_))
            || matches!(self.elements[position], ElementDescriptor::Component(_))
        {
            self.add_update_props_statement(position, &props);
            self.add_initialize_statement(position, &props);
        }

        vec![ElementChildren::Element(position)]
    }

    fn process_jsx_fragment(&mut self, element: &JSXFragment) -> Vec<ElementChildren> {
        self.process_jsx_children(&element.children, None)
    }

    fn process_jsx_text(&mut self, element: &JSXText) -> Vec<ElementChildren> {
        let value = element.value.as_str().to_string();

        if value.trim().is_empty() {
            return vec![];
        }

        vec![ElementChildren::Text(value)]
    }

    fn process_jsx_expression_container(
        &mut self,
        expression: &JSXExprContainer,
        parent: Option<usize>,
        children_position: usize,
    ) -> Vec<ElementChildren> {
        if let Some(parent) = parent {
            let update_expression = match &expression.expr {
                JSXExpr::Expr(expr) => {
                    let expr_elements = self.process_expression(expr);
                    replace_jsx_elements_in_expression(expr, &mut VecDeque::from(expr_elements))
                }
                expr => jsx_expr_to_expr(expr),
            };

            self.update_statements
                .push(generate_element_update_child_call(
                    parent,
                    children_position,
                    &generate_expression_function(&update_expression),
                ));
            self.initialize_statements
                .push(generate_element_update_child_call(
                    parent,
                    children_position,
                    &generate_expression_function(&update_expression),
                ));
        }

        vec![ElementChildren::Text("".to_string())]
    }

    fn process_jsx_children(
        &mut self,
        children: &Vec<JSXElementChild>,
        parent: Option<usize>,
    ) -> Vec<ElementChildren> {
        let mut result = vec![];

        for child in children {
            let mut children_elements = match child {
                JSXElementChild::JSXElement(element) => self.process_jsx_element(element),
                JSXElementChild::JSXFragment(fragment) => self.process_jsx_fragment(fragment),
                JSXElementChild::JSXText(text) => self.process_jsx_text(text),
                JSXElementChild::JSXExprContainer(expression) => {
                    self.process_jsx_expression_container(expression, parent, result.len())
                }
                JSXElementChild::JSXSpreadChild(_) => {
                    panic!("JSX Spread Child is not supported");
                }
            };
            result.append(&mut children_elements);
        }

        result
    }

    fn add_update_props_statement(&mut self, position: usize, props: &Option<ObjectLit>) {
        if let Some(props) = props {
            self.update_statements
                .push(generate_element_update_props_call(position, props));
        }
    }

    fn add_initialize_statement(&mut self, position: usize, props: &Option<ObjectLit>) {
        self.initialize_statements
            .push(generate_element_initialize_call(position, props));
    }

    fn get_element_descriptor(&mut self, element: &JSXOpeningElement) -> ElementDescriptor {
        match element.name.clone() {
            JSXElementName::Ident(ident) if ident.sym == "Children" => ElementDescriptor::Children,
            JSXElementName::Ident(ident) if HTML_ELEMENT_TAGS.contains(&ident.sym.as_str()) => {
                ElementDescriptor::Tag(TagElementDescriptor {
                    tag: ident.sym.as_str().to_string(),
                    children: vec![],
                    props: self.get_element_props(element),
                })
            }
            JSXElementName::Ident(ident) => {
                ElementDescriptor::Component(ComponentElementDescriptor {
                    component: ComponentName::Identifier(ident.clone()),
                    children: vec![],
                    props: self.get_element_props(element),
                })
            }
            JSXElementName::JSXMemberExpr(member_expression) => {
                ElementDescriptor::Component(ComponentElementDescriptor {
                    component: ComponentName::MemberExpression(jsx_member_expr_to_member_expr(
                        &member_expression,
                    )),
                    children: vec![],
                    props: self.get_element_props(element),
                })
            }
            JSXElementName::JSXNamespacedName(_) => {
                panic!("JSX Namespaced Name is not supported");
            }
        }
    }

    fn get_element_props(&mut self, element: &JSXOpeningElement) -> Option<ObjectLit> {
        if element.attrs.is_empty() {
            return None;
        }

        Some(ObjectLit {
            span: element.span,
            props: element
                .attrs
                .iter()
                .map(|attr| match attr {
                    JSXAttrOrSpread::JSXAttr(attr) => {
                        PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                            key: PropName::Ident(match &attr.name {
                                JSXAttrName::Ident(ident) => ident.clone(),
                                JSXAttrName::JSXNamespacedName(_) => {
                                    panic!("JSX Namespaced Name is not supported")
                                }
                            }),
                            value: match attr.value.clone() {
                                Some(value) => Box::new(match value {
                                    JSXAttrValue::Lit(lit) => Expr::Lit(lit.clone()),
                                    JSXAttrValue::JSXExprContainer(container) => {
                                        match &container.expr {
                                            JSXExpr::Expr(expr) => {
                                                let expr_elements = self.process_expression(expr);
                                                replace_jsx_elements_in_expression(
                                                    expr,
                                                    &mut VecDeque::from(expr_elements),
                                                )
                                            }
                                            _ => jsx_expr_to_expr(&container.expr),
                                        }
                                    }
                                    _ => panic!("JSX Attribute Value is not supported"), // TODO: SUpport jsxElement as prop
                                }),
                                None => Box::new(Expr::Lit(Lit::Bool(Bool {
                                    span: DUMMY_SP,
                                    value: true,
                                }))),
                            },
                        })))
                    }
                    JSXAttrOrSpread::SpreadElement(spread) => PropOrSpread::Spread(spread.clone()),
                })
                .collect(),
        })
    }
}
