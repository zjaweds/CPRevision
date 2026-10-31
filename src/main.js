import MarkdownIt from "markdown-it";
import readme from "../README.md?raw";
import "./style.css";

const imageAssets = import.meta.glob("../Images/*", {
  eager: true,
  query: "?url",
  import: "default",
});

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
});

const defaultImageRenderer = markdown.renderer.rules.image;
markdown.renderer.rules.image = (tokens, index, options, env, renderer) => {
  const token = tokens[index];
  const source = token.attrGet("src");
  const fileName = new URL(source, window.location.href).pathname.split("/").pop();
  const asset = Object.entries(imageAssets).find(([path]) => path.endsWith(`/${fileName}`));

  if (asset) {
    token.attrSet("src", asset[1]);
  }

  return defaultImageRenderer(tokens, index, options, env, renderer);
};

const documentElement = document.querySelector("#document");
const tocElement = document.querySelector("#table-of-contents");
const searchElement = document.querySelector("#toc-search");
const emptyElement = document.querySelector("#toc-empty");
const themeToggle = document.querySelector("#theme-toggle");

documentElement.innerHTML = markdown.render(readme);

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

function addHeadingIds() {
  const usedIds = new Map();

  documentElement.querySelectorAll("h1, h2, h3").forEach((heading) => {
    const baseId = slugify(heading.textContent) || "section";
    const occurrence = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, occurrence + 1);
    heading.id = occurrence === 0 ? baseId : `${baseId}-${occurrence}`;
  });
}

function buildTableOfContents() {
  const headings = [...documentElement.querySelectorAll("h1, h2, h3")];
  const list = document.createDocumentFragment();

  headings.forEach((heading) => {
    const item = document.createElement("a");
    item.className = `toc-link toc-level-${heading.tagName.slice(1)}`;
    item.href = `#${heading.id}`;
    item.textContent = heading.textContent;
    item.dataset.searchText = heading.textContent.toLowerCase();
    list.append(item);
  });

  tocElement.replaceChildren(list);
}

function filterTableOfContents() {
  const query = searchElement.value.trim().toLowerCase();
  let visibleCount = 0;

  tocElement.querySelectorAll(".toc-link").forEach((item) => {
    const isVisible = item.dataset.searchText.includes(query);
    item.hidden = !isVisible;
    visibleCount += Number(isVisible);
  });

  emptyElement.hidden = visibleCount > 0;
}

function updateTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute(
    "aria-label",
    `Switch to ${isDark ? "normal" : "dark"} mode`,
  );
  themeToggle.querySelector("span").textContent = isDark ? "Normal mode" : "Dark mode";
  themeToggle.querySelector("svg").innerHTML = isDark
    ? '<circle cx="10" cy="10" r="3.5"></circle><path d="M10 1.5v2M10 16.5v2M18.5 10h-2M3.5 10h-2m14.51-6.01-1.42 1.42M5.41 14.59l-1.42 1.42m12.02 0-1.42-1.42M5.41 5.41 3.99 3.99"></path>'
    : '<path d="M17.5 12.5A7.5 7.5 0 0 1 7.5 2.5a7.5 7.5 0 1 0 10 10Z"></path>';

  try {
    localStorage.setItem("cpreviewision-theme", theme);
  } catch {
    // Theme changes still work for this page view if storage is unavailable.
  }
}

addHeadingIds();
buildTableOfContents();
searchElement.addEventListener("input", filterTableOfContents);
updateTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  updateTheme(nextTheme);
});
