import {
  PaltaElement,
  PaltaNode,
  PaltaElementSymbol,
  PaltaTagElement,
  PaltaComponentElement,
  PaltaChildrenElement,
} from "./types";
import { EVENT_MAP, EVENT_NAME, EventName } from "./events";
import { Scheduler } from "./scheduler";

type PaltaComponentDefinition<P = any> = {
  childrenElement: PaltaChildrenElement | null;
  initialize: (props: P) => void;
  update: (props: P) => void;
  getRoot: () => PaltaElement;
};

type PaltaComponent<T = any> = () => PaltaComponentDefinition<T>;

const setHtmlElementProps = (element: HTMLElement, props: any) => {
  const boundEventListeners = new Map<EventName, EventListener>();

  for (const [key, value] of Object.entries(props as Record<string, any>)) {
    if (key === "style") {
      if (!value || typeof value !== "object") continue;

      for (const [styleKey, styleValue] of Object.entries(
        value as Record<string, string>
      )) {
        element.style[styleKey as any] = styleValue;
      }
      continue;
    } else if (key === "className") {
      element.className = value;
      continue;
    }

    if (EVENT_NAME.includes(key as string)) {
      element.addEventListener(EVENT_MAP[key as EventName], value);
      boundEventListeners.set(key as EventName, value);
      continue;
    }

    element.setAttribute(key, value as string);
  }

  return boundEventListeners;
};

const clearEventListeners = (
  element: HTMLElement,
  listeners: Map<EventName, EventListener>
) => {
  for (const [key, value] of listeners) {
    element.removeEventListener(EVENT_MAP[key], value);
  }
  listeners.clear();
};

const isPaltaElement = (node: PaltaNode): node is PaltaElement =>
  !!node && typeof node === "object" && PaltaElementSymbol in node;

const isTagElement = (node: PaltaNode): node is PaltaTagElement =>
  isPaltaElement(node) && node[PaltaElementSymbol] === "tag";

const isComponentElement = (node: PaltaNode): node is PaltaComponentElement =>
  isPaltaElement(node) && node[PaltaElementSymbol] === "component";

const isElementWithChildren = (
  node: PaltaNode
): node is PaltaTagElement | PaltaComponentElement =>
  isTagElement(node) || isComponentElement(node);

const isIterable = (value: PaltaNode): value is Iterable<PaltaNode> =>
  !!value && typeof value === "object" && Symbol.iterator in value;

const mountChildren = (
  element: HTMLElement,
  children: PaltaNode[],
  index: number = 0
) => {
  for (const child of children) {
    if (typeof child === "string" || typeof child === "number") {
      const textNode = document.createTextNode(child.toString());

      if (element.childNodes[index]) {
        element.insertBefore(textNode, element.childNodes[index]);
      } else {
        element.appendChild(textNode);
      }
    } else if (isPaltaElement(child)) {
      child.mount(element, index);
    } else if (isIterable(child)) {
      mountChildren(element, Array.from(child), index);
    } else {
      continue;
    }

    index += 1;
  }
};

const unmountChildren = (children: PaltaNode[]) => {
  for (const child of children) {
    if (isPaltaElement(child)) {
      child.unmount();
    } else if (isIterable(child)) {
      unmountChildren(Array.from(child));
    }
  }
};

const updateElementChild = (
  element: HTMLElement,
  index: number,
  child: PaltaNode
) => {
  if (isPaltaElement(child)) {
    child.mount(element, index);
    return;
  }

  if (isIterable(child)) {
    mountChildren(element, Array.from(child), index);
    return;
  }

  const existingNode = element.childNodes[index];

  if (child === undefined || child === null || child === false) {
    existingNode && element.removeChild(existingNode);
    return;
  }

  const textNode = document.createTextNode(child.toString());

  if (existingNode) {
    element.replaceChild(textNode, existingNode);
  } else {
    element.appendChild(textNode);
  }
};

namespace Palta {
  export type Element = PaltaElement;
  export type Node = PaltaNode;
  export type ComponentDefinition<T = any> = PaltaComponentDefinition<T>;
  export type Component<T = any> = PaltaComponent<T>;

  export const createComponent = <P extends any>(
    component: Component<P>,
    children: Node[]
  ): PaltaComponentElement<P> => {
    const { childrenElement, update, getRoot, initialize } = component();

    return {
      [PaltaElementSymbol]: "component",
      initialize,
      mount: (parent, index) => {
        if (childrenElement) {
          childrenElement.setValue(children);
        }

        getRoot().mount(parent, index);
      },
      unmount: () => {
        if (childrenElement) {
          childrenElement.setValue([]);
        }

        getRoot().unmount();
      },
      updateProps: update,
      updateChild: (index: number, value: () => any) => {
        const root = getRoot();

        if (isElementWithChildren(root)) {
          root.updateChild(index, value);
        }
      },
      getHtmlElement: () => {
        return getRoot().getHtmlElement();
      },
    } as PaltaComponentElement<P>;
  };

