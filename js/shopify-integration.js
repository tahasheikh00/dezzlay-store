/**
 * OPTIONAL — Shopify Buy Button integration stub.
 *
 * This file is NOT loaded by any page by default. It's here so connecting
 * Shopify is a copy/paste job instead of a research project. Full
 * walkthrough in README.md under "Connecting Shopify".
 *
 * ---------------------------------------------------------------------
 * HOW THIS WORKS
 * ---------------------------------------------------------------------
 * Shopify's "Buy Button" channel lets you embed a real, checkout-capable
 * product or collection widget into any static HTML page — no backend
 * required. You get a storefront access token from Shopify, point it at
 * your store domain, and tell it which <div> to render into.
 *
 * STEPS:
 * 1. In Shopify admin: Settings → Apps and sales channels → Buy Button
 *    (or Online Store → Storefront API access) → create a Storefront
 *    access token.
 * 2. Fill in SHOPIFY_CONFIG below with your domain + token.
 * 3. Add a <div id="shopify-product-{productId}"></div> wherever you want
 *    a product embedded (e.g. in product.html, or replace the whole
 *    custom product-detail block with this).
 * 4. Include this script + the Buy Button SDK on that page:
 *      <script src="https://sdks.shopifycdn.com/buy-button/latest/buybutton.js"></script>
 *      <script src="js/shopify-integration.js"></script>
 * 5. Call renderShopifyProduct('shopify-product-123', 'YOUR_SHOPIFY_PRODUCT_ID')
 *    after the SDK loads.
 *
 * For a full custom storefront (recommended if you want this site's own
 * cart/checkout UI talking directly to Shopify instead of embedded
 * widgets), use the Storefront GraphQL API instead — see the README for
 * links. That path replaces products.js's loadProducts() with a fetch
 * against Shopify instead of data/products.json, and replaces the
 * Checkout button in js/cart-render.js with a call that creates a
 * Shopify checkout and redirects the customer there.
 * ---------------------------------------------------------------------
 */

const SHOPIFY_CONFIG = {
  domain: 'your-store.myshopify.com',
  storefrontAccessToken: 'YOUR_STOREFRONT_ACCESS_TOKEN',
};

function renderShopifyProduct(containerId, shopifyProductId) {
  if (typeof ShopifyBuy === 'undefined') {
    console.error('Shopify Buy Button SDK not loaded. Include buybutton.js before this file.');
    return;
  }

  const client = ShopifyBuy.buildClient({
    domain: SHOPIFY_CONFIG.domain,
    storefrontAccessToken: SHOPIFY_CONFIG.storefrontAccessToken,
  });

  ShopifyBuy.UI.onReady(client).then((ui) => {
    ui.createComponent('product', {
      id: shopifyProductId,
      node: document.getElementById(containerId),
      moneyFormat: '%24%7B%7Bamount%7D%7D',
      options: {
        product: {
          styles: {
            button: {
              'background-color': '#1C1A17',
              ':hover': { 'background-color': '#000' },
              'border-radius': '2px',
            },
          },
          buttonDestination: 'checkout',
        },
      },
    });
  });
}

function renderShopifyCollection(containerId, shopifyCollectionId) {
  if (typeof ShopifyBuy === 'undefined') {
    console.error('Shopify Buy Button SDK not loaded. Include buybutton.js before this file.');
    return;
  }

  const client = ShopifyBuy.buildClient({
    domain: SHOPIFY_CONFIG.domain,
    storefrontAccessToken: SHOPIFY_CONFIG.storefrontAccessToken,
  });

  ShopifyBuy.UI.onReady(client).then((ui) => {
    ui.createComponent('collection', {
      id: shopifyCollectionId,
      node: document.getElementById(containerId),
      options: {
        product: {
          styles: { button: { 'background-color': '#1C1A17', 'border-radius': '2px' } },
        },
      },
    });
  });
}
