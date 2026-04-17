/* =====================================================
   TelphaVastra — Wishlist Page JavaScript
   script.js
   ===================================================== */

// ── State ────────────────────────────────────────────
let currentFilter = 'all';
let currentSort   = '';

// ── On Page Load ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  refreshStats(); // compute initial totals from DOM data attributes
});

// ── Sticky Nav ───────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 20);
});

// ── Size Pill Selection ──────────────────────────────
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('size-pill') && !e.target.classList.contains('out')) {
    e.target.closest('.card-sizes').querySelectorAll('.size-pill').forEach(s => s.classList.remove('sel'));
    e.target.classList.add('sel');
  }
});

// ─────────────────────────────────────────────────────
// SORT — the single source of truth
// Works with ANY combination of filter + sort.
// Only VISIBLE cards (matching filter) are sorted;
// hidden cards stay in DOM but behind visible ones.
// ─────────────────────────────────────────────────────
function sortCards(val) {
  currentSort = val;
  applyFilterAndSort();
}

// ─────────────────────────────────────────────────────
// FILTER — sets category, then re-applies sort
// ─────────────────────────────────────────────────────
function filterCards(cat, btn) {
  document.querySelectorAll('.fchip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = cat;
  // Reset sort dropdown visually when filter changes (optional UX)
  applyFilterAndSort();
}

// ─────────────────────────────────────────────────────
// CORE: Apply filter visibility + sort order together
// ─────────────────────────────────────────────────────
function applyFilterAndSort() {
  const grid  = document.getElementById('wishGrid');
  const all   = Array.from(grid.querySelectorAll('.wcard'));

  // 1. Separate into visible vs hidden based on current filter
  const visible = all.filter(c => currentFilter === 'all' || c.dataset.cat === currentFilter);
  const hidden  = all.filter(c => currentFilter !== 'all' && c.dataset.cat !== currentFilter);

  // 2. Sort the VISIBLE set
  if (currentSort === 'low') {
    visible.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
  } else if (currentSort === 'high') {
    visible.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
  } else if (currentSort === 'disc') {
    visible.sort((a, b) => parseFloat(b.dataset.disc) - parseFloat(a.dataset.disc));
  }
  // 'recently added' (empty string) → keep original DOM order (no sort)

  // 3. Append visible first (sorted), then hidden (unsorted, display:none)
  visible.forEach((c, i) => {
    c.style.display = '';
    c.style.animation = 'none';
    grid.appendChild(c);
  });
  hidden.forEach(c => {
    c.style.display = 'none';
    grid.appendChild(c);
  });

  // 4. Trigger re-animation on visible cards
  void grid.offsetWidth; // force reflow
  visible.forEach((c, i) => {
    c.style.animation = `cardIn .38s ease ${i * 0.05}s both`;
  });
}

// ─────────────────────────────────────────────────────
// ADD RECOMMENDED ITEM → WISHLIST
// Called when heart icon OR "Add to Wishlist" button
// is clicked on a .sug-card
// ─────────────────────────────────────────────────────
function addSugToWishlist(triggerEl) {
  const sugCard = triggerEl.closest('.sug-card');

  // Prevent double-adding
  if (sugCard.classList.contains('wishlisted')) return;

  // Read data from the hidden .sug-meta div
  const meta  = sugCard.querySelector('.sug-meta');
  const name  = sugCard.querySelector('.sug-name').textContent.trim();
  const price = meta.dataset.price;
  const orig  = meta.dataset.orig;
  const disc  = meta.dataset.disc;
  const cat   = meta.dataset.cat;
  const img   = sugCard.querySelector('.sug-img img').src;

  // Build price display
  const priceFormatted = '₹' + parseInt(price).toLocaleString('en-IN');
  const origFormatted  = parseInt(orig) > parseInt(price)
    ? `<span class="price-was">₹${parseInt(orig).toLocaleString('en-IN')}</span>` : '';
  const discBadge = parseInt(disc) > 0
    ? `<span class="price-off">${disc}% off</span>` : '';
  const saleBadge = parseInt(disc) > 0
    ? `<span class="badge badge-sale">${disc}% OFF</span>` : '';

  // Create the full wcard HTML
  const card = document.createElement('div');
  card.className = 'wcard just-added';
  card.dataset.cat   = cat;
  card.dataset.price = price;
  card.dataset.disc  = disc;
  card.dataset.orig  = orig;
  card.innerHTML = `
    <div class="card-img">
      <img src="${img}" alt="${name}">
      <div class="card-badges">
        <span class="badge badge-new">New</span>
        ${saleBadge}
      </div>
      <div class="card-actions">
        <button class="qa-btn qa-cart" onclick="addToCart(this)"><i class="bi bi-bag-plus"></i> Add to Cart</button>
        <button class="qa-btn qa-try"><i class="bi bi-magic"></i> Try On</button>
      </div>
      <button class="btn-remove" onclick="removeCard(this)"><i class="bi bi-x-lg"></i></button>
    </div>
    <div class="card-body">
      <div class="card-brand">TelphaVastra</div>
      <div class="card-name">${name}</div>
      <div class="card-sub">New Arrival · Just Added</div>
      <div class="card-rating">
        <div class="stars">
          <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
          <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
          <i class="bi bi-star"></i>
        </div>
        <span class="rat-count">New</span>
      </div>
      <div class="card-spacer"></div>
      <div class="card-price">
        <span class="price-now">${priceFormatted}</span>
        ${origFormatted}
        ${discBadge}
      </div>
      <button class="card-cta" onclick="addToCart(this)"><i class="bi bi-bag-plus"></i> Move to Cart</button>
      <div class="card-added"><i class="bi bi-clock"></i> Added just now</div>
    </div>`;

  // Append to grid
  document.getElementById('wishGrid').appendChild(card);

  // Re-apply current filter + sort so new card appears in the right place
  applyFilterAndSort();

  // Update all counters & totals
  refreshStats();

  // Mark sug-card as wishlisted — change heart + button
  sugCard.classList.add('wishlisted');
  const heartBtn = sugCard.querySelector('.sug-wishbtn');
  heartBtn.classList.add('active');
  heartBtn.innerHTML = '<i class="bi bi-heart-fill"></i>';

  const addBtn = sugCard.querySelector('.sug-add');
  addBtn.classList.add('wishlisted');
  addBtn.innerHTML = '<i class="bi bi-heart-fill"></i> Wishlisted';

  // Scroll to the wishlist grid so user sees it was added
  document.getElementById('wishGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });

  showToast(`"${name}" added to Wishlist!`, 'bi-heart-fill');

  // Remove product from "You May Also Like" after adding to wishlist
  sugCard.style.transition = 'all .35s ease';
  sugCard.style.opacity = '0';
  sugCard.style.transform = 'scale(0.9)';

  setTimeout(() => {
    sugCard.remove();
  }, 350);
}

// ─────────────────────────────────────────────────────
// REMOVE CARD from wishlist
// ─────────────────────────────────────────────────────
function removeCard(btn) {
  const card = btn.closest('.wcard');
  card.style.transition = 'all .4s cubic-bezier(.25,.46,.45,.94)';
  card.style.transform  = 'scale(0.85) translateY(-10px)';
  card.style.opacity    = '0';
  setTimeout(() => {
    card.remove();
    refreshStats();
    showToast('Removed from Wishlist', 'bi-heart');
  }, 380);
}

// ─────────────────────────────────────────────────────
// ADD TO CART from wishlist
// ─────────────────────────────────────────────────────
function addToCart(btn) {
  const card    = btn.closest('.wcard');
  const oldHTML = btn.innerHTML;
  btn.innerHTML = '<i class="bi bi-check-lg"></i> Added!';
  btn.style.background = 'linear-gradient(135deg,#10b981,#34d399)';

  // Bump cart badge
  const badge = document.getElementById('cartBadge');
  const count = parseInt(badge.textContent || '0') + 1;
  badge.textContent = count;
  badge.classList.remove('bump');
  void badge.offsetWidth;
  badge.classList.add('bump');

  setTimeout(() => {
    btn.innerHTML = oldHTML;
    btn.style.background = '';
    removeCard(card.querySelector('.btn-remove'));
  }, 1000);

  showToast('Moved to Cart!', 'bi-bag-check-fill');
}

// ─────────────────────────────────────────────────────
// MOVE ALL TO CART
// ─────────────────────────────────────────────────────
function moveAllToCart() {
  const cards = Array.from(document.querySelectorAll('#wishGrid .wcard'));
  if (!cards.length) { showToast('No items in Wishlist', 'bi-info-circle'); return; }

  let i = 0;
  const go = setInterval(() => {
    if (i >= cards.length) { clearInterval(go); return; }
    const c = cards[i];
    c.style.transition = 'all .4s ease';
    c.style.transform  = 'scale(0.85) translateY(-10px)';
    c.style.opacity    = '0';
    setTimeout((idx) => {
      cards[idx].remove();
      refreshStats();
    }, 400, i);
    i++;
  }, 130);

  showToast('All items moved to Cart!', 'bi-bag-check-fill');
}

// ─────────────────────────────────────────────────────
// REFRESH STATS — recalculates item count, total value,
// total savings and updates hero + toolbar in real-time
// ─────────────────────────────────────────────────────
function refreshStats() {
  const cards = Array.from(document.querySelectorAll('#wishGrid .wcard'));
  const n = cards.length;

  let totalNow  = 0; // sum of current (discounted) prices
  let totalOrig = 0; // sum of original prices

  cards.forEach(c => {
    const price = parseFloat(c.dataset.price) || 0;
    const orig  = parseFloat(c.dataset.orig)  || price; // fallback to price if no orig
    totalNow  += price;
    totalOrig += orig;
  });

  const savings = totalOrig - totalNow;

  // Format as Indian rupees with commas
  const fmt = v => '₹' + Math.round(v).toLocaleString('en-IN');

  // Update hero stats with bump animation
  animateStat('heroCount',   n);
  animateStat('heroTotal',   fmt(totalOrig), true);
  animateStat('heroSavings', fmt(savings),   true);

  // Update toolbar item count
  document.getElementById('wCount').innerHTML =
    n + ' Items <span>in your wishlist</span>';

  // Show / hide empty state
  const emptyState = document.getElementById('emptyState');
  if (n === 0) {
    emptyState.classList.add('show');
    document.getElementById('suggestSection').style.opacity = '.5';
  } else {
    emptyState.classList.remove('show');
    document.getElementById('suggestSection').style.opacity = '1';
  }
}

// Animate a stat element with a bump
function animateStat(id, value, isString) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('bump');
  void el.offsetWidth;
  el.textContent = value;
  el.classList.add('bump');
  setTimeout(() => el.classList.remove('bump'), 600);
}

// ─────────────────────────────────────────────────────
// TOAST notification
// ─────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, icon) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  document.getElementById('toastIcon').className  = 'bi ' + icon;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}
