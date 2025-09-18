import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import cssHref from "highlight.js/styles/vs2015.min.css?url";
import { DevtoolsEnv } from "../logic/devtools-env.js";
import { HtmlSerializer } from "../logic/html-serializer.js";
import { OptimizedNode } from "../logic/optimized-node.js";

const link = document.createElement("link");
link.rel = "stylesheet";
link.href = cssHref;
document.head.appendChild(link);

hljs.registerLanguage("xml", xml);

const serializer = new HtmlSerializer();

async function updateElementHTML(): Promise<void> {
  const serializedNode = await DevtoolsEnv.getCurrentNode();
  const optimizedNode = new OptimizedNode(serializedNode);
  const html = await serializer.serialize(optimizedNode);

  document.getElementById("output")!.innerHTML = `<pre><code class="language-xml">${escapeHtml(
    html,
  )}</code></pre>`;

  const codeEl = document.querySelector("#output code") as HTMLElement;
  hljs.highlightElement(codeEl);
}

chrome.devtools.panels.elements.onSelectionChanged.addListener(async () => {
  await updateElementHTML();
});

updateElementHTML();

function escapeHtml(str: string): string {
  return str
    .replace('<?xml version="1.0"?>\n', "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
