# Srestaurents — Premium Restaurant Website Demo

> **Presentation Prototype** for **Srestaurents**, an artisanal multi-cuisine restaurant operating in India, celebrating Awadhi Dum Pukht, clay oven charcoal grills, rich slow-simmered curries, and contemporary Pan-Asian curations.

Designed with a warm, distinctive, editorial human aesthetic — featuring bespoke typography, generous intentional whitespace, rich culinary photography, and zero dependencies.

---

## 1. Project Overview

This is a complete, presentation-ready website prototype designed to demonstrate both the guest-facing digital dining experience and the back-of-house restaurant team operational dashboard before commissioning production backend development.

The entire demo runs locally in any modern web browser using standard **HTML5**, **CSS3**, and **Vanilla JavaScript (ES6+)** with **localStorage** persistence. It requires no backend, no build tools, no Node.js packages, and no external API keys.

---

## 2. Key Features

### Guest & Customer Experience
- **Editorial Homepage (`index.html`)**: Refined header wordmark, evocative culinary hero section, service pillars (Courtyard Dine-in, Curbside Takeaway, Insulated Gourmet Delivery), signature dish highlights, brand story split, seasonal promotional offers, and table reservation callout.
- **Interactive Menu (`menu.html`)**: Category filter navigation, instant real-time search, dietary filter pills (Pure Veg, Non-Veg, Chef's Signatures), dynamic sort selector, and rich dish cards with authentic FSSAI-style green/red dietary markers.
- **Dish Customization Modal & Standalone Page (`dish.html`)**: Deep-dive into culinary provenance, tasting notes, allergen warnings, portion size/variant selection, optional accompaniments & add-ons, special cooking instructions, and live reactive total price recalculation.
- **Order Basket & Bill Calculator (`order.html`)**: Itemized cart review, quantity steppers, dietary tags, demo promo coupon engine (`WELCOME10`, `FEAST20`, `SREST50`), packaging fee, delivery fee calculation (complimentary for orders above ₹850), and transparent 5% restaurant GST breakdown.
- **Simulated Checkout (`checkout.html`)**: Delivery destination form vs curbside takeaway pickup selector, simulated payment options (Simulated UPI with mock QR code & 1-click authorization, Cash on Delivery, and mock Card test interface), client-side validation, unique order ID generation (`SR-2026-XXXX`), and confirmation modal.
- **Live Order Tracking (`track-order.html`)**: Visual stage progress timeline (Order Placed → Kitchen Confirmed → Simmering in Kitchen → Out for Delivery / Ready → Completed), delivery partner mock card, itemized bill snapshot, and an interactive **Demo Presenter Simulation Toolbar** to step through statuses live.
- **Table Reservations (`reservations.html`)**: Interactive booking calendar (constrained to today through +30 days), lunch & dinner service time slots, party size selector with Private Dining Room recommendations, seating area selection (Heritage Courtyard, Intimate Dining Hall, Chef's Verandah, Royal PDR), capacity conflict checking, and voucher receipt generation.
- **Brand Story & Philosophy (`about.html`)**: Sourcing ethics (A2 Bilona ghee, stone-ground Tellicherry pepper, single-origin mountain spices, wood smoke), chef leadership profiles, and visual atmosphere gallery.
- **Contact & Coordinates (`contact.html`)**: Physical address placeholder in Jubilee Hills, Hyderabad, real-time "Open Now / Closed" badge computed from local time, stylized vector map, and interactive inquiry form.
- **Customer Account Portal (`account.html`)**: Multi-persona demonstration switcher (switch between Aarav Sharma & Priya Patel), order history with 1-click "Reorder to Basket", table reservation history with cancellation, saved delivery addresses, and favourite dishes wishlist.

### Operational Admin Suite (`admin/`)
- **Executive Overview Dashboard (`admin/index.html`)**: Live calculated business metrics (Total Sample Sales, Total Orders, Active Kitchen Preparations, Upcoming Table Bookings) derived dynamically from the local demo dataset, plus best-selling dishes frequency and recent order/booking quick tables.
- **Menu Catalog Management (`admin/menu.html`)**: Full CRUD capabilities — add new sample dishes, edit prices, descriptions, and categories, toggle immediate availability (In Stock vs Sold Out), and delete dishes. Changes persist immediately to the public customer menu.
- **Live Orders Kitchen Console (`admin/orders.html`)**: Filter dockets by status (Placed, Preparing, Out for Delivery, Completed, Cancelled), review customer instructions and item breakdowns, advance order statuses, and link directly to customer tracking views.
- **Table Floor Management (`admin/reservations.html`)**: Review bookings by date and status, confirm walk-ins or online requests, allocate table numbers, and mark guests seated.
- **Restaurant Configuration & Safety (`admin/settings.html`)**: Configurable restaurant identity, address, contact, delivery fee rules, free delivery thresholds, packaging fee, and GST rate. Includes a safe **"Reset Demo Data"** action that restores clean sample seeds without touching unrelated browser storage.

---

## 3. Folder & File Structure

```
srestaurents/
├── index.html                 # Brand homepage
├── menu.html                  # Interactive menu repertoire
├── dish.html                  # Standalone dish details & customization
├── order.html                 # Order basket & bill calculation
├── checkout.html              # Delivery & mock payment checkout
├── track-order.html           # Live visual order tracking timeline
├── reservations.html          # Table booking & capacity management
├── about.html                 # Brand philosophy, sourcing & chefs
├── contact.html               # Contact details, live hours & map
├── account.html               # Demo customer account portal
├── admin/                     # Demonstration Admin Suite
│   ├── index.html             # Operational metrics overview
│   ├── menu.html              # Menu catalog CRUD & stock toggles
│   ├── orders.html            # Live orders kitchen console
│   ├── reservations.html      # Table bookings floor management
│   └── settings.html          # Restaurant settings & demo reset
├── assets/
│   └── images/                # 20 curated high-resolution local culinary photos
├── css/
│   ├── styles.css             # Design tokens, typography, hero, layouts
│   ├── components.css         # Buttons, badges, dietary dots, dish cards, modals, toasts
│   ├── responsive.css         # Media queries (360px–1440px), mobile drawer & bottom bar
│   └── admin.css              # Operational admin sidebar, stat cards, tables
├── js/
│   ├── config.js              # Central demo configuration & pricing rules
│   ├── data.js                # Initial seed dishes, orders, reservations, personas
│   ├── storage.js             # LocalStorage service with srestaurents_ namespace
│   ├── common.js              # Shared UI utilities, cart badge counter, toasts, modals
│   ├── menu.js                # Menu category tabs, search, dietary filter, dish modal
│   ├── cart.js                # Cart state, variants, add-ons, pricing formulas
│   ├── checkout.js            # Validation, order snapshot generation, modal receipt
│   ├── reservations.js        # Table booking, capacity conflict check, voucher
│   ├── tracking.js            # Visual timeline renderer & simulation buttons
│   └── admin.js               # Admin metrics calculator, menu CRUD, order/booking dispatch
└── README.md                  # Comprehensive project documentation
```

---

## 4. How to Open and Run the Website

### Option A: VS Code Live Server (Recommended)
1. Open the project folder in **Visual Studio Code**.
2. If you have the **Live Server** extension installed (`ritwickdey.liveserver`), right-click `index.html` and choose **"Open with Live Server"**.
3. Live Server will serve the website at `http://127.0.0.1:5500/` (or port 5501).

### Option B: Local Static Server (Node.js / Python / PHP)
You can serve the directory using any static web server:
- **Python 3**:
  ```bash
  python -m http.server 8000
  ```
  Then open `http://localhost:8000/` in your browser.
- **PHP**:
  ```bash
  php -S localhost:8000
  ```
- **Node.js (`npx serve`)**:
  ```bash
  npx serve .
  ```

### Option C: Direct File Opening
Double-click `index.html` to open directly in any modern browser (Chrome, Edge, Firefox, Safari). All assets and links use relative paths.

---

## 5. Demo Navigation & Presenter Instructions

### Recommended Client Presentation Walkthrough:
1. **Start on `index.html`**:
   - Showcase the editorial brand aesthetic, warm ivory and forest green color palette, natural typography, and absence of generic AI tropes.
   - Point out the 3 service pillars: Courtyard Dine-In, Curbside Takeaway, Insulated Gourmet Delivery.
2. **Navigate to `menu.html`**:
   - Demonstrate category switching (Starters, Royal Biryani, Curries, Pan-Asian).
   - Test instant search (e.g., type *"saffron"* or *"makhani"*).
   - Filter by **"Pure Veg"** or **"Chef Signatures"**.
   - Click **"Customize & Add +"** on a dish: select a variant (e.g., Family Handi), choose an add-on, adjust quantity, and add to basket.
   - Observe the live toast notification and the cart badge count updating in the header.
3. **Open `order.html`**:
   - Review the calculated bill breakdown.
   - Enter promo code `FEAST20` or `WELCOME10` to showcase instant discount validation.
   - Toggle between **Delivery** and **Takeaway** to see the delivery fee recalculate live.
4. **Proceed to `checkout.html`**:
   - Show prefilled customer and delivery information from the demo guest persona.
   - Select **Simulated UPI** and click *"Simulate Instant UPI Authorization"*.
   - Confirm the order to trigger the confirmation receipt with order ID `#SR-2026-XXXX`.
5. **Open `track-order.html`**:
   - View the active 5-stage visual progress timeline.
   - Use the **Demo Presenter Tool** banner buttons to click through *Placed → Confirmed → Preparing → Out for Delivery → Completed*.
6. **Visit `reservations.html`**:
   - Choose a date and time slot (observe slot remaining capacities).
   - Pick a seating environment (e.g., Heritage Courtyard) and confirm booking.
7. **Switch to the Admin Suite (`admin/index.html`)**:
   - Show how the total sales and order count immediately reflect the new mock order you just placed!
   - Navigate to `admin/menu.html` and toggle a dish to *"Sold Out"*. Return to `menu.html` to show that the dish is instantly marked Sold Out on the public site.
   - Navigate to `admin/orders.html` to demonstrate updating order statuses directly from the kitchen view.
8. **Resetting Demo Data**:
   - Click **"↺ Reset Demo Data"** in the top demo banner or Admin Suite. A confirmation dialog will restore the clean initial seed data.

---

## 6. How LocalStorage Persistence Works

All application data is isolated under the `srestaurents_` prefix:
- `srestaurents_settings`: Restaurant metadata, address, contact, tax rates, delivery fee rules.
- `srestaurents_menu`: Full dish repertoire with variants, add-ons, availability, and prices.
- `srestaurents_orders`: Order dockets with frozen price snapshots, customer details, and timelines.
- `srestaurents_reservations`: Table bookings with party sizes, dates, slots, and table allocations.
- `srestaurents_cart`: Live basket items, selected variants, add-ons, and applied promo code.
- `srestaurents_user`: Active demo customer persona profile.
- `srestaurents_favorites`: Array of saved dish IDs.

### Resetting Data:
The `StorageService.resetToDefaults()` function removes **only** keys beginning with `srestaurents_` and immediately re-populates them from `SEED_DATA`. It will never modify or erase unrelated browser storage.

---

## 7. Replacing Sample Content & Images

### Updating Text & Address:
Open `js/config.js` or edit directly through `admin/settings.html`. You can customize:
- Restaurant Name
- Physical Address & Phone Number
- Operating Hours & Closed Days
- Delivery Fee and GST percentage

### Adding New Dishes:
You can add new dishes either via the Admin Suite (`admin/menu.html` → *"+ Add New Dish"*) or by editing `SEED_DATA.dishes` in `js/data.js`.

### Replacing Images:
All 20 food photography assets reside in `assets/images/`. To replace any photo with your own photography, simply overwrite the matching file (e.g., `biryani_awadhi.jpg`) with a standard JPEG or PNG image of similar aspect ratio.

---

## 8. Frontend Demo Limitations & Transition to Production (Laravel + MySQL)

### Working Demo Features (Zero Backend Required):
- Instant client-side menu search, category filtering, and sorting.
- Dynamic cart calculations with variants, add-ons, packaging, delivery tiers, and promo codes.
- Local order placement with unique docket references and price snapshots.
- Real-time simulation of order status progression.
- Local table booking with conflict prevention and capacity tracking.
- Client-side guest persona switching.
- Operational admin dashboard with computed metrics and menu catalog editing.

### Production Features Requiring a Real Backend:
When migrating this prototype to a production **Laravel + MySQL** application:
1. **Authentication & Authorization**: Replace mock persona switching with Laravel Breeze / Fortify sessions, password hashing (`bcrypt`), and role-based permissions (`spatie/laravel-permission`) separating customers from kitchen managers and super-admins.
2. **Database & Migrations**: Migrate `SEED_DATA` into MySQL schema (`categories`, `dishes`, `variants`, `add_ons`, `orders`, `order_items`, `reservations`, `restaurant_settings`).
3. **Transactional Integrity**: Use database transactions (`DB::transaction`) to ensure stock subtraction, promo usage counters, and slot capacity locking remain race-condition free.
4. **Real Payment Gateways**: Integrate verified Indian payment providers (Razorpay, Cashfree, or Paytm PG) with server-side webhook signature verification.
5. **Real-Time Delivery & Notifications**: Replace client simulation buttons with WebSockets (Laravel Reverb or Pusher) and SMS / WhatsApp notifications (Twilio or Gupshup API) for order milestones.
6. **CDN & Image Optimization**: Store production photography on Amazon S3 or Cloudflare R2 with automatic WebP conversion and responsive `srcset`.

---

## 9. License & Credits

- Designed for presentation demonstration purposes for **Srestaurents**.
- Photography sourced with royalty-free licensing from Unsplash.
- Typography: *Cormorant Garamond* (Christian Schwartz) & *Plus Jakarta Sans* (Tokotype) via Google Fonts.
