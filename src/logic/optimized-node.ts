import { DefaultStylesCache } from "./default-styles-cache.js";
import { OptionsForm } from "./options-form.js";
import { SerializedNode } from "./serialized-node.js";
import { Utils } from "./utils.js";

export class OptimizedNode {
  type!: number;
  tag!: string;
  attributes!: Record<string, any>;
  styles!: Record<string, string>;
  children!: OptimizedNode[];
  text!: string;
  comment!: string;
  value!: any;
  name!: string;

  constructor(
    serializedNode: SerializedNode,
    private readonly optionsForm: OptionsForm,
    isParent = true,
  ) {
    if (isParent) {
      DefaultStylesCache.instance.startGathering();
    }

    this.type = serializedNode.type;
    this.tag = serializedNode.tag;

    this.attributes = serializedNode.attributes;
    delete this.attributes["style"];

    this.styles = this.getOptimizedStyles(serializedNode);

    this.children = serializedNode.children?.map(
      (x) => new OptimizedNode(x, this.optionsForm, false),
    );

    this.text = serializedNode.text;
    this.comment = serializedNode.comment;
    this.value = serializedNode.value;
    this.name = serializedNode.name;

    if (isParent) {
      DefaultStylesCache.instance.stopGathering();
    }
  }

  getOptimizedStyles(node: SerializedNode): Record<string, string> {
    const style = node.styles ?? {};
    const inlineStyle = node.inlineStyle;

    const parsedStyle = Object.keys(style).length > 0 ? this.parseStyle(node) : {};
    const parsedInlineStyle = !!inlineStyle ? this.parseInlineStyle(inlineStyle) : {};

    const result: Record<string, string> = { ...parsedStyle, ...parsedInlineStyle };
    return this.optionsForm.includeColor ? result : this.filterColorProps(result);
  }

  private parseStyle(node: SerializedNode): Record<string, string> {
    const defaultStyle = DefaultStylesCache.instance.getFor(node.tag);
    const diff = Utils.getObjectsDiff(defaultStyle, node.styles);

    return diff;
  }

  private parseInlineStyle(style: string): Record<string, string> {
    return style
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
      .reduce<Record<string, string>>((acc, declaration) => {
        const [property, value] = declaration.split(":").map((s) => s.trim());
        if (property && value) acc[property] = value;
        return acc;
      }, {});
  }

  private filterColorProps(result: Record<string, string>): Record<string, string> {
    Object.keys(result).forEach((key) => {
      const value = result[key];

      if (value.startsWith("rgb")) {
        delete result[key];
      }
    });

    return result;
  }
}
