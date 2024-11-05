import { HtmlNodeGroupChild } from "./HtmlElementGroup";

export const PaltaElementSymbol = Symbol();

export interface PaltaElement {
  [PaltaElementSymbol]:
    | "tag"
    | "component"
    | "children"
    | "fragment"
    | "builtin";
  mount: () => HtmlNodeGroupChild;
  unmount: () => void;
}

export interface PaltaTagElement<P = any> extends PaltaElement {
  [PaltaElementSymbol]: "tag";
  initialize: (props: P) => void;
  updateProps: (props: P) => void;
  updateChild: (index: number, value: () => any) => void;
}

export interface PaltaComponentElement<P = any> extends PaltaElement {
  [PaltaElementSymbol]: "component" | "builtin";
  initialize: (props: P) => void;
  updateProps: (props: P) => void;
  updateChild: (index: number, value: () => any) => void;
}

export interface PaltaChildrenElement extends PaltaElement {
  [PaltaElementSymbol]: "children";
  setNodes: (nodes: PaltaNode[]) => void;
  updateChild: (index: number, value: () => any) => void;
}

export interface PaltaBuiltinComponent<P = any> extends PaltaElement {
  [PaltaElementSymbol]: "builtin";
  initialize: (props: P) => void;
  updateProps: (props: P) => void;
}

export type PaltaNode =
  | PaltaElement
  | string
  | number
  | Iterable<PaltaNode>
  // TODO: | PaltaPortal
  | boolean
  | null
  | undefined;

export type PaltaComponentDefinition<P = any> = {
  childrenElement: PaltaChildrenElement | null;
  initialize: (props: P) => void;
  update: (props: P) => void;
  getRoot: () => PaltaElement;
};

export type PaltaComponent<T = any> = () =>
  | PaltaComponentDefinition<T>
  | PaltaBuiltinComponent<T>;

export type PaltaChildNode = {
  value: PaltaElement | PaltaChildNode[] | ChildNode | null;
  position: number;
  length: number;
};
