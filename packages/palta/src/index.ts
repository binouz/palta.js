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
  PaltaElement,
  PaltaNode,
  PaltaComponentDefinition,
  PaltaComponentElement,
  PaltaComponent,
} from "./types";

import { createComponent as _createComponent } from "./component";
import { createElement as _createElement } from "./dom-element";
import { createChildren as _createChildren } from "./children";
import { For as _For } from "./for";

import { Scheduler } from "./scheduler";
import HtmlNodeGroup from "./HtmlNodeGroup";

namespace Palta {
  export type Element = PaltaElement;
  export type Node = PaltaNode;
  export type ComponentDefinition<T = any> = PaltaComponentDefinition<T>;
  export type Component<T = any> = PaltaComponent<T>;

  export const createComponent = _createComponent;

  export const createElement = _createElement;

  export const createChildren = _createChildren;

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
    const rootGroup = new HtmlNodeGroup();

    instance.initialize({});
    rootGroup.push(instance.mount());
    instance.updateProps({});

    rootGroup.appendToParent(root);

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

export const For = _For;

export type * from "./runtime";