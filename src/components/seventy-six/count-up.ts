import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';

/**
 * `useCountUp` (v0.6.1) — the counting figure, on the moving surface.
 *
 * It is a HOOK and not a component, and it ships no CSS, because a figure
 * that counts is not a new widget: it is B3's value and B50's figure, in
 * the type they already wear, arriving at the number they already state.
 * A `<CountUp>` component would be a second way to print a number, and
 * the Book's answer to a second way to print a number is that there
 * isn't one.
 *
 * THE GOVERNING PRINCIPLE: MOTION NEVER CARRIES INFORMATION. Every value
 * this hook passes through on the way up is already printed somewhere the
 * reader — and the screen reader — can have it at first paint. Delete the
 * hook and the screen still states everything: that is the test B44 sets
 * ("delete the strip and the card still answers the question"), and it is
 * the only reason a count-up is admissible in a system that bans the
 * shimmer (A2) and sends every animation to 0ms under reduced motion (C7).
 *
 * WHAT IT IS NOT: it does not format (C9 — it returns a number and never
 * a string; the CALLER formats, in its own locale, at its own layer), it
 * does not source or derive a figure, and it never leaves a value on
 * screen that is not either the final one or a frame of an animation the
 * reader's own posture asked for.
 *
 * Like `usePopoverAnchor` (B42) this is deliberately not re-exported from
 * the barrel: it is the two registered components' implementation, not
 * public API.
 */

/** The one media query on this surface, named once. */
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/** Read by the hook from the token layer; see tokens.css, "The moving
    surface". The constant is a FALLBACK for the case where the tokens
    are not on the page — never the source of the number. */
const COUNT_MS_FALLBACK = 640;
const DURATION_TOKEN = '--sv-t-count';

export interface CountUpOptions {
  /** Off is off: the hook returns the final value and attaches nothing. */
  enabled?: boolean;
  /** Overrides the `--sv-t-count` token. 0 or less is "no animation". */
  durationMs?: number;
  /**
   * The element the posture is resolved AT — its nearest `[data-motion]`
   * ancestor decides, exactly as a custom property resolves at its nearest
   * declaration. Without it the hook can only see a posture declared on
   * `<html>`, because a hook with no element cannot know which wrapper
   * contains it; both registered call sites therefore pass one, and it is
   * the element that prints the figure.
   */
  scope?: RefObject<HTMLElement | null>;
}

/**
 * Deceleration, no overshoot: ease-out-cubic, which is
 * `cubic-bezier(0.215, 0.61, 0.355, 1)` — the same curve `.sv-enter` runs
 * in CSS, so the surface has one curve rather than one per layer. y never
 * leaves [0,1], so the figure never passes its own target and comes back:
 * Ship Gate 13 and Part E ban the bounce in CSS, and a spring written in
 * JavaScript is the same defect with the firewall looking the other way.
 */
function easeOut(t: number): number {
  return 1 - (1 - t) ** 3;
}

/**
 * The posture, at the NEAREST declaration. `closest` includes the element
 * itself, so a figure that declares its own posture answers for itself,
 * and a nested `data-motion='off'` inside an `on` region wins — which is
 * the whole reason this reads the nearest attribute rather than asking
 * the document whether motion exists anywhere.
 */
function postureOn(el: Element | null): boolean {
  const near = (el ?? document.documentElement).closest('[data-motion]');
  return near?.getAttribute('data-motion') === 'on';
}

/**
 * The duration, from the token that declares it. Reading the computed
 * value rather than hard-coding one keeps the amendment to A1's 200ms
 * ceiling in ONE place — the token layer, where it is registered and
 * argued — and buys the collapse for free: `--sv-t-count` is 0ms when the
 * posture is off, under reduced motion, and on paper, so a hook that
 * honours the number honours all three without being told about them.
 */
function tokenMs(el: Element | null): number | null {
  const from = el ?? document.documentElement;
  const raw = getComputedStyle(from).getPropertyValue(DURATION_TOKEN).trim();
  if (!raw) return null;
  const n = Number.parseFloat(raw);
  if (!Number.isFinite(n)) return null;
  if (raw.endsWith('ms')) return n;
  if (raw.endsWith('s')) return n * 1000;
  return null;
}

