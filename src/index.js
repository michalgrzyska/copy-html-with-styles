chrome.devtools.panels.elements.createSidebarPane(
  "Copy HTML with CSS",
  function (sidebar) {
    sidebar.setPage("src/sidebar/sidebar.html");
    return;
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

    chrome.devtools.panels.elements.onSelectionChanged.addListener(
      updateElementHTML
    );

    updateElementHTML();
  }
);
