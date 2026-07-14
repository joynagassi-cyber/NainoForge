import { describe, it, expect, beforeEach } from 'vitest';
import { injectForgeBadge } from '../forge-badge.js';

describe('injectForgeBadge', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('injects a button with label "Forger cette page"', () => {
    injectForgeBadge(document);
    const badge = document.getElementById('nf-forge-badge');
    expect(badge).not.toBeNull();
    const btn = badge?.querySelector('button');
    expect(btn?.textContent).toBe('Forger cette page');
  });

  it('does not duplicate badge on second call', () => {
    injectForgeBadge(document);
    injectForgeBadge(document);
    const badges = document.querySelectorAll('#nf-forge-badge');
    expect(badges.length).toBe(1);
  });

  it('injects a style tag with the badge CSS', () => {
    injectForgeBadge(document);
    const style = document.getElementById('nf-forge-badge-css');
    expect(style).not.toBeNull();
    expect(style?.textContent).toContain('.nf-forge-btn');
  });
});
