// ── FOOD CART ──
function getCart() { return JSON.parse(localStorage.getItem('foodrush_cart') || '[]'); }
function saveCart(cart) { localStorage.setItem('foodrush_cart', JSON.stringify(cart)); updateCartCount(); }

function addToCart(itemId) {
  const item = FOOD_ITEMS.find(i => i.id === itemId);
  if (!item) return;
  let cart = getCart();
  const existing = cart.find(i => i.id === itemId);
  if (existing) existing.qty++;
  else cart.push({ id: item.id, name: item.name, price: item.price, image: item.image, qty: 1 });
  saveCart(cart);
  showToast(`${item.name} added to cart 🛒`, 'success');
  if (typeof renderCartPanel === 'function') renderCartPanel();
}

function removeFromCart(itemId) {
  saveCart(getCart().filter(i => i.id !== itemId));
  if (typeof renderCartPanel === 'function') renderCartPanel();
  if (typeof renderFullCart === 'function') renderFullCart();
  showToast('Item removed', 'warning');
}

function updateQty(itemId, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === itemId);
  if (item) {
    item.qty = Math.max(1, item.qty + delta);
    saveCart(cart);
  }
  if (typeof renderCartPanel === 'function') renderCartPanel();
  if (typeof renderFullCart === 'function') renderFullCart();
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('#cartCount').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'inline' : 'none';
  });
}

function getCartTotals() {
  const cart = getCart();
  const coupon = localStorage.getItem('foodrush_coupon') || '';
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  let discount = 0;
  if (coupon === 'FOOD10') discount = Math.round(subtotal * 0.1);
  else if (coupon === 'FIRST20') discount = Math.round(subtotal * 0.2);
  else if (coupon === 'FLAT50') discount = Math.min(50, subtotal);
  const deliveryFee = subtotal - discount > 299 ? 0 : 29;
  const total = subtotal - discount + deliveryFee;
  return { subtotal, discount, deliveryFee, total, coupon };
}
