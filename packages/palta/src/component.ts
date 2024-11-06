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
