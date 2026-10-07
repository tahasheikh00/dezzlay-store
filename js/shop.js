/**
 * Shop grid: category filtering, sorting, and search (from ?q=).
 */

document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.querySelector('#product-grid');
  if (!grid) return;

  const products = await loadProducts();
  const params = new URLSearchParams(window.location.search);
  let activeCategory = params.get('category') || 'all';
  const searchTerm = (params.get('q') || '').toLowerCase().trim();

  const filterBtns = document.querySelectorAll('.filter-btn');
  const sortSelect = document.querySelector('#sort-select');
  const resultCount = document.querySelector('#result-count');
  const searchNotice = document.querySelector('#search-notice');

  if (searchTerm && searchNotice) {
    searchNotice.textContent = `Search results for "${searchTerm}"`;
    searchNotice.style.display = 'block';
  }

  filterBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.category === activeCategory);
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.category;
      filterBtns.forEach((b) => b.classList.toggle('active', b === btn));
      render();
      const url = new URL(window.location);
      if (activeCategory === 'all') url.searchParams.delete('category');
      else url.searchParams.set('category', activeCategory);
      window.history.replaceState({}, '', url);
    });
  });

  sortSelect && sortSelect.addEventListener('change', render);

  function getFiltered() {
    let list = products.slice();
    if (activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (searchTerm) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }
    const sortVal = sortSelect ? sortSelect.value : 'featured';
    if (sortVal === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sortVal === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sortVal === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name));
    else list.sort((a, b) => (b.featured === true) - (a.featured === true));
    return list;
  }

  const SWATCH_COLORS = {
    'Clay': '#B5703E', 'Charcoal': '#3A3833', 'Olive': '#6B6A4A', 'Stone': '#B9AF9C',
    'Black': '#1C1A17', 'Khaki': '#AD9E7E', 'Ivory': '#F3EEE4', 'Faded Black': '#444038',
    'Sand': '#CBB893', 'White': '#FFFFFF', 'Terracotta': '#A6562D', 'Navy': '#2C3447',
    'Natural': '#DCCFB8'
  };

  function render() {
    const list = getFiltered();
    resultCount && (resultCount.textContent = `${list.length} item${list.length === 1 ? '' : 's'}`);

    if (list.length === 0) {
      grid.innerHTML = '<div class="empty-state"><p>No products match these filters.</p></div>';
      return;
    }

    grid.innerHTML = list.map((p) => `
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
          <div class="swatches">
            ${p.colors.map((c) => `<span style="background:${SWATCH_COLORS[c] || '#ccc'}" title="${c}"></span>`).join('')}
          </div>
        </div>
      </a>
    `).join('');
  }

  render();
});
