// Service worker for Légifrance Express extension.
// Handles context menu and inter-script messaging.

const LEGIFRANCE_SEARCH_URL =
  "https://www.legifrance.gouv.fr/search/all?tab_selection=all&searchField=ALL&query=";

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "search-legifrance",
    title: "Rechercher \"%s\" sur Légifrance",
    contexts: ["selection"],
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "search-legifrance" && info.selectionText) {
    const query = info.selectionText.trim();
    if (query) {
      chrome.tabs.create({
        url: LEGIFRANCE_SEARCH_URL + encodeURIComponent(query),
      });
    }
  }
});
