const LEGIFRANCE_SEARCH_URL = "https://www.legifrance.gouv.fr/search/all?tab_selection=all&searchField=ALL&query=";
const HISTORY_KEY = "legifrance_history";
const MAX_HISTORY = 8;

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const historySection = document.getElementById("history");
  const historyList = document.getElementById("historyList");

  loadHistory();

  searchBtn.addEventListener("click", () => {
    performSearch(searchInput.value);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      performSearch(searchInput.value);
    }
  });

  function performSearch(query) {
    const trimmed = query.trim();
    if (!trimmed) return;

    saveToHistory(trimmed);
    const url = LEGIFRANCE_SEARCH_URL + encodeURIComponent(trimmed);
    chrome.tabs.create({ url });
  }

  function saveToHistory(term) {
    const history = getHistory().filter((t) => t !== term);
    history.unshift(term);
    if (history.length > MAX_HISTORY) history.pop();
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    loadHistory();
  }

  function getHistory() {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch {
      return [];
    }
  }

  function loadHistory() {
    const history = getHistory();
    if (history.length === 0) {
      historySection.classList.add("hidden");
      return;
    }

    historySection.classList.remove("hidden");
    historyList.innerHTML = "";

    history.forEach((term) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="term">${escapeHtml(term)}</span><span class="arrow">&rarr;</span>`;
      li.addEventListener("click", () => {
        performSearch(term);
      });
      historyList.appendChild(li);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
});
