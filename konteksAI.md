You are GitHub Copilot assisting in building a responsive, accessible restaurant website named "Ale’s Place Cipoho".
Goal: replicate the look & feel of the provided reference mock (hero banner ramen, warm beige paper texture, red/brown accents, rounded boxes, icon-based shortcuts, menu grid cards, and a reservation form), but optimized for laptop screens (≥1366×768) while remaining responsive down to 1024px without breaking.

Domain & Scope (STRICT):
- Public pages: Beranda (hero + shortcuts), Menu (filter/tabs + cards), Reservasi (form sederhana), Kontak.
- Admin area NOT included in this UI build (will be handled separately).
- NO online payment, NO delivery tracking, NO third-party integrations (no maps SDK, no analytics). 
- All assets local-only (images, SVG icons, textures).

Information Architecture:
- Top navbar: logo (top-left), menu items: Beranda, Menu, Reservasi, Kontak + CTA "Reservasi Meja".
- Hero section: full-width banner with ramen background image, headline and subheading, and "Lihat Menu" button.
- Feature shortcuts (4 cards): "Tentang Kami", "Lihat Menu", "Reservasi Meja", "Hubungi Kami" each with icon, title, short description.
- Menu section: left vertical filter (list categories), top horizontal tabs, search box, and menu grid (3 cards per row at ≥1366px).
- Menu card: image, title, price (IDR), short description, and "Pesan Sekarang" (just a button with no payment).
- Reservation section: simple form with Name, Phone, Date, Time, People, Notes, Submit ("Kirim Reservasi").
- Footer: address, phone(s), WhatsApp icon, email.

Design Tokens (CSS Variables):
- Colors: 
  --color-bg: #FAF3E8;         /* warm paper */
  --color-surface: #FFF9F1;    /* light card */
  --color-primary: #8B3A2B;    /* ramen brown-red */
  --color-primary-600: #B44A39;
  --color-accent: #D9A05B;     /* gold accent */
  --color-text: #3B2B22;
  --color-muted: #8C7A6E;
- Shadow: soft layered shadows for cards (focus-safe).
- Radius: 12px cards, 999px pills for buttons.
- Typography: display serif for headings (e.g., "Marcellus" or "Noto Serif"), clean sans for body (e.g., "Inter"/"Noto Sans").
- Spacing scale: 4/8/12/16/24/32/48.
- Container widths: 
  --container: 1200px max; gutters 24px.
- Breakpoints: 
  --bp-laptop: 1366px, --bp-desktop: 1440px, --bp-tablet: 1024px (layout must still look fine at 1024px).

Layout Requirements (Laptop-first):
- Navbar sticky, subtle blur over hero when scrolled.
- Hero banner height ~420–480px on laptop; text left-aligned; CTA visible above the fold.
- Feature shortcuts: 4 columns (≥1366px), 2 columns at 1024–1280px.
- Menu grid: 3 columns @ ≥1366px, 2 columns @ 1024–1280px; card heights equalized.
- Left filter sidebar: fixed width ~220px; becomes collapsible at ≤1280px.
- Reservation form: two columns on laptop, one column on tablet.
- Footer: 3 columns (contact, hours, address); stack at ≤1024px.

Accessibility & UX:
- WCAG AA: contrast ≥ 4.5:1 for text on backgrounds.
- Semantic HTML: <header>, <nav>, <main>, <section>, <article>, <footer>, <form>, <fieldset>, <legend>.
- Keyboard focus styles clearly visible (outline + shadow).
- Labels associated with inputs; use aria-live for form success message.
- Images: alt text concise; decorative flourishes via CSS/background only.

Components to Generate:
- Navbar (logo SVG placeholder, menu links, CTA button).
- Hero (background image overlay, heading, subheading, CTA).
- FeatureShortcutCard (4 items with icon placeholders).
- MenuFilter (left), MenuTabs (top), MenuCard (image/title/price/button).
- ReservationForm (fields with validation hints).
- Footer (contact blocks with icons).
- Utility classes for buttons, pills, badges, shadows, container.

Interactions (no external libs):
- Search box filters menu cards by title/description (client-side).
- Category filter (sidebar) and tabs (top) update visible items (no reload).
- Reservation form: on submit, simulate “success” (no payment); print summary to console and show aria-live “Reservasi terkirim”.
- Navbar active link highlighting.

File Structure (plain HTML/CSS/JS):
- /assets/images/* (local)
- /assets/icons/*  (SVG)
- /styles/app.css
- /scripts/app.js
- /index.html (home), /menu.html, /reservasi.html, /kontak.html
- favicon + webmanifest (optional, local-only)

Coding Style:
- Vanilla HTML/CSS/JS only (no frameworks). 
- Use CSS variables and BEM-ish class names: .card, .card--feature, .btn, .btn--primary, .grid, .tabs, .sidebar, .input, .field.
- Prefer CSS Grid/Flex; avoid heavy JS for layout.

Acceptance Criteria (Laptop ≥1366px):
- Above-the-fold shows hero headline + CTA fully visible.
- Feature shortcuts aligned 4-column, equal height.
- Menu grid shows exactly 3 cards per row (gap ≥24px).
- Reservation form rendered two-column with aligned labels.
- Lighthouse (local) passes accessibility ≥90 (manual check).
- No horizontal scrollbar at 1366×768.

Do not generate any payment, delivery, third-party plugin, or external fonts/scripts. Use system fonts or local font files if needed. Keep code commented with section markers so it’s easy to navigate.