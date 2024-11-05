import { createComponent } from "./component";
import HtmlNodeGroup, { HtmlNodeGroupChild } from "./HtmlElementGroup";
import {
  PaltaBuiltinComponent,
  PaltaComponent,
  PaltaComponentElement,
  PaltaElementSymbol,
} from "./types";

type ForProps<T extends any, K extends any> = {
  each: T[];
  component: PaltaComponent<T>;
  key: (value: T) => K;
};

type ForInternalProps<T extends any, K extends any> = Omit<
  ForProps<T, K>,
  "component"
> & {
  component: PaltaComponent<T>;
};

class ForComponent<T extends any, K extends any>
  implements PaltaBuiltinComponent<ForInternalProps<T, K>>
{
  [PaltaElementSymbol]: "builtin" = "builtin";

  private _nodeGroup: HtmlNodeGroup;
  private _each: T[];
  private _componentMap: Map<
    K,
    PaltaComponentElement<T> | PaltaBuiltinComponent<T>
  >;
  private _nodeMap: Map<K, HtmlNodeGroupChild>;
  private _currentNodePositions: K[];

  private _component: PaltaComponent<T> | null = null;
  private _key: ((value: T) => K) | null = null;

  constructor() {
    this._nodeGroup = new HtmlNodeGroup();
    this._each = [];
    this._componentMap = new Map();
    this._nodeMap = new Map();
    this._currentNodePositions = [];
  }

  initialize(props: ForInternalProps<T, K>) {
    this._each = props.each;
    this._component = props.component;
    this._key = props.key;

    this.updateChildren();
  }

  updateProps(props: ForInternalProps<T, K>) {
    this._each = props.each;
    this._component = props.component;
    this._key = props.key;

    this.updateChildren();
  }

  updateChild(_index: number, _value: () => any) {
    console.warn("ForComponent cannot have children");
  }

  mount() {
    this.updateChildren();

    return this._nodeGroup;
  }

  unmount() {
    this._nodeGroup.clear();

    for (const component of this._componentMap.values()) {
      component.unmount();
    }

    this._componentMap.clear();
    this._nodeMap.clear();
    this._currentNodePositions = [];
  }

  private updateChildren() {
    const newPositions = this.updateComponentChildren();
    const toDelete = this.updateChildrenPositions(newPositions);

    this.removeChildren(toDelete);

    this._currentNodePositions = newPositions;
  }

  private updateComponentChildren() {
    const newPositions = [];

    for (let i = 0; i < this._each.length; i++) {
      const value = this._each[i];
      const key = this._key!(value);
      const component = this._componentMap.get(key);

      if (component) {
        component.updateProps(value);
      } else {
        const component = createComponent(this._component!, []);
        const node = component.mount();
        component.initialize(value);
        this._componentMap.set(key, component);
        this._nodeMap.set(key, node);
        this._nodeGroup.push(node);
      }

      newPositions.push(key);
    }

    return newPositions;
  }

  private updateChildrenPositions(newPositions: K[]) {
    const toDelete = [];

    for (
      let position = 0;
      position < this._currentNodePositions.length;
      position++
    ) {
      const key = this._currentNodePositions[position];

      if (!newPositions.includes(key)) {
        toDelete.push(key);
        continue;
      }

      const newPosition = newPositions.indexOf(key);

      if (
        newPosition !== position &&
        newPosition < this._nodeGroup.length
      ) {
        this._nodeGroup.replaceChild(
          newPosition,
          this._nodeMap.get(newPositions[newPosition])!
        );
      }
    }

    return toDelete;
  }

  private removeChildren(children: K[]) {
    for (const key of children) {
      const node = this._nodeMap.get(key)!;

      this._componentMap.get(key)!.unmount();

      if (this._nodeGroup.contains(node)) {
        this._nodeGroup.remove(node);
      }

      this._componentMap.delete(key);
      this._nodeMap.delete(key);
    }
  }
}

export const For = <T extends any, K extends any>(
  _: ForProps<T, K>
): JSX.Element => new ForComponent();
