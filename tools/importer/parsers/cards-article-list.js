/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article-list.
 * Base block: cards
 * Source: https://www.racq.com.au/articles/road-trip/road-trip-through-central-australia
 * Selector: .article-listing-compact
 * Generated: 2026-08-27
 *
 * Container block. Child model "card" (blocks/cards-article-list/_cards-article-list.json):
 *   image     (reference)  -> field:image   (cell 1)
 *   imageAlt  (collapsed onto img alt attribute, no hint)
 *   text      (richtext)   -> field:text    (cell 2)
 *
 * Each <li> is an article card: a link wrapping an image and a title/content area.
 * Each card becomes one 2-cell row: [image, text]. Empty cells are kept.
 */
export default function parse(element, { document }) {
  // INPUT EXTRACTION — validated against source.html
  const items = Array.from(element.querySelectorAll('.search-result-list > li, ul > li'));

  // Empty-block guard
  if (!items.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  items.forEach((li) => {
    const link = li.querySelector('a[href], .article-list-item__link');
    const img = li.querySelector('img');
    const contentArea = li.querySelector('.article-list-item-compact__content-area, [class*="content-area"]');

    // Image cell (field:image). Keep the cell even when empty.
    const imageCell = document.createDocumentFragment();
    if (img) {
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(img);
    }

    // Text cell (field:text) — linked article title.
    const textCell = document.createDocumentFragment();
    // Use the visible content-area text as the card title; fall back to the
    // link's title attribute if no visible text is present.
    let titleText = '';
    if (contentArea) titleText = contentArea.textContent.trim();
    if (!titleText && link && link.getAttribute('title')) titleText = link.getAttribute('title').trim();

    const href = link ? link.getAttribute('href') : null;
    if (href) {
      textCell.appendChild(document.createComment(' field:text '));
      const a = document.createElement('a');
      a.setAttribute('href', href);
      a.textContent = titleText || href;
      textCell.appendChild(a);
    } else if (titleText) {
      textCell.appendChild(document.createComment(' field:text '));
      textCell.appendChild(document.createTextNode(titleText));
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article-list', cells });
  element.replaceWith(block);
}
