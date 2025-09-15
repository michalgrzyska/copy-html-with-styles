// @preserve
export class SerializedNode {
  type!: number;
  tag!: string;
  attributes!: { name: string; value: any }[];
  inlineStyle!: string;
  styles!: { [key: string]: string };
  children!: SerializedNode[];
  text!: string;
  comment!: string;
  value!: any;
  name!: string;

  constructor(node: Element | ChildNode) {
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

  private initAsElementNode(node: HTMLElement) {
    const styles = this.getUniqueStylesForTag(node);

    this.type = node.nodeType;
    this.tag = node.tagName.toLowerCase();
    this.inlineStyle = node.getAttribute("style") || "";
    this.styles = styles;
    this.children = Array.from(node.childNodes).map((x) => new SerializedNode(x));

    this.attributes = Array.from(node.attributes).map((attr) => ({
      name: attr.name,
      value: attr.value,
    }));
  }

  private initAsTextNode(node: Element | ChildNode) {
    this.type = node.nodeType;
    this.text = node.nodeValue!;
  }

  private initAsCommentNode(node: Element | ChildNode) {
    this.type = node.nodeType;
    this.comment = node.nodeValue!;
  }

  private initAsDefaultNode(node: Element | ChildNode) {
    this.type = node.nodeType;
    this.name = node.nodeName;
    this.value = node.nodeValue;
    this.children = Array.from(node.childNodes || []).map((x) => new SerializedNode(x));
  }

  private getUniqueStylesForTag(node: HTMLElement) {
    const iframe = this.getFakeIFrame();

    const defaultEl = document.createElement(node.tagName);
    iframe.contentDocument!.body.appendChild(defaultEl);
    const defaultStyles = iframe.contentWindow!.getComputedStyle(defaultEl);

    const divStyles = window.getComputedStyle(node);

    const diff: { [key: string]: string } = {};

    for (let prop of Array.from(divStyles)) {
      if (divStyles.getPropertyValue(prop) !== defaultStyles.getPropertyValue(prop)) {
        diff[prop] = divStyles.getPropertyValue(prop);
      }
    }

    for (let prop of Array.from(node.style)) {
      diff[prop] = node.style.getPropertyValue(prop);
    }

    defaultEl.remove();
    iframe.remove();

    return diff;
  }

  private getFakeIFrame() {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    return iframe;
  }
}
