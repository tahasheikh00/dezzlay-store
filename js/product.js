/**
 * Product detail page: gallery, size/color selection, quantity, add to cart,
 * plus a small "you may also like" strip.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const root = document.querySelector('#product-root');
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const product = id ? await getProductById(id) : null;

  if (!product) {
    root.innerHTML = `
      <div class="not-found">
        <p class="code">404</p>
        <h2>We couldn't find that product</h2>
        <p class="form-note" style="margin-bottom:24px;">It may have sold out or the link is incorrect.</p>
        <a href="shop.html" class="btn">Back to shop</a>
      </div>`;
    return;
  }

  document.title = `${product.name} — Dezzlay`;

  let activeImage = 0;
  let activeSize = product.sizes[0];
  let activeColor = product.colors[0];
  let qty = 1;

  const SWATCH_COLORS = {
    'Clay': '#B5703E', 'Charcoal': '#3A3833', 'Olive': '#6B6A4A', 'Stone': '#B9AF9C',
    'Black': '#1C1A17', 'Khaki': '#AD9E7E', 'Ivory': '#F3EEE4', 'Faded Black': '#444038',
    'Sand': '#CBB893', 'White': '#FFFFFF', 'Terracotta': '#A6562D', 'Navy': '#2C3447',
    'Natural': '#DCCFB8'
  };

  root.innerHTML = `
    <div class="product-detail">
      <div class="gallery">
        <div class="gallery-main"><img id="main-image" src="${productImagePath(product.images[0])}" alt="${product.name}"></div>
        <div class="gallery-thumbs">
          ${product.images.map((img, i) => `
            <button data-thumb="${i}" class="${i === 0 ? 'active' : ''}">
              <img src="${productImagePath(img)}" alt="View ${i + 1}">
            </button>`).join('')}
        </div>
      </div>
      <div class="product-info">
        <div class="breadcrumb"><a href="index.html">Home</a> / <a href="shop.html">Shop</a> / <span>${product.name}</span></div>
        <h1>${product.name}</h1>
        <div class="price-row">
          <span>${formatPrice(product.price)}</span>
          ${product.compareAt ? `<span class="compare">${formatPrice(product.compareAt)}</span>` : ''}
        </div>
        <p>${product.description}</p>

        <div class="option-group">
          <div class="label-row"><strong>Color</strong><span class="selected" id="color-label">${activeColor}</span></div>
          <div class="swatch-row" id="color-row">
            ${product.colors.map((c) => `
              <button class="color-dot ${c === activeColor ? 'active' : ''}" data-color="${c}" title="${c}">
                <i style="--c:${SWATCH_COLORS[c] || '#ccc'}"></i>
              </button>`).join('')}
          </div>
        </div>

        <div class="option-group">
          <div class="label-row"><strong>Size</strong><span class="selected" id="size-label">Selected: ${activeSize}</span></div>
          <div class="swatch-row" id="size-row">
            ${product.sizes.map((s) => `
              <button class="size-btn ${s === activeSize ? 'active' : ''}" data-size="${s}">${s}</button>`).join('')}
          </div>
        </div>

        <div class="qty-row">
          <strong>Qty</strong>
          <div class="qty-stepper">
            <button id="qty-dec" aria-label="Decrease quantity">−</button>
            <input id="qty-input" type="text" value="1" readonly>
            <button id="qty-inc" aria-label="Increase quantity">+</button>
          </div>
        </div>

        <div class="add-to-cart-row">
          <button class="btn btn-block" id="add-to-cart-btn">Add to cart — ${formatPrice(product.price)}</button>
        </div>
        <p class="form-note">Free shipping on orders over Rs. 15,000. Easy 30-day returns.</p>

        <div style="margin-top:32px;">
          <details class="accordion-item" open>
            <summary>Details</summary>
            <ul>${product.details.map((d) => `<li>${d}</li>`).join('')}</ul>
          </details>
          <details class="accordion-item">
            <summary>Shipping &amp; returns</summary>
            <p>Orders ship within 2 business days. Free standard shipping on orders over Rs. 15,000. Returns accepted within 30 days in original condition.</p>
          </details>
          <details class="accordion-item">
            <summary>Size &amp; fit</summary>
            <p>Model is 5'11" wearing size M. This style runs true to size — if between sizes, we recommend sizing down.</p>
          </details>
        </div>
      </div>
    </div>
  `;

  function setMainImage(i) {
    activeImage = i;
    document.querySelector('#main-image').src = productImagePath(product.images[i]);
    root.querySelectorAll('[data-thumb]').forEach((b) => b.classList.toggle('active', Number(b.dataset.thumb) === i));
  }

  root.querySelectorAll('[data-thumb]').forEach((btn) => {
    btn.addEventListener('click', () => setMainImage(Number(btn.dataset.thumb)));
  });

  root.querySelectorAll('[data-color]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeColor = btn.dataset.color;
      document.querySelector('#color-label').textContent = activeColor;
      root.querySelectorAll('[data-color]').forEach((b) => b.classList.toggle('active', b === btn));
    });
  });

  root.querySelectorAll('[data-size]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeSize = btn.dataset.size;
      document.querySelector('#size-label').textContent = `Selected: ${activeSize}`;
      root.querySelectorAll('[data-size]').forEach((b) => b.classList.toggle('active', b === btn));
    });
  });

  const qtyInput = document.querySelector('#qty-input');
  document.querySelector('#qty-inc').addEventListener('click', () => {
    qty += 1;
    qtyInput.value = qty;
  });
  document.querySelector('#qty-dec').addEventListener('click', () => {
    qty = Math.max(1, qty - 1);
    qtyInput.value = qty;
  });

  document.querySelector('#add-to-cart-btn').addEventListener('click', () => {
    addToCart(product.id, activeSize, activeColor, qty);
    showToast(`Added ${product.name} to cart`);
  });

  // You may also like
  const related = document.querySelector('#related-grid');
  if (related) {
    const all = await loadProducts();
    const others = all.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
    related.innerHTML = others.map((p) => `
      <a class="product-card" href="${productUrl(p.id)}">
        <div class="thumb"><img src="${productImagePath(p.images[0])}" alt="${p.name}"></div>
        <div class="info">
          <h3>${p.name}</h3>
          <div class="price"><span>${formatPrice(p.price)}</span></div>
        </div>
      </a>`).join('');
  }
});
