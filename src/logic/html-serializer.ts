import { create } from "xmlbuilder2";
import { XMLBuilder } from "xmlbuilder2/lib/interfaces.js";
import { SerializedNode } from "./serialized-node.js";

export class HtmlSerializer {
  constructor(private readonly root: SerializedNode) {}

  toHtmlString(pretty = true): string {
    const doc = create();
    this.appendNode(doc, this.root);

    return doc.end({ prettyPrint: pretty });
  }

  private appendNode(parent: XMLBuilder, node: SerializedNode): void {
    switch (node.type) {
      case Node.ELEMENT_NODE:
        const attributes: { [key: string]: string } = {};

        for (const attr of node.attributes || []) {
          attributes[attr.name] = attr.value;
        }

        if (node.styles && Object.keys(node.styles).length > 0) {
          attributes.style = Object.entries(node.styles)
            .map(([k, v]) => `${k}: ${v};`)
            .join(" ");
        }

        const el = parent.ele(node.tag, attributes);

        for (const child of node.children || []) {
          this.appendNode(el, child);
        }

        el;

        break;

      case Node.TEXT_NODE:
        parent.txt(node.text || "");
        break;

      case Node.COMMENT_NODE:
        parent.com(node.comment || "");
        break;

      default:
        parent.txt(node.value || "");
        break;
    }
  }
}
