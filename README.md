# StyleHub — Fashion & Apparel E-Commerce

A polished, frontend-only e-commerce website for a fashion & apparel brand, built with **HTML5**, **CSS3** and **Vanilla JavaScript** — no backend, no database, no frameworks or libraries.

---

## Project Overview

StyleHub is a multi-page-feel shopping experience delivered in a single HTML file. It includes a complete product discovery flow (search, filters, sorting), dynamic product detail views, a variant-aware shopping bag, a simulated checkout with order confirmation, and a user account area with order history — all powered by client-side JavaScript arrays and `localStorage`.

The design follows a clean luxury-fashion aesthetic with a dark navy / pink / gold palette, serif display headings and a fully responsive layout from desktop to mobile.

## Features

- **Product discovery** — live search (name, brand, category), filters for category, size, color, brand and price range, plus sorting (price, rating, name) with a dynamic result count and empty state
- **Featured products & collections** — dynamically rendered product cards for Featured, Men's, Women's and Kids' sections
- **Product detail** — image, description, star ratings, color/size selectors, quantity stepper, size-guide modal and related products, opened via `#product-ID` hash routing
- **Shopping bag** — variant-aware cart (same product + size + color merges quantity), quantity stepper, item removal, coupons (`STYLE10`, `WELCOME500`, `FASHION15`), free shipping over ₹999 and a live cart badge
- **Checkout** — validated shipping form (email, 10-digit phone, 6-digit PIN), payment-method selection and an order-confirmation state with generated order IDs
- **Account** — simulated registration and login with inline validation, password visibility toggles, profile, order history, wishlist management, saved addresses and size preferences
- **Extras** — wishlist hearts across all grids, toast notifications, sticky header with mobile hamburger menu, announcement bar, About and Contact sections with a store locator

## Product Categories

| Category | Products |
| --- | --- |
| **Women** | Satin dress, oversized blouse, wide-leg trousers |
| **Men** | Oxford shirt, slim-fit trousers, denim jacket |
| **Kids** | Casual hoodie set, summer dress |

## Technologies Used

- **HTML5** — semantic, accessible markup (ARIA labels, roles, keyboard-friendly controls)
- **CSS3** — custom properties, Flexbox and Grid, responsive media queries, `prefers-reduced-motion` support
- **Vanilla JavaScript (ES6+)** — DOM rendering, event delegation, `Intl.NumberFormat` for ₹ formatting, template-driven product cards
- **localStorage** — client-side persistence (no backend or database)

## Project Structure

```text
StyleHub/
├── index.html        # All sections (hero, shop, cart, checkout, account, ...)
├── css/
│   └── style.css     # Design tokens, layout and component styles
├── js/
│   └── script.js     # Product data, rendering, cart, auth, persistence
├── assets/
│   ├── images/       # Product & banner images
│   └── icons/        # UI icons and favicon
└── README.md
```

## How to Run Locally

1. Download or clone the project folder.
2. Open `index.html` directly in a browser, or serve the folder with any static server (e.g. the VS Code **Live Server** extension).

No build step, dependencies or API keys are required.

## Data Storage

All application state is persisted client-side in the browser's `localStorage` under `stylehub_`-prefixed keys (`stylehub_cart`, `stylehub_wishlist`, `stylehub_orders`, `stylehub_users`, `stylehub_currentUser`). State is loaded once on page start and saved automatically after every change.

**No passwords are ever stored** — user records are saved without credentials, and the seeded demo account lives in memory only. All data is demo data; clearing site data resets the store.

## Responsive Design

- **Desktop** — full navigation, multi-column product grids (4 columns) and side-by-side detail/cart/checkout layouts
- **Tablet** — compact navigation, 3-column grids and stacked page layouts
- **Mobile** — hamburger menu, single/two-column grids, full-width controls and touch-friendly tap targets with no horizontal overflow

## Future Improvements

- Real authentication with password hashing and a backend API
- Full cart and order-management pages
- Product reviews, image galleries and stock handling
- Checkout payment integration and order tracking

## Learning Outcomes

- Building a complete e-commerce flow with pure Vanilla JavaScript — no frameworks
- Rendering UI from a single source-of-truth data array with reusable render functions
- Managing application state (cart, wishlist, auth, filters) and persisting it safely with `localStorage`
- Practicing accessible, semantic HTML and responsive, token-driven CSS at a production standard

## Internship Task

Task ID: WD-EC-002 — StyleHub - Fashion & Apparel

Task Link: https://www.freeinternships.in/web-development-internship/free-online-web-development-internship-fashion-apparel-wd-ec-002.php

Submission Portal: https://www.freeinternships.in/blog/