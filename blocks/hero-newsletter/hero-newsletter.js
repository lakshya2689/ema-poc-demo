/**
 * Hero Newsletter block.
 *
 * Authored as two rows:
 *   Row 1: the newsletter promo image (subscribe call-to-action baked into artwork)
 *   Row 2: a link to the newsletter subscribe page (its text duplicates the image)
 *
 * On the source site this is a single clickable promo image. We reproduce that by
 * wrapping the promo image in the subscribe link and dropping the redundant text row.
 *
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const rows = [...block.children];
  const picture = block.querySelector('picture');
  const link = block.querySelector('a');

  // Graceful fallback: if the expected pieces are missing, leave the block as-is.
  if (!picture || !link) return;

  const href = link.getAttribute('href');
  const label = link.textContent.trim();

  // Build a single clickable promo image pointing at the subscribe page.
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.className = 'hero-newsletter-link';
  anchor.setAttribute('aria-label', label || 'Newsletter subscribe');
  anchor.append(picture);

  block.textContent = '';
  rows.forEach((row) => row.remove());
  block.append(anchor);
}
