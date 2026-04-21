# Ales Place Cipoho WordPress Theme - File Structure Guide

## Complete Theme Directory Structure

```
ales-place-cipoho/                          # Theme root folder
│
├── style.css                               # [REQUIRED] Main stylesheet with theme header info
├── functions.php                           # Theme functions, hooks, custom post types
├── header.php                              # Header template with navbar
├── footer.php                              # Footer template
├── index.php                               # Main/fallback template
│
├── template-home.php                       # Homepage template (Beranda)
├── template-menu.php                       # Menu page template with filtering
├── template-reservasi.php                  # Reservation form template
├── template-kontak.php                     # Contact page template
├── template-page.php                       # Generic page template
├── template-archive.php                    # Blog/archive template
│
├── single-menu_item.php                    # Single menu item detail page
│
├── assets/                                 # Assets folder
│   ├── js/
│   │   └── app.js                         # Main JavaScript (700+ lines)
│   │       ├── Navbar highlighting
│   │       ├── Menu filtering & search
│   │       ├── Form validation
│   │       └── Accessibility features
│   │
│   └── images/
│       ├── ales-mascot2-04-229x300.png    # Logo (PNG, required)
│       └── hero-ramen.jpg                  # Hero background (placeholder)
│
├── inc/                                    # Include files
│   └── fallback-menu.php                  # Fallback menu function
│
├── languages/                              # Translation files (optional)
│   └── ales-place.pot                     # Translation template
│
├── README.md                               # Theme documentation
└── [Other files as needed]
```

## File Descriptions

### Core Files (Required)

| File | Purpose | Size |
|------|---------|------|
| `style.css` | Main stylesheet + theme metadata | 600+ lines, ~15KB |
| `functions.php` | Theme functions, post types, taxonomies | 300+ lines, ~8KB |
| `header.php` | Header/navbar markup | 50+ lines, ~1KB |
| `footer.php` | Footer markup | 80+ lines, ~2KB |
| `index.php` | Main template dispatcher | 40+ lines, ~1KB |

### Page Templates

| File | Usage | Where |
|------|-------|-------|
| `template-home.php` | Homepage (Beranda) | Page → Homepage Template |
| `template-menu.php` | Menu page with filtering | Page → Menu Template |
| `template-reservasi.php` | Reservation form | Page → Reservasi Template |
| `template-kontak.php` | Contact information | Page → Kontak Template |
| `template-page.php` | Generic page fallback | Page → Default Template |
| `template-archive.php` | Blog posts list | Automatic for blog archive |

### Single Item Templates

| File | Post Type | Usage |
|------|-----------|-------|
| `single-menu_item.php` | menu_item | Individual menu item detail page |

### Assets

| File | Purpose | Status |
|------|---------|--------|
| `assets/js/app.js` | Menu filtering, validation, interactivity | ✅ Complete |
| `assets/images/ales-mascot2-04-229x300.png` | Restaurant logo | ⚠️ Need to add |
| `assets/images/hero-ramen.jpg` | Hero banner background | ⚠️ Need to add |

### Includes

| File | Purpose |
|------|---------|
| `inc/fallback-menu.php` | Fallback navigation menu (displays if no menu assigned) |

## What Each Component Does

### style.css (600+ lines)
- CSS variables for design tokens (colors, spacing, shadows)
- Base styles (reset, typography, buttons)
- Component styles:
  - Navbar with logo
  - Hero section
  - Feature cards
  - Menu filtering sidebar
  - Menu grid
  - Reservation form
  - Contact cards
  - Footer
- Responsive breakpoints (1366px, 1280px, 1024px, 768px)

### functions.php (300+ lines)
- Theme setup (title-tag, menus, post thumbnails)
- Script/style enqueueing
- Custom Post Type registration: `menu_item`
  - Supports: title, editor, thumbnail, excerpt
  - Metabox for: price, description, availability
- Custom Taxonomy registration: `menu_category`
- Meta saving/loading functions
- Helper functions:
  - `ales_place_get_menu_by_category()`
  - `ales_place_format_price()`
  - `ales_place_is_menu_available()`

### header.php (50+ lines)
- HTML document head
- `wp_head()` hook
- Navbar with:
  - Logo (PNG image)
  - Logo text ("ALES" + "Place Cipoho")
  - Main navigation menu
  - Fallback menu if no menu assigned

### footer.php (80+ lines)
- 3-column footer grid:
  - About section
  - Quick links
  - Contact info
- Footer bottom with copyright
- `wp_footer()` hook

### index.php (40+ lines)
- Template dispatcher
- Checks page template and loads appropriate template-*.php
- Falls back to generic page display

### template-home.php (100+ lines)
- Hero section with background image
- Feature shortcuts (4-column grid)
- About section
- Call-to-action for reservation

