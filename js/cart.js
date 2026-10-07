/**
 * Cart — stored in localStorage so it survives across pages and reloads.
 * Each line item: { id, size, color, qty }
 *
 * This is a front-end-only demo cart for a static template. When you wire
 * up Shopify, your real cart/checkout will typically be handled by the
 * Shopify Buy Button or Storefront API instead (see README.md +
 * js/shopify-integration.js). You can keep this cart for a "wishlist"-style
 * UI, or remove it once Shopify's cart takes over.
 */

const CART_KEY = 'dezzlay_cart_v1';

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function findLineIndex(cart, id, size, color) {
  return cart.findIndex((l) => l.id === id && l.size === size && l.color === color);
}

function addToCart(id, size, color, qty) {
  const cart = getCart();
  const idx = findLineIndex(cart, id, size, color);
  if (idx > -1) {
    cart[idx].qty += qty;
  } else {
    cart.push({ id, size, color, qty });
  }
  saveCart(cart);
  return cart;
}

function updateLineQty(index, qty) {
  const cart = getCart();
  if (!cart[index]) return cart;
  if (qty <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].qty = qty;
  }
  saveCart(cart);
  return cart;
}

function removeLine(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  return cart;
}

function cartCount() {
  return getCart().reduce((sum, l) => sum + l.qty, 0);
}

function updateCartBadge() {
  const badges = document.querySelectorAll('[data-cart-count]');
  const count = cartCount();
  badges.forEach((b) => {
    b.textContent = count;
    b.style.display = count > 0 ? 'flex' : 'none';
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

document.addEventListener('DOMContentLoaded', updateCartBadge);
