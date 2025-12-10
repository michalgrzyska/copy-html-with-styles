import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
// import cssHref from "highlight.js/styles/vs2015.min.css?url";
import { DevtoolsEnv } from "../logic/devtools-env.js";
import { HtmlSerializer } from "../logic/html-serializer.js";
import { OptimizedNode } from "../logic/optimized-node.js";
import { OptionsForm } from "../logic/options-form.js";
import cssHref from "./theme.css?url";
import browser from "webextension-polyfill";

export class Sidebar {
    private readonly serializer = new HtmlSerializer();
    private readonly optionsForm = new OptionsForm(this);

    private html: string = "";

    constructor() {
        this.registerHighlightJs();
        this.addSelectionListener();
        this.updateElementHtml();
        this.listenToCopyToClipboardButton();
    }

    async updateElementHtml(): Promise<void> {
        const serializedNode = await DevtoolsEnv.getCurrentNode();
        const optimizedNode = new OptimizedNode(serializedNode, this.optionsForm);

        this.html = await this.serializer.serialize(optimizedNode);

        const innerHtml = `<pre><code class="language-xml">${this.escapeHtml(this.html)}</code></pre>`;
        document.getElementById("output")!.innerHTML = innerHtml;

        const codeEl = document.querySelector("#output code") as HTMLElement;
        hljs.highlightElement(codeEl);
    }

    private registerHighlightJs(): void {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = cssHref;
        document.head.appendChild(link);

        hljs.registerLanguage("xml", xml);
    }

    private listenToCopyToClipboardButton(): void {
        const button = document.getElementById("copyToClipboard")! as HTMLButtonElement;

        button.addEventListener("click", () => {
            this.executeCopy();
            button.textContent = "Copied!";

            setTimeout(() => {
                button.textContent = "Copy to clipboard";
            }, 2000);
        });
    }

    private addSelectionListener(): void {
        browser.devtools.panels.elements.onSelectionChanged.addListener(async () => {
            await this.updateElementHtml();
        });
    }

    private escapeHtml(str: string): string {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    private executeCopy(): void {
        const textarea = document.createElement("textarea");
        textarea.value = this.html;

        document.body.appendChild(textarea);

        textarea.select();

        document.execCommand("copy");
        document.body.removeChild(textarea);
    }
}

new Sidebar();
