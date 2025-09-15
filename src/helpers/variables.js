export class Variables {
  /** @returns {Promise<Object|null>} */
  static get$0() {
    return new Promise((resolve) => {
      const serializeFn = function serializeNode(node) {
        if (!node) return null;

        if (node.nodeType === Node.ELEMENT_NODE) {
          // Create a baseline element of the same tag
          const baseline = document.createElement(node.tagName);
          document.body.appendChild(baseline);

          const computed = window.getComputedStyle(node);
          const defaultComputed = window.getComputedStyle(baseline);

          // Compare property by property
          const nonDefaultStyles = {};
          for (let i = 0; i < computed.length; i++) {
            const prop = computed[i];
            const value = computed.getPropertyValue(prop);
            const defaultValue = defaultComputed.getPropertyValue(prop);

            if (value !== defaultValue) {
              nonDefaultStyles[prop] = value;
            }
          }

          // Clean up
          document.body.removeChild(baseline);

          return {
            type: node.nodeType,
            tag: node.tagName.toLowerCase(),
            attributes: Array.from(node.attributes).map((attr) => ({
              name: attr.name,
              value: attr.value,
            })),
            inlineStyle: node.getAttribute("style") || "",
            styles: nonDefaultStyles, // only non-default styles
            children: Array.from(node.childNodes).map(serializeNode),
          };
        }

        if (node.nodeType === Node.TEXT_NODE) {
          return {
            type: node.nodeType,
            text: node.nodeValue,
          };
        }

        if (node.nodeType === Node.COMMENT_NODE) {
          return {
            type: node.nodeType,
            comment: node.nodeValue,
          };
        }

        return {
          type: node.nodeType,
          name: node.nodeName,
          value: node.nodeValue,
          children: Array.from(node.childNodes || []).map(serializeNode),
        };
      };

      chrome.devtools.inspectedWindow.eval(
        "(" + serializeFn.toString() + ")($0)",
        (result, ex) => {
          resolve(result);
        }
      );
    });
  }
}
