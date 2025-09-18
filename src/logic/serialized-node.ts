export class SerializedNode {
  type!: number;
  tag!: string;
  attributes!: Record<string, any>;
  inlineStyle!: string;
  styles!: Record<string, string>;
  children!: SerializedNode[];
  text!: string;
  comment!: string;
  value!: any;
  name!: string;

  isChild: boolean;

  constructor(node: Element | ChildNode, isChild = false) {
    this.isChild = isChild;

    if (!node) {
      return;
    }

    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        this.initAsElementNode(node as HTMLElement);
        break;

      case Node.TEXT_NODE:
        this.initAsTextNode(node);
        break;

      case Node.COMMENT_NODE:
        this.initAsCommentNode(node);
        break;

      default:
        this.initAsDefaultNode(node);
        break;
    }
  }

  private initAsElementNode(node: HTMLElement): void {
    this.type = node.nodeType;
    this.tag = node.tagName.toLowerCase();
    this.inlineStyle = node.getAttribute("style") || "";
    this.children = Array.from(node.childNodes).map((x) => new SerializedNode(x, true));

    this.attributes = Array.from(node.attributes).reduce(
      (acc, curr) => {
        acc[curr.name] = curr.value;
        return acc;
      },
      {} as Record<string, any>,
    );

    const style = window.getComputedStyle(node);

    this.styles = Object.fromEntries(
      Array.from(style).map((prop) => [prop, style.getPropertyValue(prop)]),
    );
  }

  private initAsTextNode(node: Element | ChildNode): void {
    this.type = node.nodeType;
    this.text = node.nodeValue!;
  }

  private initAsCommentNode(node: Element | ChildNode): void {
    this.type = node.nodeType;
    this.comment = node.nodeValue!;
  }

  private initAsDefaultNode(node: Element | ChildNode): void {
    this.type = node.nodeType;
    this.name = node.nodeName;
    this.value = node.nodeValue;
    this.children = Array.from(node.childNodes || []).map((x) => new SerializedNode(x));
  }
}
