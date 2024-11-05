export type HtmlNodeGroupChild = HtmlNodeGroup | ChildNode | null;

const appendNode = (parent: Node, node: HtmlNodeGroupChild) => {
  if (node instanceof HtmlNodeGroup) {
    node.appendToParent(parent);
  } else if (node) {
    parent.appendChild(node);
  }
};

const removeNode = (node: HtmlNodeGroupChild) => {
  if (node instanceof HtmlNodeGroup) {
    node.removeFromNode();
  } else if (node) {
    node.remove();
  }
};

class HtmlNodeGroup {
  private _parent: Node | null = null;
  private _children: HtmlNodeGroupChild[] = [];

  appendToParent(parent: Node) {
    if (parent === this._parent) {
      return;
    }

    for (const child of this._children) {
      removeNode(child);
      appendNode(parent, child);
    }

    this._parent = parent;
  }

  removeFromNode() {
    for (const child of this._children) {
      removeNode(child);
    }

    this._parent = null;
  }

  push(...node: HtmlNodeGroupChild[]) {
    this._children.push(...node);

    if (!this._parent) {
      return;
    }

    for (const child of node) {
      if (node) {
        appendNode(this._parent, child);
      }
    }
  }

  remove(...node: HtmlNodeGroupChild[]) {
    for (const child of node) {
      const index = this._children.indexOf(child);

      if (index === -1) {
        continue;
      }

      this._children.splice(index, 1);
      removeNode(child);
    }
  }

  replaceChild(index: number, node: HtmlNodeGroupChild) {
    const oldNode =
      index < this._children.length ? this._children[index] : null;

    if (oldNode === node) {
      return;
    }

    this._children[index] = node;

    if (!this._parent) {
      return;
    }

    if (oldNode) {
      removeNode(oldNode);
    }

    appendNode(this._parent, node);
  }

  clear() {
    for (const child of this._children) {
      removeNode(child);
    }

    this._children = [];
  }

  contains(node: HtmlNodeGroupChild) {
    return this._children.includes(node);
  }

  get length() {
    return this._children.length;
  }
}

export default HtmlNodeGroup;
