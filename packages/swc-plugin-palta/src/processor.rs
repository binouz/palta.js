use core::panic;
use std::ops::Deref;

use swc_core::ecma::ast::{
    ArrowExpr, BlockStmt, BlockStmtOrExpr, Expr, Function, Ident, JSXElement, JSXElementChild,
    JSXElementName, JSXExprContainer, JSXFragment, JSXText, MemberExpr, ParenExpr, ReturnStmt,
    Stmt,
};

use crate::generators::{generate_element_set_children_call, generate_expression_function};
use crate::utils::jsx_member_expr_to_member_expr;

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
}

#[derive(Debug)]
pub struct ComponentElementDescriptor {
    pub component: ComponentName,
    pub children: Vec<ElementChildren>,
}

#[derive(Debug)]
pub struct FragmentElementDescriptor {
    pub children: Vec<ElementChildren>,
}

#[derive(Debug)]
pub enum ElementDescriptor {
    Tag(TagElementDescriptor),
    Component(ComponentElementDescriptor),
    Fragment(FragmentElementDescriptor),
    Children,
}

pub struct Processor {
    elements: Vec<ElementDescriptor>,
    update_statements: Vec<Stmt>,
    root_element: Option<usize>,
}

fn get_element_descriptor(element_name: &JSXElementName) -> ElementDescriptor {
    match element_name {
        JSXElementName::Ident(ident) if ident.sym == "Children" => ElementDescriptor::Children,
        JSXElementName::Ident(ident) if HTML_ELEMENT_TAGS.contains(&ident.sym.as_str()) => {
            ElementDescriptor::Tag(TagElementDescriptor {
                tag: ident.sym.as_str().to_string(),
                children: vec![],
            })
        }
        JSXElementName::Ident(ident) => ElementDescriptor::Component(ComponentElementDescriptor {
            component: ComponentName::Identifier((*ident).clone()),
            children: vec![],
        }),
        JSXElementName::JSXMemberExpr(member_expression) => {
            ElementDescriptor::Component(ComponentElementDescriptor {
                component: ComponentName::MemberExpression(jsx_member_expr_to_member_expr(
                    member_expression,
                )),
                children: vec![],
            })
        }
        JSXElementName::JSXNamespacedName(_) => {
            panic!("JSX Namespaced Name is not supported");
        }
    }
}

impl Processor {
    pub fn new() -> Self {
        Processor {
            elements: vec![],
            update_statements: vec![],
            root_element: None,
        }
    }

    pub fn get_root_element(&self) -> Option<usize> {
        self.root_element
    }

    pub fn get_elements(&self) -> &Vec<ElementDescriptor> {
        &self.elements
    }

    pub fn get_update_statements(&self) -> &Vec<Stmt> {
        &self.update_statements
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
                Stmt::Decl(_) => {}
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

    fn process_jsx_element(&mut self, element: &JSXElement) -> Vec<ElementChildren> {
        self.elements
            .push(get_element_descriptor(&element.opening.name));
        let position = self.elements.len() - 1;

        let children = self.process_jsx_children(&element.children, Some(position));

        match self.elements[position] {
            ElementDescriptor::Tag(ref mut tag) => {
                tag.children = children;
            }
            ElementDescriptor::Component(ref mut component) => {
                component.children = children;
            }
            ElementDescriptor::Fragment(ref mut fragment) => {
                fragment.children = children;
            }
            ElementDescriptor::Children => {
                panic!("Children element should not have children");
            }
        };

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
                .push(generate_element_set_children_call(
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
}
