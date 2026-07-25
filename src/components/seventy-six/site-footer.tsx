import { useId } from 'react';
import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import './site-footer.css';

/**
 * B51 · SiteFooter — the last thing on a public page, and the only place a
 * page is allowed to be a list of links. One job: close a public page with
 * everything it owes the reader.
 *
 * Everything above the footer states one thing at a time; this states the
 * rest of the site at once. That is the whole licence, and it is narrow:
 * four groups, six links each. A fifth group is not a wider footer, it is a
 * sitemap page — the moment the reader has to SCAN the closing row, it has
 * stopped closing anything.
 *
 * There is no newsletter slot, and there never will be: a form is a page or
 * a B24 Plate, and a footer that asks for an address while it is answering
 * questions has changed the subject. No social tiles either — A2 refuses
 * icon-only affordances, so a social account is a named link like any other.
 * No language picker: C4 forbids leaving a single path to anything down
 * here, and if the site has locales they belong where the reader lands.
 */

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterGroup {
  /** Mono uppercase group title: PRODUCT · RESOURCES · COMPANY · LEGAL. */
  title: string;
  /** At most six. A seventh link is a page about the seventh link. */
  links: FooterLink[];
}

/** Adapter for router links — keeps the footer router-agnostic, exactly as
    BandNav's does. Same shape, same fallback, so a caller wires one function
    for the band and the footer alike. */
type RenderLink = (link: FooterLink, className: string) => ReactNode;

export interface SiteFooterProps {
  /** At most FOUR. A fifth group is a sitemap page, not a wider footer. */
  groups: FooterGroup[];
  /** One soft sentence beside the wordmark: what the product is, in a line. */
  statement?: string;
  /** The mono legal line: "© 2026 …  ·  MIT". Required — a footer without it
      is not one: the reader is owed who owns this and under what terms. */
  legal: string;
  /** The bottom-right links: privacy, terms, status. */
  secondary?: FooterLink[];
  /** Router adapter, exactly as BandNav takes one. Falls back to a plain <a>. */
  renderLink?: (link: FooterLink, className: string) => ReactNode;
  className?: string;
}

function fallbackLink(link: FooterLink, className: string) {
  return (
    <a href={link.href} className={className}>
      {link.label}
    </a>
  );
}

function toLink(link: FooterLink, className: string, renderLink?: RenderLink) {
  return renderLink ? renderLink(link, className) : fallbackLink(link, className);
}

/* role="img" + one aria-label: the mark is one word to a screen reader,
   not "seven six degree" read out as three orphaned characters. Same recipe
   as B24 Plate, because this is the same problem — the wordmark on the wall
   rather than on the band. The degree mark is NEVER omitted; it recedes to
   faint ink, which is a different thing from being dropped.

   This is the page's CLOSING mark, and the band (B1) carries the opening
   one. Two marks, one at each end of the page — nothing between them may
   carry a third. */
const WORDMARK = (
  <span className="sv-site-footer__wordmark" role="img" aria-label="Seventy Six Degrees">
    <span aria-hidden="true">7</span>
    <span className="sv-site-footer__wordmark-six" aria-hidden="true">6</span>
    <span className="sv-site-footer__wordmark-deg" aria-hidden="true">°</span>
  </span>
);

export function SiteFooter({
  groups,
  statement,
  legal,
  secondary,
  renderLink,
  className,
}: SiteFooterProps) {
  /* ONE base id, suffixed per group index. A random id per render breaks
     hydration and re-points every aria-labelledby on every paint; useId is
     stable across server and client, which is what an IDREF has to be. */
  const baseId = useId();

  return (
    /* A real <footer>, and no role: at the top of the document it already
       IS the contentinfo landmark, and restating the implicit role is how a
       second, conflicting one gets shipped later. */
    <footer className={cx('sv-site-footer', className)}>
      <div className="sv-site-footer__inner">
        {/* ONE nav for the whole link region, labelled once. A footer that
            wraps each column in its own <nav> hands a screen reader four
            identical unlabelled navigations — the classic defect this
            component exists to make impossible. The brand column and the
            legal line ride inside it because they are part of the same
            closing block; neither is a link, so neither joins the list. */}
        <nav className="sv-site-footer__nav" aria-label="Footer">
          <div className="sv-site-footer__grid">
            <div className="sv-site-footer__brand">
              {WORDMARK}
              {statement && <p className="sv-site-footer__statement">{statement}</p>}
            </div>

            {groups.map((group, i) => {
              const titleId = `${baseId}-group-${i}`;
              return (
                <div className="sv-site-footer__group" key={group.title}>
                  {/* NOT a heading. An h2 dropped in at the end of a page
                      re-opens the outline after the content has closed it,
                      and four of them skip or duplicate levels depending on
                      what the page above used (A4). What this actually is
                      is a labelled list, so it is labelled as one. */}
                  <p className="sv-site-footer__grouptitle sv-mono" id={titleId}>
                    {group.title}
                  </p>
                  <ul className="sv-site-footer__links" aria-labelledby={titleId}>
                    {group.links.map((link) => (
                      <li key={link.label}>
                        {toLink(link, 'sv-site-footer__link', renderLink)}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="sv-site-footer__bottom">
            <p className="sv-site-footer__legal sv-mono">{legal}</p>
            {secondary && secondary.length > 0 && (
              <ul className="sv-site-footer__secondary">
                {secondary.map((link) => (
                  <li key={link.label}>
                    {toLink(link, 'sv-site-footer__seclink', renderLink)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>
      </div>
    </footer>
  );
}
