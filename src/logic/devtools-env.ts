import { SerializedNode } from "./serialized-node.js";

export class DevtoolsEnv {
  static getCurrentNode(): Promise<SerializedNode | undefined> {
    return new Promise((resolve) => {
      const fn = function serializeFn(x: any) {
        return new SerializedNode(x);
      };

      const expression = `
        (() => {
          const SerializedNode = ${SerializedNode.toString()};
          return (${fn.toString()})($0);
        })()
      `;

      chrome.devtools.inspectedWindow.eval(expression, (result: SerializedNode, exception) => {
        if (exception) {
          console.error("Eval exception:", exception);
          resolve(undefined);
        } else {
          resolve(result);
        }
      });
    });
  }
}
