import { describe, it, expect } from 'vitest';
import { check as checkSource } from './slop-firewall.mjs';
import { check as checkSkillMirror } from '../skill/seventy-six-design/scripts/slop-firewall.mjs';

/**
 * Coverage for every flag() rule currently in the firewall (source is the
 * inventory — this file does not hardcode a rule count), the registered
 * exceptions named in the README, and the two regressions that motivated
 * this suite (see issue #1): the color-literal scan silently skipping .tsx,
 * and the glassmorphism rule false-flagging DOM .blur()/onBlur once .tsx
 * was in scope. No changes to src/ or to the firewall's rules — this is
 * coverage only.
 */

function violations(file, source) {
  return checkSource(file, source, []);
}

function isClean(file, source) {
  expect(violations(file, source)).toEqual([]);
}

function flagsWith(file, source, ruleSubstring) {
  const v = violations(file, source);
  expect(v.some((line) => line.includes(ruleSubstring))).toBe(true);
}

describe('gradient', () => {
  it('flags a linear-gradient', () => {
    flagsWith('card.css', 'background: linear-gradient(90deg, red, blue);', 'gradient');
  });
  it('allows a token background', () => {
    isClean('card.css', 'background: var(--sv-paper);');
  });
});

describe('glassmorphism', () => {
  it('flags filter: blur(...)', () => {
    flagsWith('overlay.css', 'filter: blur(4px);', 'glassmorphism');
  });
  it('flags backdrop-filter', () => {
    flagsWith('overlay.css', 'backdrop-filter: blur(2px);', 'glassmorphism');
  });
  // Regression: widening the color-literal scan to .tsx made this rule
  // false-flag a validation helper named blur('email') — 7 fake violations.
  it('does not flag an onBlur handler in .tsx', () => {
    isClean('field.tsx', "onBlur={() => touched('email')}");
  });
  it('does not flag a DOM .blur() call', () => {
    isClean('field.tsx', 'el.blur();');
  });
  it('does not flag a function named blur(', () => {
    isClean('validators.tsx', "function blur(value) { return value.trim(); }");
  });
});

describe('text/drop shadow', () => {
  it('flags text-shadow', () => {
    flagsWith('label.css', 'text-shadow: 0 1px 1px rgba(0,0,0,.4);', 'text/drop shadow');
  });
  it('flags drop-shadow', () => {
    flagsWith('label.css', 'filter: drop-shadow(0 1px 1px rgba(0,0,0,.4));', 'text/drop shadow');
  });
  it('allows plain text-transform', () => {
    isClean('label.css', 'text-transform: uppercase;');
  });
});

describe('!important', () => {
  it('flags !important', () => {
    flagsWith('card.css', 'color: var(--sv-ink) !important;', '!important');
  });
  it('allows a plain declaration', () => {
    isClean('card.css', 'color: var(--sv-ink);');
  });
});

describe('color literal outside tokens.css', () => {
  it('flags a hex literal in a .css file', () => {
    flagsWith('button.css', 'background: #4285F4;', 'color literal outside tokens.css');
  });
  // Regression: the original rule tested /\.css$/ only, so a hex in a .tsx
  // (an inline SVG fill) passed while the firewall reported clean.
  it('flags a hex literal in a .tsx file', () => {
    flagsWith('icon.tsx', '<path fill="#4285F4" />', 'color literal outside tokens.css');
  });
  it('allows a hex literal inside tokens.css', () => {
    isClean('tokens.css', '--sv-brand: #4285F4;');
  });
  it('allows a hex literal inside foundations.tsx (the palette specimen)', () => {
    isClean('foundations.tsx', '<Swatch color="#4285F4" />');
  });
  it('allows a token reference', () => {
    isClean('button.css', 'background: var(--sv-brand);');
  });
});

describe('paper-as-text (rule 16)', () => {
  it('flags color: var(--sv-paper) outside tokens.css', () => {
    flagsWith('band.css', 'color: var(--sv-paper);', 'paper-as-text');
  });
  it('flags outline-color: var(--sv-paper)', () => {
    flagsWith('band.css', 'outline-color: var(--sv-paper);', 'paper-as-text');
  });
  it('allows --sv-paper declared inside tokens.css', () => {
    isClean('tokens.css', '--sv-paper: #fff;');
  });
  it('allows --sv-on-dark for marks on band/seed', () => {
    isClean('band.css', 'color: var(--sv-on-dark);');
  });
  it('does not flag background-color (only bare color/outline-color)', () => {
    isClean('card.css', 'background-color: var(--sv-paper);');
  });
});

