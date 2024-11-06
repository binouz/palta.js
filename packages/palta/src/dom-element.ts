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

import { PaltaElementSymbol, PaltaTagElement, PaltaNode } from "./types";
import { EVENT_MAP, EVENT_NAME, EventName } from "./events";
import { getHtmlNodeGroupChildFromPaltaNode, unmountPaltaNode } from "./utils";
import HtmlNodeGroup from "./HtmlNodeGroup";

class DomElement<Tag extends keyof HTMLElementTagNameMap>
  implements PaltaTagElement<JSX.IntrinsicElements[Tag]>
{
  [PaltaElementSymbol]: "tag" = "tag";

  private _htmlElement: HTMLElement;
  private _nodeGroup: HtmlNodeGroup;
  private _children: PaltaNode[];

  private _boundEventListeners = new Map<EventName, EventListener>();

  constructor(tag: Tag, children: PaltaNode[]) {
    this._htmlElement = document.createElement(tag);
    this._children = children;
    this._nodeGroup = new HtmlNodeGroup();
  }

  initialize(props: JSX.IntrinsicElements[Tag]) {
    this.clearEventListeners();
    this.setHtmlElementProps(props);
    this._nodeGroup.appendToParent(this._htmlElement);
  }

  mount() {
    this._nodeGroup.push(
      ...this._children.map(getHtmlNodeGroupChildFromPaltaNode)
    );
    return this._htmlElement;
  }

  unmount() {
    for (const child of this._children) {
      unmountPaltaNode(child);
    }

    this._nodeGroup.clear();
  }

  updateProps(props: JSX.IntrinsicElements[Tag]) {
    this.clearEventListeners();
    this.setHtmlElementProps(props);
  }

  updateChild(index: number, value: () => PaltaNode) {
    const node = value();

    if (index < this._children.length) {
      if (node === this._children[index]) {
        return;
      }

      unmountPaltaNode(this._children[index]);
    }

    this._children[index] = node;
    this._nodeGroup.replaceChild(
      index,
      getHtmlNodeGroupChildFromPaltaNode(node)
    );
  }

  private clearEventListeners() {
    for (const [key, value] of this._boundEventListeners) {
      this._htmlElement.removeEventListener(EVENT_MAP[key], value);
    }
    this._boundEventListeners.clear();
  }

  private setHtmlElementProps(props: any) {
    this._boundEventListeners = new Map<EventName, EventListener>();

    for (const [key, value] of Object.entries(props as Record<string, any>)) {
      if (key === "style") {
        if (!value || typeof value !== "object") continue;

        for (const [styleKey, styleValue] of Object.entries(
          value as Record<string, string>
        )) {
          this._htmlElement.style[styleKey as any] = styleValue;
        }
        continue;
      } else if (key === "className") {
        this._htmlElement.className = value;
        continue;
      }

      if (EVENT_NAME.includes(key as string)) {
        this._htmlElement.addEventListener(EVENT_MAP[key as EventName], value);
        this._boundEventListeners.set(key as EventName, value);
        continue;
      }

      this._htmlElement.setAttribute(key, value as string);
    }
  }
}

export const createElement = <Tag extends keyof HTMLElementTagNameMap>(
  tag: Tag,
  children: PaltaNode[]
): PaltaTagElement<JSX.IntrinsicElements[Tag]> => new DomElement(tag, children);
