/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroNewsletterParser from './parsers/hero-newsletter.js';
import cardsArticleListParser from './parsers/cards-article-list.js';
import cardsRelatedParser from './parsers/cards-related.js';

// TRANSFORMER IMPORTS
import racqCleanupTransformer from './transformers/racq-cleanup.js';
import racqSectionsTransformer from './transformers/racq-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-newsletter': heroNewsletterParser,
  'cards-article-list': cardsArticleListParser,
  'cards-related': cardsRelatedParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'road-trip',
  description: "Road trip article page: long-form article body with lead image, inline captioned images, byline/CTA, tags, social sharing, a sidebar newsletter promo and 'More articles' list, a 'Related topics' card grid, and a pale-blue disclaimer section.",
  urls: [
    'https://www.racq.com.au/articles/road-trip/road-trip-through-central-australia',
  ],
  blocks: [
    {
      name: 'hero-newsletter',
      instances: ['.article-detail__ad-banners'],
    },
    {
      name: 'cards-article-list',
      instances: ['.article-listing-compact'],
    },
    {
      name: 'cards-related',
      instances: ['.article-listing:not(.article-listing-compact)'],
    },
  ],
  sections: [
    {
      id: 'rc1',
      name: 'Article body',
      selector: '#content > div.row > div.component.container',
      style: null,
      blocks: ['hero-newsletter', 'cards-article-list', 'cards-related'],
      defaultContent: [],
    },
    {
      id: 'rc2',
      name: 'Things to note disclaimer',
      selector: '#content > div.row > div.component.container-fluid.col-12.fluid-container--pale-blue',
      style: 'pale-blue',
      blocks: [],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY - runs after cleanup; sections transformer only when 2+ sections
const transformers = [
  racqCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [racqSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path. Group all article pages under
    //    /articles/road-trip/ regardless of their source section, so this
    //    template's imports land in the road-trip folder.
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const remappedPath = rawPath.replace(/^\/articles\/[^/]+\//, '/articles/road-trip/');
    const path = WebImporter.FileUtils.sanitizePath(remappedPath === '' ? '/index' : remappedPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
