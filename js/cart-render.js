/**
 * Renders cart contents into the mini-drawer (every page) and the full
 * cart page (cart.html). Depends on products.js and cart.js being loaded
 * first.
 */

async function renderCartDrawer() {
  const body = document.querySelector('.cart-drawer-body');
  const foot = document.querySelector('.cart-drawer-foot');
  if (!body) return;

  const cart = getCart();
  if (cart.length === 0) {
    body.innerHTML = '<p class="cart-empty" style="padding:40px 0;">Your cart is empty.</p>';
    if (foot) foot.innerHTML = '<a href="shop.html" class="btn btn-block">Start shopping</a>';
    return;
  }

  const products = await loadProducts();
  let total = 0;
  body.innerHTML = cart.map((line, i) => {
    const p = products.find((x) => x.id === line.id);
    if (!p) return '';
    const lineTotal = p.price * line.qty;
    total += lineTotal;
    return `
      <div class="cart-line">
        <div class="thumb"><img src="${productImagePath(p.images[0])}" alt="${p.name}"></div>
        <div class="meta">
          <h3>${p.name}</h3>
          <div class="variant">${line.color} · ${line.size} · Qty ${line.qty}</div>
          <button class="remove-btn" data-remove="${i}">Remove</button>
        </div>
        <div class="line-total">${formatPrice(lineTotal)}</div>
      </div>`;
  }).join('');

  if (foot) {
    foot.innerHTML = `
      <div class="summary-row total"><span>Subtotal</span><span>${formatPrice(total)}</span></div>
      <p class="form-note" style="margin-bottom:12px;">Shipping and taxes calculated at checkout.</p>
      <a href="cart.html" class="btn btn-block">View cart</a>`;
  }

  body.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeLine(Number(btn.dataset.remove));
      renderCartDrawer();
      if (document.querySelector('#cart-page-body')) renderCartPage();
    });
  });
}

async function renderCartPage() {
  const body = document.querySelector('#cart-page-body');
  const summary = document.querySelector('#cart-summary');
  if (!body) return;

  const cart = getCart();
  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <h2>Your cart is empty</h2>
        <p class="form-note" style="margin-bottom:24px;">Looks like you haven't added anything yet.</p>
        <a href="shop.html" class="btn">Continue shopping</a>
      </div>`;
    if (summary) summary.style.display = 'none';
    return;
  }

  const products = await loadProducts();
  let subtotal = 0;
  body.innerHTML = cart.map((line, i) => {
    const p = products.find((x) => x.id === line.id);
    if (!p) return '';
    const lineTotal = p.price * line.qty;
    subtotal += lineTotal;
    return `
      <div class="cart-line">
        <div class="thumb"><img src="${productImagePath(p.images[0])}" alt="${p.name}"></div>
        <div class="meta">
          <h3><a href="${productUrl(p.id)}">${p.name}</a></h3>
          <div class="variant">${line.color} · Size ${line.size}</div>
          <div class="qty-stepper" style="margin-top:8px;">
            <button data-qty-dec="${i}" aria-label="Decrease quantity">−</button>
            <input type="text" value="${line.qty}" readonly data-qty-value="${i}">
            <button data-qty-inc="${i}" aria-label="Increase quantity">+</button>
          </div>
          <button class="remove-btn" style="margin-top:8px;" data-remove="${i}">Remove</button>
        </div>
        <div class="line-total">${formatPrice(lineTotal)}</div>
      </div>`;
  }).join('');

  const shipping = subtotal > 0 ? (subtotal >= 15000 ? 0 : 350) : 0;
  if (summary) {
    summary.style.display = '';
    summary.innerHTML = `
      <h2 style="margin-top:0;">Order summary</h2>
      <div class="summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${formatPrice(subtotal + shipping)}</span></div>
      <button class="btn btn-block" id="checkout-btn" style="margin-top:16px;">Checkout</button>
      <p class="form-note">Checkout connects to Shopify once configured — see README.md.</p>`;

    document.querySelector('#checkout-btn').addEventListener('click', () => {
      showToast('Connect Shopify to enable checkout — see README.md');
    });
  }

  body.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => { removeLine(Number(btn.dataset.remove)); renderCartPage(); renderCartDrawer(); });
  });
  body.querySelectorAll('[data-qty-inc]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const i = Number(btn.dataset.qtyInc);
      updateLineQty(i, getCart()[i].qty + 1);
      renderCartPage(); renderCartDrawer();
    });
  });
  body.querySelectorAll('[data-qty-dec]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const i = Number(btn.dataset.qtyDec);
      updateLineQty(i, getCart()[i].qty - 1);
      renderCartPage(); renderCartDrawer();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#cart-page-body')) renderCartPage();
});
