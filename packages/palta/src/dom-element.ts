import { PaltaElementSymbol, PaltaTagElement, PaltaNode } from "./types";
import { EVENT_MAP, EVENT_NAME, EventName } from "./events";
import { getHtmlNodeGroupChildFromPaltaNode, isPaltaElement } from "./utils";
import HtmlNodeGroup from "./HtmlElementGroup";

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
  }

  mount() {
    this._nodeGroup.appendToParent(this._htmlElement);
    this._nodeGroup.push(
      ...this._children.map(getHtmlNodeGroupChildFromPaltaNode)
    );
    return this._htmlElement;
  }

  unmount() {
    this.clearEventListeners();
    this._nodeGroup.clear();

    for (const child of this._children) {
      if (isPaltaElement(child)) {
        child.unmount();
      }
    }
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

      if (isPaltaElement(this._children[index])) {
        this._children[index].unmount();
      }
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
