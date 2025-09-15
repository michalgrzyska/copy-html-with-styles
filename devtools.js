/* global $0 */ // Tell VS Code/TS that $0 is defined in runtime

chrome.devtools.panels.elements.createSidebarPane(
  "Element HTML",
  function (sidebar) {
    /** @param {Element|null} element */
    function extractOuterHTML(element) {
      if (!element) {
        return { html: "No element selected." };
      }

      return { html: element.outerHTML };
    }

    function updateElementHTML() {
      const expression = `(${extractOuterHTML.toString()})($0)`;
      sidebar.setExpression(expression);
    }

    // Update whenever a new element is selected
    chrome.devtools.panels.elements.onSelectionChanged.addListener(
      updateElementHTML
    );

    // Initial update
    updateElementHTML();
  }
);
