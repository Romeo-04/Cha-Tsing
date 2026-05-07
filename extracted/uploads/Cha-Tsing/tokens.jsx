// tokens.jsx — Cha-Tsing design system tokens
// Warm cream base, semantic color, type scale.

const CT_PALETTES = {
  cream: {
    bg:        '#FAEEDA',  // warm cream — Sunday morning
    bgSoft:    '#F5E2C5',
    bgCard:    '#FFF8EC',
    ink:       '#2A1F12',  // warm black, never pure
    inkSoft:   '#6B5640',
    inkMuted:  '#9C8870',
    line:      '#E8D4B0',
  },
  sage: {
    bg:        '#E8EFE5',
    bgSoft:    '#D8E3D2',
    bgCard:    '#F4F8F1',
    ink:       '#1F2A1A',
    inkSoft:   '#506049',
    inkMuted:  '#8C9A85',
    line:      '#C8D4C0',
  },
  rose: {
    bg:        '#F8E5DC',
    bgSoft:    '#F0D2C5',
    bgCard:    '#FFF1EA',
    ink:       '#2A1814',
    inkSoft:   '#6B4A40',
    inkMuted:  '#9C7A6E',
    line:      '#E8C8B8',
  },
  midnight: { // dark mode
    bg:        '#1C1812',
    bgSoft:    '#26211A',
    bgCard:    '#2E2820',
    ink:       '#FAEEDA',
    inkSoft:   '#C8B89E',
    inkMuted:  '#8C7E68',
    line:      '#3D352A',
  },
};

const CT_SEMANTIC = {
  // semantic, not decorative
  win:      '#22A06B',  // teal/green — savings, wins
  winSoft:  '#C5E8D5',
  danger:   '#E54B3C',  // coral — overspending
  dangerSoft:'#FBD3CD',
  dream:    '#7C4DFF',  // purple — aspirations
  dreamSoft:'#DCD0FF',
  amber:    '#C9854A',  // chico's fur tone
  amberSoft:'#F2D4B0',
};

const CT_TYPE = {
  // 'Fraunces' is in the avoid-list, but for a warm character app a friendly
  // serif works well. Use 'Inter' for sans; both are widely available.
  serif: '"Instrument Serif", "Times New Roman", Georgia, serif',
  sans:  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  mono:  'ui-monospace, "SF Mono", Menlo, monospace',
};

// Format peso amount with thousands separators
function peso(n, opts = {}) {
  const sign = n < 0 ? '-' : '';
  const v = Math.abs(Math.round(n));
  const s = v.toLocaleString('en-PH');
  return `${sign}₱${s}${opts.suffix || ''}`;
}

// Animated number counter hook
function useCountTo(target, duration = 600) {
  const [v, setV] = React.useState(target);
  const fromRef = React.useRef(target);
  const startRef = React.useRef(performance.now());

  React.useEffect(() => {
    fromRef.current = v;
    startRef.current = performance.now();
    let raf;
    const tick = () => {
      const t = Math.min(1, (performance.now() - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const cur = fromRef.current + (target - fromRef.current) * eased;
      setV(cur);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line
  }, [target]);
  return v;
}

Object.assign(window, { CT_PALETTES, CT_SEMANTIC, CT_TYPE, peso, useCountTo });
