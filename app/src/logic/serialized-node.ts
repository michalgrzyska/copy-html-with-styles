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
        if (!node) return;

        this.type = node.nodeType;

        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                this.initAsElementNode(node as HTMLElement);
                break;

            case Node.TEXT_NODE:
                this.text = node.nodeValue || "";
                break;

            case Node.COMMENT_NODE:
                this.comment = node.nodeValue || "";
                break;

            default:
                this.name = node.nodeName;
                this.value = node.nodeValue;
                this.children = this.collectChildren(node);
                break;
        }
    }

    private initAsElementNode(node: HTMLElement): void {
        this.tag = node.tagName.toLowerCase();
        this.inlineStyle = node.getAttribute("style") || "";

        this.attributes = this.collectAttributes(node);
        this.styles = this.collectStyles(node);
        this.children = this.collectChildren(node);
    }

    private collectAttributes(node: HTMLElement): Record<string, any> {
        const attrs: Record<string, any> = {};
        const attrList = node.attributes;

        for (let i = 0; i < attrList.length; i++) {
            const a = attrList[i];
            attrs[a.name] = a.value;
        }

        return attrs;
    }

    private collectStyles(node: HTMLElement): Record<string, string> {
        const style = window.getComputedStyle(node);
        const styleObj: Record<string, string> = {};

        for (let i = 0; i < style.length; i++) {
            const prop = style[i];
            styleObj[prop] = style.getPropertyValue(prop);
        }

        return styleObj;
    }

    private collectChildren(node: Element | ChildNode): SerializedNode[] {
        const result: SerializedNode[] = [];
        const kids = node.childNodes;

        for (let i = 0; i < kids.length; i++) {
            result.push(new SerializedNode(kids[i], true));
        }

        return result;
    }
}
