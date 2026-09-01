/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-road-trip.js
  var import_road_trip_exports = {};
  __export(import_road_trip_exports, {
    default: () => import_road_trip_default
  });

  // tools/importer/parsers/hero-newsletter.js
  function parse(element, { document: document2 }) {
    const link = element.querySelector("a[href]");
    const img = element.querySelector("img");
    if (!img && !link) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (img) {
      const imageCell = document2.createDocumentFragment();
      imageCell.appendChild(document2.createComment(" field:image "));
      imageCell.appendChild(img);
      cells.push([imageCell]);
    }
    if (link) {
      if (!link.textContent.trim()) {
        const label = img && img.getAttribute("alt") || "Subscribe";
        link.textContent = label;
      }
      const textCell = document2.createDocumentFragment();
      textCell.appendChild(document2.createComment(" field:text "));
      textCell.appendChild(link);
      cells.push([textCell]);
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-newsletter", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article-list.js
  function parse2(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(".search-result-list > li, ul > li"));
    if (!items.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((li) => {
      const link = li.querySelector("a[href], .article-list-item__link");
      const img = li.querySelector("img");
      const contentArea = li.querySelector('.article-list-item-compact__content-area, [class*="content-area"]');
      const imageCell = document2.createDocumentFragment();
      if (img) {
        imageCell.appendChild(document2.createComment(" field:image "));
        imageCell.appendChild(img);
      }
      const textCell = document2.createDocumentFragment();
      let titleText = "";
      if (contentArea) titleText = contentArea.textContent.trim();
      if (!titleText && link && link.getAttribute("title")) titleText = link.getAttribute("title").trim();
      const href = link ? link.getAttribute("href") : null;
      if (href) {
        textCell.appendChild(document2.createComment(" field:text "));
        const a = document2.createElement("a");
        a.setAttribute("href", href);
        a.textContent = titleText || href;
        textCell.appendChild(a);
      } else if (titleText) {
        textCell.appendChild(document2.createComment(" field:text "));
        textCell.appendChild(document2.createTextNode(titleText));
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article-list", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-related.js
  function parse3(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(".search-result-list > li, ul > li"));
    if (!items.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((li) => {
      const link = li.querySelector("a[href], .article-list-item__link");
      const img = li.querySelector("img");
      const category = li.querySelector('.article-list-item__category, [class*="category"]');
      const title = li.querySelector('.article-list-item__title, [class*="title"]');
      const description = li.querySelector('.article-list-item__description, [class*="description"]');
      const href = link ? link.getAttribute("href") : null;
      const imageCell = document2.createDocumentFragment();
      if (img) {
        imageCell.appendChild(document2.createComment(" field:image "));
        imageCell.appendChild(img);
      }
      const textCell = document2.createDocumentFragment();
      const parts = [];
      if (category && category.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = category.textContent.trim();
        parts.push(p);
      }
      const titleText = title ? title.textContent.trim() : "";
      if (titleText) {
        const h = document2.createElement("h3");
        if (href) {
          const a = document2.createElement("a");
          a.setAttribute("href", href);
          a.textContent = titleText;
          h.appendChild(a);
        } else {
          h.textContent = titleText;
        }
        parts.push(h);
      }
      if (description && description.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = description.textContent.trim();
        parts.push(p);
      }
      if (parts.length) {
        textCell.appendChild(document2.createComment(" field:text "));
        parts.forEach((el) => textCell.appendChild(el));
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-related", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/racq-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "noscript"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav",
        // global search box (header, verified: div.component.search-box.global-search-box)
        ".global-search-box",
        // leftover non-content elements
        "link",
        "style",
        "script"
      ]);
    }
  }

  // tools/importer/transformers/racq-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-road-trip.js
  var parsers = {
    "hero-newsletter": parse,
    "cards-article-list": parse2,
    "cards-related": parse3
  };
  var PAGE_TEMPLATE = {
    name: "road-trip",
    description: "Road trip article page: long-form article body with lead image, inline captioned images, byline/CTA, tags, social sharing, a sidebar newsletter promo and 'More articles' list, a 'Related topics' card grid, and a pale-blue disclaimer section.",
    urls: [
      "https://www.racq.com.au/articles/road-trip/road-trip-through-central-australia"
    ],
    blocks: [
      {
        name: "hero-newsletter",
        instances: [".article-detail__ad-banners"]
      },
      {
        name: "cards-article-list",
        instances: [".article-listing-compact"]
      },
      {
        name: "cards-related",
        instances: [".article-listing:not(.article-listing-compact)"]
      }
    ],
    sections: [
      {
        id: "rc1",
        name: "Article body",
        selector: "#content > div.row > div.component.container",
        style: null,
        blocks: ["hero-newsletter", "cards-article-list", "cards-related"],
        defaultContent: []
      },
      {
        id: "rc2",
        name: "Things to note disclaimer",
        selector: "#content > div.row > div.component.container-fluid.col-12.fluid-container--pale-blue",
        style: "pale-blue",
        blocks: [],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_road_trip_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const remappedPath = rawPath.replace(/^\/articles\/[^/]+\//, "/articles/road-trip/");
      const path = WebImporter.FileUtils.sanitizePath(remappedPath === "" ? "/index" : remappedPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_road_trip_exports);
})();
