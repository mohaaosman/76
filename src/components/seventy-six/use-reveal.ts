import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';

/**
 * `useReveal` (v0.8) — the entrance, on the moving surface.
 *
 * It is a HOOK and not a component, and it ships no CSS, for the reason
 * `useCountUp` gives: an element that arrives is not a new widget, it is
 * a section the page already had, arriving. The move itself is already
 * registered — `.sv-enter` in base.css, one opacity step and 6px, inert
 * unless a wrapper declares `data-motion='on'` — so this hook adds no
 * style, no class and no wrapper element. It reports ONE boolean and the
 * caller decides what to put on the element.
 *
 * THE GOVERNING PRINCIPLE: MOTION NEVER CARRIES INFORMATION. Nothing
 * this hook gates is information — the section is in the DOM at first
 * paint, in the accessible tree, in the print stylesheet, and findable
 * by the browser's own find-in-page whatever this returns. Delete the
 * hook and the page states everything it stated before.
 *
 * WHICH IS WHY `revealed` IS TRUE UNTIL SOMETHING EARNS THE RIGHT TO
 * TURN IT OFF. It starts true, it is set false only inside a layout
 * effect that has already established a real element, a live
 * IntersectionObserver, no reduced-motion preference and a declared
 * posture — and it is set false BEFORE the browser paints, so there is
 * no frame in which the reader sees the section and then watches it
 * vanish to be animated at them. On a server, on a browser without
 * `IntersectionObserver`, under `prefers-reduced-motion`, with the
 * posture off, or when the caller never attached the ref, the hook does
 * not observe at all and every element is visible at full opacity on
 * first paint. A reveal hook that hides content on a browser it does not
 * understand has not decorated the page, it has broken it — that failure
 * is the one this file is written around.
 *
 * WHAT IT IS NOT: it does not animate (CSS does), it does not measure,
 * it does not stagger a list (a queue of delayed children is a page
 * performing, A2), and it never re-hides something the reader has
 * already been shown.
 *
 * Like `useCountUp` (v0.6.1) and `usePopoverAnchor` (B42) this is
 * deliberately not re-exported from the barrel: it is the public
 * surface's implementation, not public API.
 */

/** The one media query on this surface, named once — as in count-up.ts. */
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export interface UseRevealOptions {
  /**
   * TRUE BY DEFAULT. An element that re-hides when it scrolls past is a
   * page fighting its reader: they scrolled back for the thing they just
   * read, and the page took it away to perform its arrival a second
   * time. `false` exists for a caller that genuinely wants a live
   * in-view flag, and it still never re-hides once the posture goes off.
   */
  once?: boolean;
  /**
   * Passed straight to the observer, for a caller that wants the section
   * to arrive a little before or after its edge crosses.
   *
   * A margin that the element can never satisfy is content that never
   * appears — none of the guards below can save a page from a root
   * margin that excludes its own footer, because from the observer's
   * side that is a section which has simply not been reached yet.
   */
  rootMargin?: string;
}

/**
 * The posture, at the NEAREST declaration — count-up.ts's function,
 * verbatim, because the two hooks must not be able to disagree about
 * what a reader asked for. `closest` includes the element itself, so a
 * section that declares its own posture answers for itself, and a nested
 * `data-motion='off'` inside an `on` region wins.
 */
function postureOn(el: Element | null): boolean {
  const near = (el ?? document.documentElement).closest('[data-motion]');
  return near?.getAttribute('data-motion') === 'on';
}

/**
 * The hidden state has to be set BEFORE the browser paints or the reader
 * sees the section, then sees it disappear so it can fade back in — the
 * page taking something away in order to give it. That is what a layout
 * effect is for. The ternary is the concession to a renderer with no
 * DOM: on a server there is no posture to read, the hook reports
 * revealed, and the markup ships visible. — count-up.ts, same shape.
 */
