import { DevtoolsEnv } from "../helpers/variables.js";

/** @param {Element|null} element */
function extractOuterHTML(element) {
  if (!element) {
    return { html: "No element selected." };
  }
  return { html: element.outerHTML };
}

async function updateElementHTML() {
  const $0 = await DevtoolsEnv.getCurrentNode();
  console.log($0);
  document.getElementById("output").textContent = $0.outerHTML;
}

chrome.devtools.panels.elements.onSelectionChanged.addListener(async () => updateElementHTML);

updateElementHTML();
