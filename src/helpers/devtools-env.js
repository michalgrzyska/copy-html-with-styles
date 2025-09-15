import { SerializedNode } from "models/serialized-node";

export class DevtoolsEnv {
  /** @returns {Promise<SerializedNode[]>} */
  static getCurrentNode() {
    return new Promise((resolve) => {
      const serializeFn = (x) => new SerializedNode(x);
      const expression = `(${serializeFn.toString()})($0)`;
      const returnExpression = (/** @type {SerializedNode[]} */ result) => resolve(result);

      chrome.devtools.inspectedWindow.eval(expression, returnExpression);
    });
  }
}