/**
 * The first frame has to be painted BEFORE the browser paints, or the
 * reader sees the final figure and then watches it fall to zero — a wrong
 * number arriving by way of a correct one. That is what a layout effect
 * is for. The ternary is the only concession to a renderer that has no
 * DOM: on a server there is no posture to read, the hook returns the
 * final value, and the client picks up the layout effect after hydration.
 */
const useIsoLayoutEffect = typeof document === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Returns the figure to PRINT this frame — the final value unless the
 * reader's declared posture says otherwise.
 *
 * It returns the FINAL value immediately when the posture is off, when
 * `prefers-reduced-motion` matches, when `enabled` is false, when the
 * duration is 0, and when `target` is not a finite number. It cancels its
 * frame on unmount and on every re-run, so it never leaks one; and when a
 * run ends for any reason other than reaching the end, the value it
 * leaves behind is the target, never a frame of a count that stopped.
 */
export function useCountUp(target: number, options?: CountUpOptions): number {
  const { enabled = true, durationMs, scope } = options ?? {};

  /* The final value is the initial state, so first paint — and any
     render before the DOM exists — prints the number the card means. */
  const [shown, setShown] = useState(target);
  const shownRef = useRef(target);
  const startedRef = useRef(false);

  /* Bumped when the posture changes under the hook's feet. It is a
     dependency of the animation effect and nothing else reads it. */
  const [postureGeneration, setPostureGeneration] = useState(0);

  /* THE POSTURE IS LIVE, not a build-time constant and not a value read
     once at mount: a reader who toggles the switch must not have to
     reload, and one who turns motion OFF mid-count must land on the final
     figure at once rather than watching the count they just cancelled
     finish. The media query announces itself; the attribute does not, so
     a MutationObserver watches `data-motion` across the document —
     filtered to that one attribute, so it wakes for nothing else.
     Neither is attached when the hook is disabled: a StatS1 that states a
     figure without counting it observes nothing at all. */
  useEffect(() => {
    if (!enabled) return;
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
  }, [enabled]);

  useIsoLayoutEffect(() => {
    const el = scope?.current ?? null;

    /* Every exit from this effect that is not "the animation is running"
       goes through here, which is what makes the wrong number
       unreachable: there is one way to stop and it prints the target. */
    const settle = () => {
      shownRef.current = target;
      setShown(target);
    };

    if (!enabled || !Number.isFinite(target)) return settle();
    if (window.matchMedia(REDUCED_MOTION).matches) return settle();
    if (!postureOn(el)) return settle();

    const ms = durationMs ?? tokenMs(el) ?? COUNT_MS_FALLBACK;
    if (!(ms > 0)) return settle();

    /* A first run counts from nothing. A re-run — `target` changed
       mid-flight, or the posture did — counts from what is ON SCREEN, so
       the figure never jumps backwards to zero to reach a number it was
       already most of the way to. */
    const from = startedRef.current ? shownRef.current : 0;
    startedRef.current = true;
    shownRef.current = from;
    setShown(from);

    let frame = 0;
    let start: number | null = null;

    const step = (now: number) => {
      if (start === null) start = now;
      const t = (now - start) / ms;

      /* The last frame is the TARGET ITSELF, not a rounded approach to
         it: the hook counts in integers, but the figure it lands on is
         the caller's exactly — a target of 4.7 ends at 4.7, and one of
         1,204,933 ends on the digit that matters. */
      if (t >= 1) return settle();

      const next = Math.round(from + (target - from) * easeOut(t));
      shownRef.current = next;
      setShown(next);
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);

    /* Cancelled on unmount and before every re-run. The re-run settles or
       re-starts within the same layout pass, so there is no frame in
       which a cancelled count is still on screen. */
    return () => cancelAnimationFrame(frame);
  }, [target, enabled, durationMs, scope, postureGeneration]);

  return shown;
}
