/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: RACQ section breaks and Section Metadata.
 *
 * Uses payload.template.sections (from page-templates.json). Selectors are the
 * DOM-verified section boundaries produced by page analysis:
 *   rc1 "Article body"            -> #content > div.row > div.component.container            (style: none)
 *   rc2 "Things to note disclaimer" -> ... fluid-container--pale-blue                        (style: pale-blue)
 *
 * Breaks are inserted in beforeTransform (while every section element still
 * exists, before parsers replace them). Section Metadata is inserted in
 * afterTransform, anchored to a marker <hr> placed above the styled section.
 * Sections are processed in reverse so inserts never disturb not-yet-processed
 * section positions or parsers' :nth-of-type selectors.
 */

const SECTION_MARKER_ATTR = 'data-excat-section-id';

export default function transform(hookName, element, payload) {
  const sections = (payload.template && payload.template.sections) || [];

  if (hookName === 'beforeTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (i === 0 && !section.style) continue; // first section: no leading break, no metadata
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue; // selector didn't match on this page — skip, never guess

      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const anchor = marker || element.querySelector(section.selector);
      if (!anchor) continue; // neither survived — skip, never guess

      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove(); // section 0 never gets a real leading break
      }
    }
  }
}
