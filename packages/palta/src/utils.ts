import HtmlNodeGroup, { HtmlNodeGroupChild } from "./HtmlNodeGroup";
import {
  PaltaElementSymbol,
  PaltaNode,
  PaltaElement,
  PaltaTagElement,
  PaltaComponentElement,
  PaltaComponentDefinition,
  PaltaBuiltinComponent,
} from "./types";

export const isPaltaElement = (node: PaltaNode): node is PaltaElement =>
  !!node && typeof node === "object" && PaltaElementSymbol in node;

export const isTagElement = (node: PaltaNode): node is PaltaTagElement =>
  isPaltaElement(node) && node[PaltaElementSymbol] === "tag";

export const isComponentElement = (
  node: PaltaNode
): node is PaltaComponentElement =>
  isPaltaElement(node) && node[PaltaElementSymbol] === "component";

export const isIterable = (node: PaltaNode): node is Iterable<PaltaNode> =>
  !!node && typeof node === "object" && Symbol.iterator in node;

export const isBuiltinComponent = <T extends any>(
  component: PaltaComponentDefinition<T> | PaltaBuiltinComponent<T>
): component is PaltaBuiltinComponent<T> =>
  typeof component === "object" &&
  PaltaElementSymbol in component &&
  component[PaltaElementSymbol] === "builtin";

export const getHtmlNodeGroupChildFromPaltaNode = (
  node: PaltaNode
): HtmlNodeGroupChild => {
  if (typeof node === "string" || typeof node === "number" || node === true) {
    return document.createTextNode(node.toString());
  } else if (isPaltaElement(node)) {
    return node.mount();
  } else if (isIterable(node)) {
    const group = new HtmlNodeGroup();
    group.push(...Array.from(node).map(getHtmlNodeGroupChildFromPaltaNode));
    return group;
  }

  return null;
};

export const unmountPaltaNode = (node: PaltaNode) => {
  if (isPaltaElement(node)) {
    node.unmount();
  } else if (isIterable(node)) {
    for (const child of node) {
      unmountPaltaNode(child);
    }
  }
};
