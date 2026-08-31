/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-newsletter.
 * Base block: hero
 * Source: https://www.racq.com.au/articles/road-trip/road-trip-through-central-australia
 * Selector: .article-detail__ad-banners
 * Generated: 2026-08-27
 *
 * Model fields (blocks/hero-newsletter/_hero-newsletter.json):
 *   image     (reference)  -> field:image
 *   imageAlt  (collapsed onto img alt attribute, no hint)
 *   text      (richtext)   -> field:text
 *
 * Source is an image wrapped in a newsletter subscribe link:
 *   <a href="..."><img alt="..." src="..."></a>
 * The promo image goes in the image field; the subscribe link (CTA) goes in
 * the text field.
 */
export default function parse(element, { document }) {
  // INPUT EXTRACTION — validated against source.html
  const link = element.querySelector('a[href]');
  const img = element.querySelector('img');

  // Empty-block guard: nothing meaningful to render
  if (!img && !link) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row: image field
  if (img) {
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(img);
    cells.push([imageCell]);
  }

  // Row: text field (CTA link to the newsletter)
  if (link) {
    // Ensure the anchor has readable text (source uses an image as its label)
    if (!link.textContent.trim()) {
      const label = (img && img.getAttribute('alt')) || 'Subscribe';
      link.textContent = label;
    }
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    textCell.appendChild(link);
    cells.push([textCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-newsletter', cells });
  element.replaceWith(block);
}
