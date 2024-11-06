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

import {
  PaltaElementSymbol,
  PaltaComponentElement,
  PaltaComponent,
  PaltaNode,
  PaltaChildrenElement,
  PaltaElement,
  PaltaComponentDefinition,
  PaltaBuiltinComponent,
} from "./types";
import { isBuiltinComponent } from "./utils";
import HtmlNodeGroup from "./HtmlNodeGroup";

class Component<P extends any> implements PaltaComponentElement<P> {
  [PaltaElementSymbol]: "component" = "component";

  private _nodeGroup: HtmlNodeGroup;
  private _childrenElement: PaltaChildrenElement | null;
  private _children: PaltaNode[] = [];

  private _initialize: (props: P) => void;
  private _update: (props: P) => void;
  private _getRoot: () => PaltaElement;

  constructor(definition: PaltaComponentDefinition<P>, children: PaltaNode[]) {
    this._nodeGroup = new HtmlNodeGroup();
    this._childrenElement = definition.childrenElement;
    this._children = children;
    this._initialize = definition.initialize;
    this._update = definition.update;
    this._getRoot = definition.getRoot;
  }

  initialize(props: P) {
    this._initialize(props);
  }

  updateProps(props: P) {
    this._update(props);
  }

  updateChild(index: number, value: () => any) {
    this._childrenElement?.updateChild(index, value);
  }

  mount() {
    if (this._childrenElement) {
      this._childrenElement.setNodes(this._children);
    }

    this._nodeGroup.push(this._getRoot().mount());

    return this._nodeGroup;
  }

  unmount() {
    this._getRoot().unmount();
    this._nodeGroup.clear();
  }
}

export const createComponent = <P extends any>(
  component: PaltaComponent<P>,
  children: PaltaNode[]
): PaltaComponentElement<P> | PaltaBuiltinComponent<P> => {
  const componentDefinition = component();

  return isBuiltinComponent(componentDefinition)
    ? componentDefinition
    : new Component(componentDefinition, children);
};
