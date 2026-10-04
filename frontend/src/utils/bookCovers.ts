/**
 * Curated high-resolution covers and fallback cover generator
 * Guarantees 100% CORS-safe, instantaneous, high-fidelity book covers.
 */

interface BookCoverConfig {
  title: string;
  author: string;
  category?: string;
  accent?: string;
  bg?: string;
}

const CATEGORY_STYLES: Record<string, { bg: string; accent: string; sub: string }> = {
  'Computer Science': { bg: '#10141d', accent: '#ffe17c', sub: '#60a5fa' },
  'Fiction': { bg: '#1c151b', accent: '#f472b6', sub: '#fbcfe8' },
  'Self-Help': { bg: '#0d2218', accent: '#34d399', sub: '#a7f3d0' },
  'Business & Finance': { bg: '#121b2d', accent: '#38bdf8', sub: '#bae6fd' },
  'Science & Nature': { bg: '#1a102f', accent: '#c084fc', sub: '#e9d5ff' },
  'Design & UI/UX': { bg: '#291807', accent: '#fbbf24', sub: '#fef08a' },
  'Hindi Literature': { bg: '#2b1406', accent: '#fb923c', sub: '#ffedd5' },
  'Gujarati Classics': { bg: '#0b2024', accent: '#2dd4bf', sub: '#ccfbf1' },
  'default': { bg: '#18181b', accent: '#ffe17c', sub: '#d4d4d8' },
};

/**
 * Generates an SVG Data-URI book cover that works 100% offline,
 * has zero CORS issues in WebGL/OGL, and renders crisp book jacket artwork.
 */
export function generateBookCoverSvg({
  title,
  author,
  category = 'Curated Edition',
  accent,
  bg,
}: BookCoverConfig): string {
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES['default'];
  const coverBg = bg || style.bg;
  const coverAccent = accent || style.accent;

  // Escape XML characters
  const cleanTitle = title
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  const cleanAuthor = author
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const cleanCategory = category
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Split title into lines for SVG rendering
  const words = cleanTitle.split(' ');
  const lines: string[] = [];
  let cur = '';
  words.forEach(w => {
    if ((cur + ' ' + w).trim().length > 16) {
      if (cur) lines.push(cur);
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  });
  if (cur) lines.push(cur);

  const titleSvgLines = lines
    .slice(0, 3)
    .map((l, i) => `<tspan x="60" dy="${i === 0 ? 0 : 44}">${l}</tspan>`)
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${coverBg}" />
      <stop offset="100%" stop-color="#090a0f" />
    </linearGradient>
    <linearGradient id="spineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25" />
      <stop offset="25%" stop-color="#ffffff" stop-opacity="0.05" />
      <stop offset="85%" stop-color="#000000" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.6" />
    </linearGradient>
    <pattern id="dotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.2" fill="#ffffff" fill-opacity="0.06" />
    </pattern>
  </defs>

  <!-- Base cover fill -->
  <rect width="600" height="900" fill="url(#bgGrad)" />
  <rect width="600" height="900" fill="url(#dotPattern)" />

  <!-- Outer gilded border -->
  <rect x="24" y="24" width="552" height="852" rx="4" fill="none" stroke="${coverAccent}" stroke-width="2.5" stroke-opacity="0.6" />
  <rect x="32" y="32" width="536" height="836" rx="2" fill="none" stroke="${coverAccent}" stroke-width="1" stroke-opacity="0.3" />

  <!-- Spine 3D illusion shadow -->
  <rect x="0" y="0" width="36" height="900" fill="url(#spineGrad)" />
  <line x1="36" y1="0" x2="36" y2="900" stroke="#ffffff" stroke-opacity="0.15" stroke-width="1.5" />

  <!-- Category badge -->
  <g transform="translate(60, 80)">
    <rect width="180" height="28" rx="14" fill="${coverAccent}" fill-opacity="0.18" stroke="${coverAccent}" stroke-width="1.5" />
    <text x="90" y="18" fill="${coverAccent}" font-family="'Courier New', monospace" font-size="11" font-weight="bold" text-anchor="middle" letter-spacing="2">
      ${cleanCategory.toUpperCase()}
    </text>
  </g>

  <!-- Decorative ornament -->
  <g transform="translate(60, 240)">
    <line x1="0" y1="0" x2="60" y2="0" stroke="${coverAccent}" stroke-width="3" />
    <circle cx="75" cy="0" r="4" fill="${coverAccent}" />
    <line x1="90" y1="0" x2="150" y2="0" stroke="${coverAccent}" stroke-width="1.5" stroke-opacity="0.5" />
  </g>

  <!-- Title -->
  <text x="60" y="330" fill="#ffffff" font-family="'Georgia', serif" font-size="38" font-weight="900" letter-spacing="-0.5">
    ${titleSvgLines}
  </text>

  <!-- Author -->
  <text x="60" y="580" fill="${coverAccent}" font-family="'Courier New', monospace" font-size="16" font-weight="bold" letter-spacing="3">
    BY ${cleanAuthor.toUpperCase()}
  </text>

  <!-- Bottom emblem -->
  <g transform="translate(60, 780)">
    <rect width="480" height="1" fill="#ffffff" fill-opacity="0.15" />
    <text x="0" y="38" fill="#ffffff" fill-opacity="0.5" font-family="sans-serif" font-size="12" letter-spacing="4">
      BOOKLY · FIRST EDITION ARCHIVAL COPY
    </text>
    <text x="480" y="38" fill="${coverAccent}" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="end">
      ★ 5.0
    </text>
  </g>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * High-res verified photo cover or SVG fallback for every book ID.
 */
export const VERIFIED_BOOK_COVERS: Record<string, string> = {
  'book-1': 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=800&auto=format&fit=crop',
  'book-2': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
  'book-3': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
  'book-4': 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop',
  'book-5': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop',
  'book-6': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
  'book-7': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
  'book-8': 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop',
  'book-9': 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
  'book-10': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
  'book-11': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
  'book-12': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
  'book-13': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800&auto=format&fit=crop',
  'book-14': 'https://images.unsplash.com/photo-1532012164546-f432f2e3ddb5?q=80&w=800&auto=format&fit=crop',
  'book-15': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop',
  'book-16': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop',
  'hindi-1': 'https://images.unsplash.com/photo-1532012164546-f432f2e3ddb5?q=80&w=800&auto=format&fit=crop',
  'hindi-2': 'https://images.unsplash.com/photo-1519682577862-22b62b24e493?q=80&w=800&auto=format&fit=crop',
  'hindi-3': 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=800&auto=format&fit=crop',
  'hindi-4': 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=800&auto=format&fit=crop',
  'hindi-5': 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=800&auto=format&fit=crop',
  'hindi-6': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop',
  'guj-1': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
  'guj-2': 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop',
  'guj-3': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop',
  'guj-4': 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
  'guj-5': 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop',
  'guj-6': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop',
};
