/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-related.
 * Base block: cards
 * Source: https://www.racq.com.au/articles/road-trip/road-trip-through-central-australia
 * Selector: .article-listing:not(.article-listing-compact)
 * Generated: 2026-08-27
 *
 * Container block. Child model "card" (blocks/cards-related/_cards-related.json):
 *   image     (reference)  -> field:image   (cell 1)
 *   imageAlt  (collapsed onto img alt attribute, no hint)
 *   text      (richtext)   -> field:text    (cell 2, grouped rich content)
 *
 * Each <li> is a related-article card containing an image, a category label,
 * a title and a description, all wrapped in a link. Each card becomes one
 * 2-cell row: [image, text]. The text cell holds category + linked title
 * heading + description as rich text. Empty cells are kept.
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
    const category = li.querySelector('.article-list-item__category, [class*="category"]');
    const title = li.querySelector('.article-list-item__title, [class*="title"]');
    const description = li.querySelector('.article-list-item__description, [class*="description"]');
    const href = link ? link.getAttribute('href') : null;

    // Image cell (field:image). Keep the cell even when empty.
    const imageCell = document.createDocumentFragment();
    if (img) {
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(img);
    }

    // Text cell (field:text) — category + linked title heading + description.
    const textCell = document.createDocumentFragment();
    const parts = [];

    if (category && category.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = category.textContent.trim();
      parts.push(p);
    }

    const titleText = title ? title.textContent.trim() : '';
    if (titleText) {
      const h = document.createElement('h3');
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = titleText;
        h.appendChild(a);
      } else {
        h.textContent = titleText;
      }
      parts.push(h);
    }

    if (description && description.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      parts.push(p);
    }

    if (parts.length) {
      textCell.appendChild(document.createComment(' field:text '));
      parts.forEach((el) => textCell.appendChild(el));
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-related', cells });
  element.replaceWith(block);
}
