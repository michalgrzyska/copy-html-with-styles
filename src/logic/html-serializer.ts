import { escape as escapeHtml } from "html-escaper";
import parserHtml from "prettier/plugins/html";
import parserCss from "prettier/plugins/postcss";
import prettier from "prettier/standalone";
import { DefaultStylesCache } from "./default-styles-cache.js";
import { OptimizedNode } from "./optimized-node.js";

export class HtmlSerializer {
  private readonly voidTags = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
  ]);

  async serialize(node: OptimizedNode): Promise<string> {
    DefaultStylesCache.instance.startGathering();

    const raw = this.serializeNode(node);

    DefaultStylesCache.instance.stopGathering();

    return await this.format(raw);
  }

  private serializeNode(node: OptimizedNode): string {
    if (!node) {
      return "";
    }

    if (node.text) {
      return escapeHtml(node.text);
    }

    if (node.comment) {
      return `<!-- ${escapeHtml(node.comment)} -->`;
    }

    if (!node.tag) {
      return "";
    }

    return this.serializeDefaultNode(node);
  }

  private serializeDefaultNode(node: OptimizedNode): string {
    const attrs: string[] = [];

    this.appendAttributes(node, attrs);
    this.appendStyleAttribute(node, attrs);

    const attrStr = attrs.length > 0 ? " " + attrs.join(" ") : "";
    const children = node.children?.map((child) => this.serializeNode(child)).join("") ?? "";

    return this.voidTags.has(node.tag.toLowerCase())
      ? `<${node.tag}${attrStr}>`
      : `<${node.tag}${attrStr}>${children}</${node.tag}>`;
  }

  private appendAttributes(node: OptimizedNode, attrs: string[]): void {
    if (node.attributes) {
      for (const [key, value] of Object.entries(node.attributes)) {
        attrs.push(`${key}="${escapeHtml(String(value))}"`);
      }
    }
  }

  private appendStyleAttribute(node: OptimizedNode, attrs: string[]): void {
    const fullStyleString = Object.entries(node.styles)
      .map(([key, value]) => `${key}: ${value}`)
      .join("; ");

    if (fullStyleString.length > 0) {
      attrs.push(`style='${fullStyleString}'`);
    }
  }

  private async format(html: string): Promise<string> {
    const formatted = await prettier.format(html, {
      parser: "html",
      plugins: [parserHtml, parserCss],
      tabWidth: 4,
      printWidth: 120,
    });

    return formatted.replace(/&quot;/g, "'");
  }
}
