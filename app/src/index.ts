import browser from "webextension-polyfill";

browser.devtools.panels.elements
    .createSidebarPane("Copy HTML with CSS")
    .then((sidebar) => sidebar.setPage("./sidebar.html"));
