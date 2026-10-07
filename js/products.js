/**
 * Product data access.
 *
 * Right now this reads from /data/products.json, which ships with the
 * template so the site works immediately on GitHub Pages with zero setup.
 * All pages live at the root of the repo, so plain relative paths
 * ("data/products.json", "assets/products/...") work whether the site is
 * served at a custom domain or at a github.io/<repo> subpath.
 *
 * When you connect Shopify, you have two options — see README.md:
 *   1) Swap loadProducts() below to pull from the Shopify Storefront API
 *      instead of the local JSON file, or
 *   2) Leave this file as-is for browsing/SEO pages and use the Buy Button
 *      embeds (js/shopify-integration.js) for the actual checkout flow.
 */

let _productsCache = null;

async function loadProducts() {
  if (_productsCache) return _productsCache;
  const res = await fetch('data/products.json');
  if (!res.ok) throw new Error('Could not load product data');
  _productsCache = await res.json();
  return _productsCache;
}

async function getProductById(id) {
  const products = await loadProducts();
  return products.find((p) => p.id === id) || null;
}

function formatPrice(amount) {
  const rounded = Math.round(Number(amount));
  return `Rs. ${rounded.toLocaleString('en-PK')}`;
}

function productImagePath(filename) {
  return `assets/products/${filename}`;
}

function productUrl(id) {
  return `product.html?id=${encodeURIComponent(id)}`;
}
