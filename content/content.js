(() => {
  const LEGIFRANCE_SEARCH_URL =
    "https://www.legifrance.gouv.fr/search/all?tab_selection=all&searchField=ALL&query=";

  let tooltip = null;

  function getSelectedText() {
    return window.getSelection().toString().trim();
  }

  function createTooltip(text, x, y) {
    removeTooltip();

    tooltip = document.createElement("div");
    tooltip.className = "legifrance-tooltip";
    tooltip.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="flex-shrink:0">
        <circle cx="7" cy="7" r="6" fill="#000091"/>
        <text x="7" y="10.5" text-anchor="middle" font-size="8" fill="#fff" font-family="sans-serif" font-weight="bold">L</text>
      </svg>
      <span>Entrée &rarr; Légifrance</span>
    `;

    document.body.appendChild(tooltip);

    // Position tooltip above selection
    const rect = tooltip.getBoundingClientRect();
    let left = x - rect.width / 2;
    let top = y - rect.height - 10;

    // Keep within viewport
    if (left < 8) left = 8;
    if (left + rect.width > window.innerWidth - 8) {
      left = window.innerWidth - rect.width - 8;
    }
    if (top < 8) {
      top = y + 20;
    }

    tooltip.style.left = left + "px";
    tooltip.style.top = top + "px";
    tooltip.style.opacity = "1";
    tooltip.style.transform = "translateY(0)";
  }

  function removeTooltip() {
    if (tooltip) {
      tooltip.remove();
      tooltip = null;
    }
  }

  // Show tooltip on text selection
  document.addEventListener("mouseup", (e) => {
    // Small delay to let the selection finalize
    setTimeout(() => {
      const text = getSelectedText();
      if (text.length > 0 && text.length < 200) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          const x = rect.left + rect.width / 2 + window.scrollX;
          const y = rect.top + window.scrollY;
          createTooltip(text, x, y);
        }
      } else {
        removeTooltip();
      }
    }, 10);
  });

  // Hide tooltip on click elsewhere
  document.addEventListener("mousedown", (e) => {
    if (tooltip && !tooltip.contains(e.target)) {
      removeTooltip();
    }
  });

  // Enter key triggers Légifrance search
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !isInputElement(e.target)) {
      const text = getSelectedText();
      if (text.length > 0 && text.length < 200) {
        e.preventDefault();
        removeTooltip();
        window.open(
          LEGIFRANCE_SEARCH_URL + encodeURIComponent(text),
          "_blank"
        );
      }
    }
  });

  function isInputElement(el) {
    const tag = el.tagName.toLowerCase();
    return (
      tag === "input" ||
      tag === "textarea" ||
      tag === "select" ||
      el.isContentEditable
    );
  }
})();