describe('bare 1fr content track (rule 19)', () => {
  it('flags repeat(N, 1fr)', () => {
    flagsWith('grid.css', 'grid-template-columns: repeat(3, 1fr);', 'bare 1fr content track');
  });
  it('flags a bare 1fr pair', () => {
    flagsWith('grid.css', 'grid-template-columns: 1fr 1fr;', 'bare 1fr content track');
  });
  it('flags the JS-style gridTemplateColumns form', () => {
    flagsWith('layout.tsx', "gridTemplateColumns: '1fr 1fr',", 'bare 1fr content track');
  });
  it('allows minmax(0, 1fr) tracks', () => {
    isClean('grid.css', 'grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);');
  });
  it('allows the rule/label/rule divider (1fr auto 1fr)', () => {
    isClean('divider.css', 'grid-template-columns: 1fr auto 1fr;');
  });
});

describe('display type outside the marketing surface (rule 17)', () => {
  it('flags --sv-display-* outside the allowlisted files', () => {
    flagsWith('dashboard-header.css', 'font-size: var(--sv-display-2);', 'display type outside the marketing surface');
  });
  it('allows it in masthead.css', () => {
    isClean('masthead.css', 'font-size: var(--sv-display-1);');
  });
  it('allows it in cta.css', () => {
    isClean('cta.css', 'font-size: var(--sv-display-3);');
  });
  it('allows it in proof-row.css', () => {
    isClean('proof-row.css', 'font-size: var(--sv-display-3);');
  });
  it('allows it in tokens.css (where it is declared)', () => {
    isClean('tokens.css', '--sv-display-1: 64px;');
  });
});

describe('non-token box-shadow', () => {
  it('flags a raw box-shadow', () => {
    flagsWith('card.css', 'box-shadow: 0 2px 4px rgba(0,0,0,.2);', 'non-token box-shadow');
  });
  it('allows var(--sv-shadow)', () => {
    isClean('card.css', 'box-shadow: var(--sv-shadow);');
  });
  it('allows inset (structural rules, not elevation)', () => {
    isClean('data-table.css', 'box-shadow: inset 0 0 0 1px var(--sv-line);');
  });
  it('allows none', () => {
    isClean('card.css', 'box-shadow: none;');
  });
});

describe('unregistered border-radius', () => {
  it('flags an arbitrary radius', () => {
    flagsWith('card.css', 'border-radius: 8px;', 'unregistered border-radius');
  });
  it('allows var(--sv-r)', () => {
    isClean('card.css', 'border-radius: var(--sv-r);');
  });
  it('allows 50%', () => {
    isClean('avatar.css', 'border-radius: 50%;');
  });
  it('allows 0', () => {
    isClean('card.css', 'border-radius: 0;');
  });
});

describe('animation > 200ms', () => {
  it('flags a slow animation', () => {
    flagsWith('toast.css', 'animation: fade 400ms ease;', 'animation > 200ms');
  });
  it('allows an animation at or under 200ms', () => {
    isClean('toast.css', 'animation: fade 150ms ease;');
  });
  it('allows sv-rotate regardless of duration (B10/B31 spinner)', () => {
    isClean('button.css', 'animation: sv-rotate 900ms linear infinite;');
  });
});

describe('transition on layout property', () => {
  it('flags a width transition outside the registered exception', () => {
    flagsWith('panel.css', 'transition: width 200ms ease;', 'transition on layout property');
  });
  it('allows the B4/B6 width transition in progress.css', () => {
    isClean('progress.css', 'transition: width 160ms ease;');
  });
  it('allows the B4/B6 width transition in meter-list.css', () => {
    isClean('meter-list.css', 'transition: width 160ms ease;');
  });
  it('allows a transition on a non-layout property', () => {
    isClean('panel.css', 'transition: color 150ms ease;');
  });
});

describe('unregistered font-family', () => {
  it('flags an off-system font', () => {
    flagsWith('widget.css', 'font-family: Arial, sans-serif;', 'unregistered font-family');
  });
  it('allows var(--sv-font-ui)', () => {
    isClean('widget.css', 'font-family: var(--sv-font-ui);');
  });
  it('allows inherit', () => {
    isClean('widget.css', 'font-family: inherit;');
  });
});

