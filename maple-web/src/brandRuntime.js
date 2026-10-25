const BRAND_NAME = "EverleafMs";
const BRAND_LOGO = "/everleafms-primary-v2.png";
const BRAND_EMBLEM = "/everleafms-emblem-v2.png";

const visualBrandImageSelectors = [
  "img.brand__logo",
  "img.home-portal-hero__brand",
  ".home-rail-card--brand img",
  ".home-feed-news-card__head img",
].join(",");

const protectedOperationalText = /(EVERLEAFMS\s+LAUNCHER|EverleafmsV1\.0\.2|everleafms-visual-patch-notice)/i;

function rebrandText(value) {
  if (!value || protectedOperationalText.test(value)) return value;

  return value
    .replace(
      "LatinMS is built for Latin players and adventurers from anywhere in the world who want an active community, a special atmosphere, and an experience that feels unique from the first login.",
      "EverleafMS is made for adventurers from around the world who are looking for a classic MapleStory experience, an active international community, a unique atmosphere, and a world that feels special from the very first login.",
    )
    .replace(/LATINMS\s+LAUNCHER/gi, "EVERLEAFMS LAUNCHER")
    .replace(/LatinmsV1\.0\.2/gi, "EverleafmsV1.0.2")
    .replace(/latinms-visual-patch-notice/gi, "everleafms-visual-patch-notice")
    .replace(/\bLatinMS\b/g, BRAND_NAME)
    .replace(/\bLatinms\b/g, BRAND_NAME)
    .replace(/\blatinms\b/gi, BRAND_NAME)
    .replace(/\bcomunidad latina\b/gi, "comunidad global")
    .replace(/\bjugadores latinos\b/gi, "jugadores de todo el mundo")
    .replace(/\bLatin community\b/gi, "global classic community")
    .replace(/\bLatin players\b/gi, "players from around the world")
    .replace(/2x Mesos\s*[·•]\s*2x Drops\s*[·•]\s*5x Quests/gi, "1x EXP · 1x Mesos · 1x Drops · Party 5x")
    .replace(/2x Mesos\s*\\u00B7\s*2x Drops\s*\\u00B7\s*5x Quests/gi, "1x EXP · 1x Mesos · 1x Drops · Party 5x");
}

function updateTextNodes(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];

  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    const parent = node.parentElement;
    if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) return;

    const nextValue = rebrandText(node.nodeValue);
    if (nextValue !== node.nodeValue) node.nodeValue = nextValue;
  });
}

function updateAttributes(root) {
  const elements = root.querySelectorAll?.("[alt], [title], [aria-label]") || [];
  elements.forEach((element) => {
    ["alt", "title", "aria-label"].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      const current = element.getAttribute(attribute);
      const nextValue = rebrandText(current);
      if (nextValue !== current) element.setAttribute(attribute, nextValue);
    });
  });
}

function updateBrandImages(root) {
  root.querySelectorAll?.(visualBrandImageSelectors).forEach((image) => {
    const isEmblem = image.matches(".home-rail-card--brand img");
    const expectedSource = isEmblem ? BRAND_EMBLEM : BRAND_LOGO;
    if (image.getAttribute("src") !== expectedSource) image.setAttribute("src", expectedSource);
    image.setAttribute("alt", isEmblem ? "Emblema EverleafMs V83" : "EverleafMs V83 Classic");
  });
}

function updateDocumentMetadata() {
  document.documentElement.dataset.brand = "everleafms";
}

function applyBrand(root = document) {
  updateTextNodes(root);
  updateAttributes(root);
  updateBrandImages(root);
  updateDocumentMetadata();
}

export function startEverleafBranding() {
  const run = () => applyBrand(document);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const nextValue = rebrandText(node.nodeValue);
          if (nextValue !== node.nodeValue) node.nodeValue = nextValue;
          return;
        }

        if (node.nodeType === Node.ELEMENT_NODE) applyBrand(node);
      });
    });
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
}
