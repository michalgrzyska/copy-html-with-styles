import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import cssHref from "highlight.js/styles/vs2015.min.css?url";
import { DevtoolsEnv } from "../logic/devtools-env.js";
import { HtmlSerializer } from "../logic/html-serializer.js";
import { OptimizedNode } from "../logic/optimized-node.js";
import { OptionsForm } from "../logic/options-form.js";

export class Sidebar {
  private readonly serializer = new HtmlSerializer();
  private readonly optionsForm = new OptionsForm(this);

  constructor() {
    this.registerHighlightJs();
    this.addSelectionListener();
    this.updateElementHtml();
  }

  private registerHighlightJs(): void {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssHref;
    document.head.appendChild(link);

    hljs.registerLanguage("xml", xml);
  }

  async updateElementHtml(): Promise<void> {
    const serializedNode = await DevtoolsEnv.getCurrentNode();
    const optimizedNode = new OptimizedNode(serializedNode, this.optionsForm);
    const html = await this.serializer.serialize(optimizedNode);

    const innerHtml = `<pre><code class="language-xml">${this.escapeHtml(html)}</code></pre>`;
    document.getElementById("output")!.innerHTML = innerHtml;

    const codeEl = document.querySelector("#output code") as HTMLElement;
    hljs.highlightElement(codeEl);
  }

  private addSelectionListener(): void {
    chrome.devtools.panels.elements.onSelectionChanged.addListener(async () => {
      await this.updateElementHtml();
    });
  }

  private escapeHtml(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}

new Sidebar();
