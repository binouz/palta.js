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
