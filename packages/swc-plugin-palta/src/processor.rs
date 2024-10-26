use core::panic;
use std::ops::Deref;

use swc_core::common::DUMMY_SP;
use swc_core::ecma::ast::{
    ArrowExpr, BlockStmt, BlockStmtOrExpr, Bool, CallExpr, Callee, Decl, Expr, Function, Ident,
    JSXAttrName, JSXAttrOrSpread, JSXAttrValue, JSXElement, JSXElementChild, JSXElementName,
    JSXExprContainer, JSXFragment, JSXOpeningElement, JSXText, KeyValueProp, Lit, MemberExpr,
    ObjectLit, ParenExpr, Pat, Prop, PropName, PropOrSpread, ReturnStmt, Stmt, TsTypeAnn,
    VarDeclarator,
};

use crate::generators::{
    generate_element_update_child_call, generate_element_update_props_call,
    generate_expression_function,
};
use crate::utils::{jsx_expr_to_expr, jsx_member_expr_to_member_expr};

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

pub struct Processor {
    elements: Vec<ElementDescriptor>,
    children_element: Option<usize>,
    update_statements: Vec<Stmt>,
    root_element: Option<usize>,
    states: Vec<StateDescriptor>,
}

fn get_element_props(element: &JSXOpeningElement) -> Option<ObjectLit> {
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
                                    jsx_expr_to_expr(&container.expr)
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

fn get_element_descriptor(element: &JSXOpeningElement) -> ElementDescriptor {
    match element.name.clone() {
        JSXElementName::Ident(ident) if ident.sym == "Children" => ElementDescriptor::Children,
        JSXElementName::Ident(ident) if HTML_ELEMENT_TAGS.contains(&ident.sym.as_str()) => {
            ElementDescriptor::Tag(TagElementDescriptor {
                tag: ident.sym.as_str().to_string(),
                children: vec![],
                props: get_element_props(element),
            })
        }
        JSXElementName::Ident(ident) => ElementDescriptor::Component(ComponentElementDescriptor {
            component: ComponentName::Identifier(ident.clone()),
            children: vec![],
            props: get_element_props(element),
        }),
        JSXElementName::JSXMemberExpr(member_expression) => {
            ElementDescriptor::Component(ComponentElementDescriptor {
                component: ComponentName::MemberExpression(jsx_member_expr_to_member_expr(
                    &member_expression,
                )),
                children: vec![],
                props: get_element_props(element),
            })
        }
        JSXElementName::JSXNamespacedName(_) => {
            panic!("JSX Namespaced Name is not supported");
        }
    }
}

fn is_palta_state_call(call_expression: &CallExpr) -> bool {
    if let Callee::Expr(callee) = &call_expression.callee {
        if let Expr::Ident(ident) = callee.deref() {
            return ident.sym == "$state";
        }
    }

    false
}

impl Processor {
    pub fn new() -> Self {
        Processor {
            elements: vec![],
            children_element: None,
            update_statements: vec![],
            root_element: None,
            states: vec![],
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

    pub fn get_update_statements(&self) -> &Vec<Stmt> {
        &self.update_statements
    }

    pub fn get_states(&self) -> &Vec<StateDescriptor> {
        &self.states
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
                stmt => {
                    self.update_statements.push(stmt.clone());
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

    fn processs_declaration(&mut self, decl: &Decl) {
        match decl {
            Decl::Var(var_decl) => {
                for decl in &var_decl.decls {
                    self.process_var_declarator(decl);
                }
            }
            Decl::Fn(_) => {}
            _ => {}
        }
    }

    fn process_var_declarator(&mut self, decl: &VarDeclarator) {
        if decl.init.is_none() {
            return;
        }

        if let Expr::Call(call_expression) = decl.init.as_ref().unwrap().deref() {
            if is_palta_state_call(&call_expression.clone()) {
                self.process_palta_state_declaration(&decl.name, call_expression);
            }
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

    fn process_jsx_element(&mut self, element: &JSXElement) -> Vec<ElementChildren> {
        let element_descriptor = get_element_descriptor(&element.opening);

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

        self.add_update_props_statement(position, &props);

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
            self.update_statements
                .push(generate_element_update_child_call(
                    parent,
                    children_position,
                    &generate_expression_function(&expression.expr),
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
}