### template-menu.php (200+ lines)
- Sidebar with category filter
- Tab navigation with category count
- Search box
- Menu grid (3 columns)
- Each menu card shows:
  - Featured image
  - Title
  - Price (formatted as Rp)
  - Description
  - Availability status
  - Order button

### template-reservasi.php (150+ lines)
- Reservation form with 6 main fields:
  - Name, Phone, Email, Date, Time, Guests
- Special requests textarea
- Form validation (JS side)
- Business hours display
- Contact cards

### template-kontak.php (150+ lines)
- 3 contact cards (phone, email, address)
- Opening hours table
- Social media links
- CTA section for reservation

### app.js (700+ lines)
- **Navbar Highlighting**: Active link detection
- **Menu Filtering**:
  - Filter by category (sidebar)
  - Filter by tab
  - Search functionality
- **Form Validation**:
  - Required field checking
  - Phone number validation
  - Email validation
  - Date validation (future dates only)
- **Smooth Scroll**: Smooth scrolling for anchor links
- **Accessibility**: ARIA labels, keyboard navigation

## Custom Post Type: Menu Items

**Register Name**: `menu_item`  
**Slug**: `menu`  
**Icon**: 🍽️ (dashicons-food)

### Supports
- Title (required)
- Editor (full content)
- Thumbnail (featured image)
- Excerpt (short description)

### Custom Meta
- `_menu_price` - Item price in Rp
- `_menu_description` - Short description
- `_menu_available` - Availability (1 = available, 0 = out of stock)

### Custom Taxonomy
- **Name**: Menu Category
- **Slug**: `menu-category`
- **Hierarchical**: Yes
- **Associated with**: menu_item

### Admin Interface
- List view showing all menu items
- Edit page with metabox for price, description, availability
- Filtering by category

## Image Assets Required

### Logo
- **File**: `assets/images/ales-mascot2-04-229x300.png`
- **Size**: 229×300px (or proportional)
- **Format**: PNG (transparent background preferred)
- **Usage**: Navbar branding

### Hero Background
- **File**: `assets/images/hero-ramen.jpg`
- **Recommended Size**: 1920×600px
- **Format**: JPG
- **Usage**: Hero section background

### Menu Item Images
- **Suggested Size**: 600×400px
- **Format**: JPG
- **Per Item**: Featured image uploaded in WordPress

## How These Files Work Together

1. **User visits website**
   ↓
2. **WordPress loads header.php**
   - Includes navbar with logo
   - Enqueues style.css and app.js
   ↓
3. **Routes to appropriate template**
   - Page template dispatcher in index.php
   - Loads template-home.php, template-menu.php, etc.
   ↓
4. **Template displays content**
   - Fetches menu items from custom post type
   - Applies CSS styling
   - Initializes JavaScript features
   ↓
5. **footer.php loads**
   - Footer content
   - WordPress hooks

## Development Tips

### Editing CSS
- Edit `style.css` directly
- Use CSS variables for consistent theming:
  ```css
  --color-primary: #8B3A2B;
  --color-accent: #D9A05B;
  ```

### Adding Menu Items
- Go to WordPress Admin → Menu Items
- Create new item
- Set price, description, category
- Upload featured image
- Mark as available/unavailable

### Modifying Templates
- Each template-*.php handles one page type
- Can be edited directly for layout changes
- Respects WordPress hooks and filters

### Adding New Features
- Add PHP code to functions.php (within hooks)
- Add CSS to style.css (respects existing structure)
- Add JS to assets/js/app.js

## Performance Optimizations Included

✅ **CSS**
- Uses CSS Grid for layouts
- Modern CSS features (CSS variables, Grid)
- Minimal file size (~15KB)

✅ **JavaScript**
- Vanilla JS (no jQuery dependency)
- Event delegation for filtering
- Minimal file size (~20KB)

✅ **Images**
- Lazy loading ready (with wp_get_attachment_image)
- Responsive image markup
- Optimized asset paths

✅ **WordPress**
- Proper enqueuing of assets
- Text domain for i18n
- Semantic HTML5

## File Checklist

- [x] style.css (created)
- [x] functions.php (created)
- [x] header.php (created)
- [x] footer.php (created)
- [x] index.php (created)
- [x] template-home.php (created)
- [x] template-menu.php (created)
- [x] template-reservasi.php (created)
- [x] template-kontak.php (created)
- [x] template-page.php (created)
- [x] template-archive.php (created)
- [x] single-menu_item.php (created)
- [x] app.js (created)
- [x] fallback-menu.php (created)
- [x] README.md (created)
- [ ] Logo image (need to copy/upload)
- [ ] Hero image (need to upload)
- [ ] Screenshot.png (optional - for theme preview)

---

**Theme is ready for activation and deployment! 🎉**
