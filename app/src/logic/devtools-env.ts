import { SerializedNode } from "./serialized-node.js";
import browser from "webextension-polyfill";

export class DevtoolsEnv {
    static getCurrentNode(): Promise<SerializedNode> {
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

            browser.devtools.inspectedWindow.eval(expression).then(([result, exception]) => {
                if (exception) {
                    console.error("Eval exception:", exception);
                    resolve(undefined!);
                } else {
                    resolve(result as SerializedNode);
                }
            });
        });
    }
}
