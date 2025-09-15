import { BaselineElementStyles } from "helpers/baseline-element-styles";

export class SerializedNode {
  /** @type {number} */
  type;

  /** @type {string} */
  tag;

  /** @type {{name: string, value: any}[]} */
  attributes;

  /** @type {string} */
  inlineStyle;

  /** @type {{[key: string]: any}} */
  styles;

  /** @type {SerializedNode[]} */
  children;

  /** @type {string} */
  text;

  /** @type {string} */
  comment;

  /** @type {any} */
  value;

  /** @param {{[key: string]: any}} node */
  constructor(node) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        this.#initAsElementNode(node);
        break;

      case Node.TEXT_NODE:
        this.#initAsTextNode(node);
        break;

      case Node.COMMENT_NODE:
        this.#initAsCommentNode(node);
        break;

      default:
        this.#initAsDefaultNode(node);
        break;
    }
  }

  /** @param {{[key: string]: any}} node */
  #initAsElementNode(node) {
    const styles = BaselineElementStyles.getUniqueStylesForTag(node.tagName);

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

  /** @param {{[key: string]: any}} node */
  #initAsTextNode(node) {
    this.type = node.nodeType;
    this.text = node.nodeValue;
  }

  /** @param {{[key: string]: any}} node */
  #initAsCommentNode(node) {
    this.type = node.nodeType;
    this.comment = node.nodeValue;
  }

  /** @param {{[key: string]: any}} node */
  #initAsDefaultNode(node) {
    this.type = node.nodeType;
    this.name = node.nodeName;
    this.value = node.nodeValue;
    this.children = Array.from(node.childNodes || []).map((x) => new SerializedNode(x));
  }
}
