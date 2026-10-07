# Dezzlay — clothing store website template

A clean, static clothing-store website template: home, shop (with filtering
and sorting), product detail, cart, about, contact, and a 404 page. No
build step, no framework, no backend — plain HTML/CSS/JS, so it deploys
straight to GitHub Pages and is easy to hand off or connect to Shopify.

## What's included

```
dezzlay-store/
├── index.html          Home page (hero, categories, featured products, newsletter)
├── shop.html           Full catalog with category filters + sorting
├── product.html        Product detail (gallery, size/color, add to cart)
├── cart.html           Cart page (quantities, totals, checkout button)
├── about.html          Brand story page
├── contact.html        Contact form + info
├── 404.html            Not-found page
├── css/style.css       All styling (one file, CSS variables for theming)
├── js/
│   ├── products.js             Loads product data
│   ├── cart.js                 Cart logic (localStorage)
│   ├── cart-render.js          Renders cart drawer + cart page
│   ├── main.js                 Nav, search panel, forms, misc UI
│   ├── shop.js                 Shop grid filtering/sorting
│   ├── product.js              Product detail page logic
│   ├── home.js                 Homepage featured products
│   └── shopify-integration.js  OPTIONAL Shopify Buy Button helper (see below)
├── data/products.json  Sample product catalog (8 demo products)
└── assets/              Logo, favicon, and placeholder imagery (SVG)
```

The brand used throughout is **Dezzlay** — a simple wordmark, a cream/charcoal/
rust-terracotta color palette, and placeholder product photography (SVG
blocks labeled with the product name). Swap the name, colors, and images for
your own in a few minutes — see "Customizing" below.

## Running it locally

No build tools needed. From the project folder, just serve the files
(opening `index.html` directly works for most of it, but a local server
avoids a `fetch()` restriction some browsers apply to local files):

```bash
# Python
python3 -m http.server 8000

# or Node
npx serve .
```

Then open `http://localhost:8000`.

## Deploying on GitHub Pages

1. Create a new GitHub repository and push this folder's contents to it:
   ```bash
   cd dezzlay-store
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
2. On GitHub, go to **Settings → Pages**.
3. Under "Build and deployment", set **Source** to "Deploy from a branch",
   branch `main`, folder `/ (root)`.
4. Save. Your site will be live at `https://<your-username>.github.io/<your-repo>/`
   within a minute or two.
5. (Optional) Add a custom domain under the same Pages settings and point
   your DNS at GitHub's servers — GitHub's docs walk through the exact
   CNAME/A records.

Because every page uses plain relative paths (`css/style.css`,
`assets/...`, `data/products.json`), the site works whether it's served at
the root of a custom domain or under a `/repo-name/` subpath — no config
needed.

## Connecting Shopify

You have two realistic paths, depending on how much of this template you
want to keep.

### Option A — Buy Button embeds (fastest, keeps this template as-is)

Shopify's Buy Button channel lets you drop a real, checkout-capable widget
into any static page.

1. In your Shopify admin: **Settings → Apps and sales channels** → add the
   **Buy Button** channel (or generate a **Storefront API access token**
   under Settings → Apps → Develop apps).
2. Open `js/shopify-integration.js` and fill in your store domain and
   Storefront access token at the top of the file.
3. On any page, include the Buy Button SDK plus this helper:
   ```html
   <script src="https://sdks.shopifycdn.com/buy-button/latest/buybutton.js"></script>
   <script src="js/shopify-integration.js"></script>
   ```
4. Add a container and render a product or collection into it:
   ```html
   <div id="shopify-product-1"></div>
   <script>
     renderShopifyProduct('shopify-product-1', 'YOUR_SHOPIFY_PRODUCT_ID');
   </script>
   ```
   Use `renderShopifyCollection('container-id', 'YOUR_COLLECTION_ID')` the
   same way for a whole collection.

This is the lowest-effort path: Shopify handles inventory, variants, and
checkout; this template handles everything else (browsing, brand pages,
content).

### Option B — Full custom storefront (more work, fully matches this design)

If you want *this* site's product grid, product pages, and cart to be the
real storefront (not an embedded widget), connect directly to Shopify's
**Storefront GraphQL API**:

1. Generate a Storefront API access token (same place as above).
2. In `js/products.js`, replace `loadProducts()` so it queries Shopify's
   Storefront API (`https://your-store.myshopify.com/api/2024-10/graphql.json`)
   instead of `data/products.json`, mapping the response into the same
   shape (`id`, `name`, `price`, `images`, `sizes`, etc.) this template
   already expects — that keeps `shop.js`, `product.js`, and the CSS
   working unchanged.
3. In `js/cart-render.js`, replace the "Checkout" button's handler (search
   for `checkout-btn`) with a call that creates a Shopify checkout
   (`checkoutCreate` mutation) and redirects the customer to the returned
   `webUrl`. That hands off payment, tax, and shipping entirely to Shopify.
4. Shopify's official docs for this: search "Shopify Storefront API
   getting started" and "Storefront API checkout" in their developer docs.

This path takes more setup but means no second UI to keep in sync — your
GitHub-hosted pages stay the source of truth for design and content, and
Shopify stays the source of truth for inventory and payment.

### Which should you pick?

- Want something live today with minimal fuss? **Option A.**
- Want full control over the shopping experience and don't mind a bit more
  integration work? **Option B.**

## Customizing

- **Brand name / logo**: edit `assets/logo.svg` and `assets/favicon.svg`
  (both are plain SVG — easy to edit by hand or swap for your own files),
  and find-and-replace "Dezzlay" across the HTML files.
- **Colors**: all colors are CSS variables at the top of `css/style.css`
  under `:root`. Change `--bg`, `--text`, `--accent`, etc. and the whole
  site updates.
- **Products**: edit `data/products.json`. Each product needs `id`, `name`,
  `category`, `price`, `images` (filenames in `assets/products/`), `sizes`,
  `colors`, `description`, and `details`. Add real photography to
  `assets/products/` and reference the filenames there — the placeholder
  SVGs are just labeled color blocks so the layout can be previewed.
- **Pages/nav**: the header and footer markup is repeated at the top/bottom
  of each HTML file (no templating engine, to keep this dependency-free) —
  update nav links in each file, or introduce a static site generator
  later if you want single-source includes.

## Notes

- The cart is a demo (localStorage-based) so "Add to cart" and the cart
  page work out of the box with no backend. Once Shopify is connected via
  Option B, you'd typically replace it with Shopify's own checkout/cart.
- The newsletter and contact forms are UI-only (they show a confirmation
  toast but don't send anywhere). Wire them to a form service (Formspree,
  Shopify's own contact form, etc.) or your email provider when ready.
- All product photography is placeholder SVG artwork labeled with the
  product name, meant to be swapped for real photos.