const useIsoLayoutEffect = typeof document === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Returns the ref to attach and whether the element should be SHOWN this
 * frame.
 *
 * It returns `revealed: true` immediately — before any observation — when
 * the posture is off, when `prefers-reduced-motion` matches, when
 * `IntersectionObserver` is unavailable, and when there is no element to
 * observe. It disconnects its observer on unmount and before every
 * re-run, so it never leaks one; and once an element has been shown for
 * good it is never hidden again, whatever the reader changes afterwards.
 */
export function useReveal<T extends HTMLElement>(options?: UseRevealOptions): {
  ref: RefObject<T | null>;
  revealed: boolean;
} {
  const { once = true, rootMargin = '0px' } = options ?? {};

  const ref = useRef<T | null>(null);

  /* Visible is the initial state, so first paint — and any render before
     the DOM exists — shows the section the page means. */
  const [revealed, setRevealed] = useState(true);

  /* Latched the moment the element is shown FOR GOOD: a completed
     `once` reveal, or any of the reasons not to observe at all. Nothing
     clears it, which is the point — a reader who turns motion ON after
     reading half the page must not watch the half they have already read
     disappear so it can arrive. */
  const settledRef = useRef(false);

  /* Bumped when the posture changes under the hook's feet. It is a
     dependency of the observation effect and nothing else reads it. */
  const [postureGeneration, setPostureGeneration] = useState(0);

  /* THE POSTURE IS LIVE, not a value read once at mount. A reader who
     toggles the switch must not have to reload, and — the defect this
     exists to prevent — one who turns motion OFF while a section is
     still below the fold must not be left with a section that is hidden
     and has no observer coming to reveal it. The media query announces
     itself; the attribute does not, so a MutationObserver watches
     `data-motion` across the document, filtered to that one attribute so
     it wakes for nothing else. count-up.ts's arrangement exactly. */
  useEffect(() => {
    const bump = () => setPostureGeneration((n) => n + 1);

    const query = window.matchMedia(REDUCED_MOTION);
    query.addEventListener('change', bump);

    const observer = new MutationObserver(bump);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-motion'],
      subtree: true,
    });

    return () => {
      query.removeEventListener('change', bump);
      observer.disconnect();
    };
  }, []);

  useIsoLayoutEffect(() => {
    /* Already shown for good. Re-running would be the page taking it
       back. */
    if (settledRef.current) return;

    const el = ref.current;

    /* Every exit that is not "the observer is running" goes through
       here, which is what makes the invisible section unreachable: there
       is one way to stop, it shows the element, and it latches. */
    const show = () => {
      settledRef.current = true;
      setRevealed(true);
    };

    /* No element — the caller never attached the ref, or renders it on a
       later pass. Nothing will re-run this effect when it appears, so
       the honest answer is the visible one, permanently: a section with
       no entrance is a section, and a section that is waiting for one is
       a blank space. */
    if (!el) return show();

    /* The browser does not have the API. It gets the page, all of it. */
    if (typeof IntersectionObserver === 'undefined') return show();

    /* C7, and the posture — the same two gates the token layer applies
       to --sv-t-enter, applied here to the thing that would have been
       animated. Read at the element, so a nested posture resolves at its
       own nearest declaration. */
    if (window.matchMedia(REDUCED_MOTION).matches) return show();
    if (!postureOn(el)) return show();

    /* Only now, and before the paint. */
    setRevealed(false);

    const observer = new IntersectionObserver(
      (entries) => {
        /* The last entry is the current state; earlier ones in a batch
           are already history. */
        const entry = entries[entries.length - 1];
        if (!entry) return;

        if (entry.isIntersecting) {
          if (once) {
            settledRef.current = true;
            observer.disconnect();
          }
          setRevealed(true);
          return;
        }

        /* Only a caller that asked for a live flag ever gets an element
           taken back off the screen. */
        if (!once) setRevealed(false);
      },
      { rootMargin },
    );

    observer.observe(el);

    /* Disconnected on unmount and before every re-run — the observer
       holds a reference to the element, so a re-run that left the old
       one attached would leak both. */
    return () => observer.disconnect();
  }, [once, rootMargin, postureGeneration]);

  return { ref, revealed };
}
