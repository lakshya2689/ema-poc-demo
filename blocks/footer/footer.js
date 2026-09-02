import { getMetadata, decorateIcons } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment. Prefer the page's `footer` metadata, then the
  // site root `/footer`, then fall back to the authored location under the
  // article tree so the footer renders regardless of where the doc lives.
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath)
    || await loadFragment('/articles/road-trip/footer');

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // ensure the RACQ logo renders. The logo lives in the repo /icons folder
  // (deployed with the code); the authored relative `images/...` src 404s on
  // delivery and can be dropped during fragment decoration, so point any
  // existing racq-logo img at the fixed path, and if the brand link lost its
  // image, inject it.
  const logoSrc = `${window.hlx?.codeBasePath || ''}/icons/racq-logo.svg`;
  const setLogo = (img) => {
    img.src = logoSrc;
    img.closest('picture')?.querySelectorAll('source').forEach((s) => s.remove());
  };
  const existingLogo = footer.querySelector('img[src*="racq-logo"]');
  if (existingLogo) {
    setLogo(existingLogo);
  } else {
    const brandLink = footer.querySelector('a[href="/"]');
    if (brandLink && !brandLink.querySelector('img')) {
      const img = document.createElement('img');
      img.alt = 'RACQ';
      setLogo(img);
      brandLink.append(img);
    }
  }

  // convert :icon-name: tokens in link text into icon spans that
  // decorateIcons() turns into <img>/<svg> (fragments skip this decoration)
  footer.querySelectorAll('a').forEach((a) => {
    const match = a.textContent.trim().match(/^:([a-z0-9-]+):$/i);
    if (match) {
      const span = document.createElement('span');
      span.className = `icon icon-${match[1]}`;
      a.setAttribute('aria-label', match[1]);
      a.textContent = '';
      a.append(span);
    }
  });

  // tag the social links row (a list whose links point to social networks)
  // so it can be styled as a horizontal icon row
  const SOCIAL = /facebook|twitter|x\.com|youtube|instagram|linkedin/i;
  footer.querySelectorAll('ul').forEach((ul) => {
    const links = [...ul.querySelectorAll('a')];
    if (links.length && links.every((a) => SOCIAL.test(a.href))) {
      ul.classList.add('footer-social');
    }
  });

  decorateIcons(footer);
  block.append(footer);
}
