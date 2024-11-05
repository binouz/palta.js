import HtmlNodeGroup from "./HtmlElementGroup";
import { PaltaChildrenElement, PaltaElementSymbol, PaltaNode } from "./types";
import { getHtmlNodeGroupChildFromPaltaNode, isPaltaElement } from "./utils";

class Children implements PaltaChildrenElement {
  [PaltaElementSymbol]: "children" = "children";

  private _children: PaltaNode[] = [];
  private _nodeGroup: HtmlNodeGroup = new HtmlNodeGroup();

  mount() {
    return this._nodeGroup;
  }

  unmount() {
    this._nodeGroup.clear();

    for (const child of this._children) {
      if (isPaltaElement(child)) {
        child.unmount();
      }
    }
  }

  updateChild(index: number, value: () => PaltaNode) {
    const node = value();
    this._children[index] = node;
    this._nodeGroup.replaceChild(
      index,
      getHtmlNodeGroupChildFromPaltaNode(node)
    );
  }

  setNodes(value: PaltaNode[]) {
    this._children = value;
  }
}

export const createChildren = (): PaltaChildrenElement => new Children();
