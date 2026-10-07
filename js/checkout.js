/**
 * Checkout page: renders an order summary from the cart, validates the
 * delivery form, then shows an "order placed" confirmation.
 *
 * No backend/payment is wired up — this is a Cash on Delivery style flow
 * meant for a small store taking orders manually. On submit, the order
 * details are optionally sent to WhatsApp (see WHATSAPP_NUMBER below);
 * either way, the cart is cleared and a confirmation screen is shown.
 *
 * TO ENABLE WHATSAPP NOTIFICATIONS:
 * Fill in your business WhatsApp number below, digits only, with country
 * code and no "+" or spaces (e.g. "923001234567" for a Pakistani number).
 * Leave it blank to skip WhatsApp entirely — the confirmation screen and
 * cart-clearing still work fine without it; you'd just need another way
 * to see new orders (e.g. switch to the Formspree/email option later).
 */
const WHATSAPP_NUMBER = '';

document.addEventListener('DOMContentLoaded', async () => {
  const root = document.querySelector('#checkout-root');
  const summaryBox = document.querySelector('#checkout-summary');
  const form = document.querySelector('#checkout-form');
  if (!root || !form) return;

  const cart = getCart();
  if (cart.length === 0) {
    root.innerHTML = `
      <div class="cart-empty">
        <h2>Your cart is empty</h2>
        <p class="form-note" style="margin-bottom:24px;">Add something to your cart before checking out.</p>
        <a href="shop.html" class="btn">Continue shopping</a>
      </div>`;
    return;
  }

  const products = await loadProducts();
  const lines = cart.map((line) => {
    const p = products.find((x) => x.id === line.id);
    return p ? { ...line, product: p, lineTotal: p.price * line.qty } : null;
  }).filter(Boolean);

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const shipping = subtotal >= 15000 ? 0 : 350;
  const total = subtotal + shipping;

  function renderSummary() {
    summaryBox.innerHTML = `
      <h2 style="margin-top:0;">Order summary</h2>
      ${lines.map((l) => `
        <div class="summary-row">
          <span>${l.product.name} (${l.color}, ${l.size}) × ${l.qty}</span>
          <span>${formatPrice(l.lineTotal)}</span>
        </div>`).join('')}
      <div class="summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
      <p class="form-note">Cash on Delivery</p>
    `;
  }
  renderSummary();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const order = {
      name: document.querySelector('#full-name').value.trim(),
      phone: document.querySelector('#phone').value.trim(),
      email: document.querySelector('#email').value.trim(),
      address: document.querySelector('#address').value.trim(),
      city: document.querySelector('#city').value.trim(),
      postal: document.querySelector('#postal').value.trim(),
      notes: document.querySelector('#notes').value.trim(),
    };

    const orderId = 'DZ-' + Date.now().toString().slice(-8);

    if (WHATSAPP_NUMBER) {
      const itemLines = lines.map((l) =>
        `• ${l.product.name} (${l.color}, ${l.size}) × ${l.qty} — ${formatPrice(l.lineTotal)}`
      ).join('\n');

      const message = [
        `New order ${orderId}`,
        '',
        itemLines,
        '',
        `Subtotal: ${formatPrice(subtotal)}`,
        `Shipping: ${shipping === 0 ? 'Free' : formatPrice(shipping)}`,
        `Total: ${formatPrice(total)}`,
        '',
        `Name: ${order.name}`,
        `Phone: ${order.phone}`,
        order.email ? `Email: ${order.email}` : null,
        `Address: ${order.address}, ${order.city}${order.postal ? ', ' + order.postal : ''}`,
        order.notes ? `Notes: ${order.notes}` : null,
      ].filter(Boolean).join('\n');

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
    }

    // Clear the cart and show the confirmation screen either way.
    saveCart([]);

    root.innerHTML = `
      <div class="cart-empty">
        <h2>Order placed</h2>
        <p style="color:var(--muted); max-width:440px; margin:0 auto 8px;">
          Thank you, ${order.name.split(' ')[0] || 'there'} — your order <strong>${orderId}</strong> has been received.
          Our team will contact you shortly to confirm the details and arrange delivery.
        </p>
        <p class="form-note" style="margin-bottom:24px;">A confirmation call or message will come to ${order.phone}.</p>
        <a href="shop.html" class="btn">Continue shopping</a>
      </div>`;
  });
});
