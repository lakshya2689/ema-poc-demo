/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: RACQ site-wide cleanup.
 * Removes non-authorable site chrome and tracking so the import contains only
 * page-level authorable content.
 *
 * All selectors verified against migration-work/cleaned.html:
 *  - <header> (lines 5-581): global masthead, search box, primary navigation
 *  - <footer> (lines 907+): global footer
 *  - tracking <iframe> pixels after footer (lines 1094+): TTD/everest/adform pixels
 *  - <main> (line 584) wraps the authorable #content region — preserved.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Tracking pixels / analytics iframes present in captured DOM (racq.com.au).
    // Removed before parsing so they never end up in block cells.
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'noscript',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome (verified in cleaned.html).
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
      // global search box (header, verified: div.component.search-box.global-search-box)
      '.global-search-box',
      // leftover non-content elements
      'link',
      'style',
      'script',
    ]);
  }
}
