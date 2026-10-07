/**
 * Homepage: renders the "Just In" featured product strip.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.querySelector('#featured-grid');
  if (!grid) return;

  const products = await loadProducts();
  const featured = products.filter((p) => p.featured).slice(0, 4);

  grid.innerHTML = featured.map((p) => `
    <a class="product-card" href="${productUrl(p.id)}">
      <div class="thumb">
        <img src="${productImagePath(p.images[0])}" alt="${p.name}">
        ${p.images[1] ? `<img class="alt" src="${productImagePath(p.images[1])}" alt="">` : ''}
        ${p.compareAt ? '<span class="badge">Sale</span>' : ''}
      </div>
      <div class="info">
        <h3>${p.name}</h3>
        <div class="price">
          <span>${formatPrice(p.price)}</span>
          ${p.compareAt ? `<span class="compare">${formatPrice(p.compareAt)}</span>` : ''}
        </div>
      </div>
    </a>
  `).join('');
});