  export const createElement = <Tag extends keyof HTMLElementTagNameMap>(
    tag: Tag,
    children: Node[],
  ): PaltaTagElement<JSX.IntrinsicElements[Tag]> => {
    const element = document.createElement(tag);
    let boundEventListeners = new Map<EventName, EventListener>();

    return {
      [PaltaElementSymbol]: "tag",
      initialize: (props) => {
        clearEventListeners(element, boundEventListeners);
        boundEventListeners = setHtmlElementProps(element, props);
      },
      mount: (parent, index) => {
        const existingNode = parent.childNodes[index];

        if (existingNode) {
          parent.insertBefore(element, existingNode);
        } else {
          parent.appendChild(element);
        }

        mountChildren(element, children);

        return element;
      },
      unmount: () => {
        clearEventListeners(element, boundEventListeners);
        unmountChildren(children);
        element.remove();
      },
      updateProps: (props) => {
        clearEventListeners(element, boundEventListeners);
        boundEventListeners = setHtmlElementProps(element, props);
      },
      updateChild: (index: number, value: () => PaltaNode) => {
        updateElementChild(element, index, value());
      },
      getHtmlElement: () => {
        return element;
      },
    } as PaltaTagElement;
  };

  export const createChildren = (): PaltaChildrenElement => {
    let children: Node[] = [];
    let _parent: HTMLElement;

    return {
      [PaltaElementSymbol]: "children",
      mount: (parent, index) => {
        mountChildren(parent, children, index);
      },
      unmount: () => {
        unmountChildren(children);
      },
      setValue: (value: Node[]) => {
        children = value;
      },
      getHtmlElement: () => {
        return _parent;
      },
    } as PaltaChildrenElement;
  };

  export const render = (selector: string, component: () => JSX.Element) => {
    const root = document.querySelector(selector);

    if (!root) {
      throw new Error(`Element with selector "${selector}" not found`);
    }

    Scheduler.init();

    const instance = createComponent(
      component as unknown as Palta.Component,
      []
    ) as PaltaComponentElement;

    instance.mount(root as HTMLElement, 0);
    instance.initialize({});
    instance.updateProps({});

    Scheduler.get().start();
  };

  export const componentUpdate = (fn: () => void) => {
    Scheduler.get().enqueueUpdate(fn);
  };

  export const runEffect = (
    effect: {
      deps: null | any[];
    },
    callback: () => void,
    cleanup: (() => void) | null,
    deps: any[]
  ) => {
    const shouldRun =
      effect.deps === null || effect.deps.some((dep, i) => dep !== deps[i]);

    if (shouldRun) {
      if (cleanup) {
        cleanup();
      }

      callback();
    }

    effect.deps = deps;
  };
}

declare namespace Palta {
  export type StateUpdaterValue<T> = T | ((v: T) => T);
  export type StateUpdater<T> = (value: StateUpdaterValue<T>) => void;
}

export default Palta;

export const $state = <T = any>(value: T): [T, Palta.StateUpdater<T>] => {
  return [value, (_: Palta.StateUpdaterValue<T>) => {}];
};

export const $effect = (_callback: () => void, _deps: any[]) => {};

export const Children = (): JSX.Element => ({} as JSX.Element);

export const For = <T extends any>(_: {
  each: T[];
  component: (props: T) => JSX.Element;
  key: (value: T) => any;
}): JSX.Element => {
  let _parent: HTMLElement | null = null;
  let _index: number = 0;
  let _elements: Map<any, {
    position: number;
    paltaElement: PaltaComponentElement;
    htmlElement: ChildNode;
  }> = new Map();

  const update = ({
    each,
    component,
    key,
  }: {
    each: T[];
    component: PaltaComponent<T>;
    key: (value: T) => any;
  }) => {
    if (!each) {
      return;
    }

    const updatedElements: Map<
      any,
      {
        position: number;
        paltaElement: PaltaComponentElement;
        htmlElement: ChildNode;
      }
    > = new Map();

    for (let i = 0; i < each.length; i++) {
      const value = each[i];
      const keyValue = key(value);
      const isExisting = _elements.has(keyValue);
      const instance: PaltaComponentElement = isExisting
        ? _elements.get(keyValue)!.paltaElement
        : Palta.createComponent(component, []);
      let htmlElement: ChildNode;

      if (isExisting) {
        if (_elements.get(keyValue)!.position !== i) {
          _parent!.insertBefore(_elements.get(keyValue)!.htmlElement, _parent!.childNodes[_index + i]);
        }

        htmlElement = _elements.get(keyValue)!.htmlElement;
        instance.updateProps(value);
      } else {
        instance.mount(_parent!, _index + i);
        instance.initialize(value);
        htmlElement = instance.getHtmlElement();
      }

      updatedElements.set(keyValue, {
        position: i,
        paltaElement: instance,
        htmlElement,
      });
    }

    for (const key of Array.from(_elements.keys()).filter((key) => !updatedElements.has(key))) {
      const elm = _elements.get(key)!
      elm.paltaElement.unmount();
    }

    _elements = updatedElements;
  };

  const root = {
    [PaltaElementSymbol]: "component",
    initialize: update,
    mount: (parent, index) => {
      _parent = parent;
      _index = index;
      _elements = new Map();
      return parent;
    },
    unmount: () => {
      _elements.forEach((element) => element.paltaElement.unmount());
      _elements.clear();
    },
    updateProps: update,
    updateChild: () => {},
    getHtmlElement: () => {
      return _parent;
    },
  } as PaltaComponentElement;

  return {
    childrenElement: null,
    initialize: update,
    update,
    getRoot: () => root,
  } as unknown as JSX.Element;
};