describe('display face outside the public surface (rule 20)', () => {
  it('flags --sv-font-display outside the allowlisted files', () => {
    flagsWith('dashboard.css', 'font-family: var(--sv-font-display);', 'display face outside the public surface');
  });
  it('allows it in masthead.css', () => {
    isClean('masthead.css', 'font-family: var(--sv-font-display);');
  });
  it('allows it in index-row.css', () => {
    isClean('index-row.css', 'font-family: var(--sv-font-display);');
  });
  it('allows it in tokens.css', () => {
    isClean('tokens.css', '--sv-font-display: "Archivo Variable";');
  });
});

describe('italic', () => {
  it('flags italic outside prose.css', () => {
    flagsWith('heading.css', 'font-style: italic;', 'italic');
  });
  it('allows italic inside prose.css (B45 running body copy)', () => {
    isClean('prose.css', 'font-style: italic;');
  });
});

describe('arbitrary z-index', () => {
  it('flags a three-digit z-index', () => {
    flagsWith('modal.css', 'z-index: 9999;', 'arbitrary z-index');
  });
  it('allows the --sv-z-* ladder', () => {
    isClean('modal.css', 'z-index: var(--sv-z-modal);');
  });
  it('allows a small literal (under 3 digits)', () => {
    isClean('modal.css', 'z-index: 10;');
  });
});

describe('overflow-x hidden', () => {
  it('flags overflow-x: hidden', () => {
    flagsWith('band.css', 'overflow-x: hidden;', 'overflow-x hidden');
  });
  it('allows overflow-x: auto', () => {
    isClean('band.css', 'overflow-x: auto;');
  });
});

describe('image motion on hover', () => {
  it('flags an :hover img rule', () => {
    flagsWith('row.css', '.sv-row:hover img { transform: scale(1.05); }', 'image motion on hover');
  });
  it('flags group-hover:scale', () => {
    flagsWith('row.tsx', 'className="group-hover:scale-105"', 'image motion on hover');
  });
  it('allows a hover rule with no image', () => {
    isClean('row.css', '.sv-row:hover { background: var(--sv-hover); }');
  });
});

describe('bounce/overshoot easing', () => {
  it('flags a cubic-bezier with y outside [0,1]', () => {
    flagsWith('menu.css', 'transition: transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1);', 'bounce/overshoot easing');
  });
  it('allows a cubic-bezier with y within [0,1]', () => {
    isClean('menu.css', 'transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);');
  });
});

describe('card padding (rule 18, structural)', () => {
  it('flags a non-exempt component flush against a Card', () => {
    const source = ['<Card>', '  <Something />', '</Card>'].join('\n');
    flagsWith('panel.tsx', source, 'rule 18');
  });
  it('allows a component wrapped in sv-card__body', () => {
    const source = [
      '<Card>',
      '  <div className="sv-card__body">',
      '    <Something />',
      '  </div>',
      '</Card>',
    ].join('\n');
    isClean('panel.tsx', source);
  });
  it('allows a full-bleed component by name (DataTable)', () => {
    const source = ['<Card>', '  <DataTable />', '</Card>'].join('\n');
    isClean('panel.tsx', source);
  });
  it('is only checked in .tsx files', () => {
    const source = ['<Card>', '  <Something />', '</Card>'].join('\n');
    isClean('panel.css', source);
  });
});

describe('registered firewall exceptions (README)', () => {
  it('the sv-rotate spinner is exempt from the animation-duration rule', () => {
    isClean('button.css', 'animation: sv-rotate 900ms linear infinite;');
  });
  it('inset box-shadows are exempt from the non-token box-shadow rule', () => {
    isClean('data-table.css', 'box-shadow: inset 0 0 0 1px var(--sv-line);');
  });
  it('the B4/B6 width transition is exempt from the layout-transition rule', () => {
    isClean('progress.css', 'transition: width 160ms ease;');
  });
  it('foundations.tsx is exempt from the color-literal rule', () => {
    isClean('foundations.tsx', '<Swatch color="#4285F4" />');
  });
});

describe('behavioral identity between the source firewall and its skill mirror', () => {
  const fixtures = [
    ['card.css', 'background: linear-gradient(90deg, red, blue);'],
    ['card.css', 'background: var(--sv-paper);'],
    ['overlay.css', 'filter: blur(4px);'],
    ['field.tsx', "onBlur={() => touched('email')}"],
    ['icon.tsx', '<path fill="#4285F4" />'],
    ['band.css', 'color: var(--sv-paper);'],
    ['modal.css', 'z-index: 9999;'],
    ['progress.css', 'transition: width 160ms ease;'],
  ];

  it.each(fixtures)('%s produces the same violations from both copies (%s)', (file, source) => {
    expect(checkSkillMirror(file, source, [])).toEqual(checkSource(file, source, []));
  });
});
