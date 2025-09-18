import { DevtoolsEnv } from "../logic/devtools-env.js";
import { HtmlSerializer } from "../logic/html-serializer.js";

async function updateElementHTML(): Promise<void> {
  const node = await DevtoolsEnv.getCurrentNode();
  const serializer = new HtmlSerializer(node!);
  const html = serializer.toHtmlString();

  console.log(node, html);
}

chrome.devtools.panels.elements.onSelectionChanged.addListener(async () => {
  await updateElementHTML();
});

updateElementHTML();
