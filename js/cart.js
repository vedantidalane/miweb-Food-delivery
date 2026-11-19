// ── FOOD CART (Enhanced with Dynamic Delivery Charges) ──
function getCart() { return JSON.parse(localStorage.getItem('foodrush_cart') || '[]'); }
function saveCart(cart) { localStorage.setItem('foodrush_cart', JSON.stringify(cart)); updateCartCount(); }

function addToCart(itemId) {
  // If customization module is loaded, use it
  if (typeof openCustomizationModal === 'function') {
    openCustomizationModal(itemId);
    return;
  }
  const item = FOOD_ITEMS.find(i => i.id === itemId);
  if (!item) return;
  let cart = getCart();
  const existing = cart.find(i => i.id === itemId && !i.customKey);
  if (existing) existing.qty++;
  else cart.push({ id: item.id, name: item.name, price: item.price, image: item.image, qty: 1, restaurantId: item.rid });
  saveCart(cart);
  showToast(`${item.name} added to cart 🛒`, 'success');
  if (typeof renderCartPanel === 'function') renderCartPanel();
}

function removeFromCart(itemId, customKey) {
  let cart = getCart();
  if (customKey) {
    cart = cart.filter(i => i.customKey !== customKey);
  } else {
    cart = cart.filter(i => i.id !== itemId || i.customKey);
  }
  saveCart(cart);
  if (typeof renderCartPanel === 'function') renderCartPanel();
  if (typeof renderFullCart === 'function') renderFullCart();
  showToast('Item removed', 'warning');
}

function updateQty(itemId, delta, customKey) {
  let cart = getCart();
  let item;
  if (customKey) {
    item = cart.find(i => i.customKey === customKey);
  } else {
    item = cart.find(i => i.id === itemId && !i.customKey);
  }
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

// ── Dynamic Delivery Charge Calculator ──
function isPeakHour() {
  const hour = new Date().getHours();
  return (hour >= 12 && hour < 14) || (hour >= 19 && hour < 22);
}

function getRestaurantDistance(restaurantId) {
  // Simulated distances in km per restaurant
  const distances = { 1: 2.5, 2: 4.0, 3: 6.5, 4: 8.0, 5: 1.5, 6: 5.0, 7: 3.0, 8: 7.5 };
  return distances[restaurantId] || 5.0;
}

function getBaseDeliveryFee(restaurantId) {
  const restaurant = (typeof RESTAURANTS !== 'undefined') ? RESTAURANTS.find(r => r.id === restaurantId) : null;
  return restaurant ? restaurant.deliveryFee : 25;
}

function calculateDeliveryCharges(cart, subtotal) {
  const breakdown = {
    baseFee: 0,
    distanceCharge: 0,
    surgeCharge: 0,
    smallOrderFee: 0,
    freeDelivery: false,
    totalFee: 0,
    peakHours: isPeakHour()
  };

  if (!cart.length) return breakdown;

  // Get unique restaurant IDs from cart
  const restaurantIds = [...new Set(cart.map(i => i.restaurantId || i.rid || 1))];

  // Base delivery fee (highest among restaurants in cart)
  breakdown.baseFee = Math.max(...restaurantIds.map(rid => getBaseDeliveryFee(rid)));

  // Distance-based charges (use furthest restaurant)
  const maxDistance = Math.max(...restaurantIds.map(rid => getRestaurantDistance(rid)));
  breakdown.distance = maxDistance;
  if (maxDistance <= 3) breakdown.distanceCharge = 0;
  else if (maxDistance <= 7) breakdown.distanceCharge = 20;
  else breakdown.distanceCharge = 40;

  // Small order fee
  if (subtotal < 149) {
    breakdown.smallOrderFee = 25;
  }

  // Calculate pre-surge total
  let preSurgeTotal = breakdown.baseFee + breakdown.distanceCharge;

  // Surge pricing during peak hours (1.5x)
  if (breakdown.peakHours) {
    breakdown.surgeCharge = Math.round(preSurgeTotal * 0.5);
  }

  // Free delivery for orders above ₹499
  if (subtotal >= 499) {
    breakdown.freeDelivery = true;
    breakdown.totalFee = breakdown.smallOrderFee; // Only small order fee if applicable
  } else {
    breakdown.totalFee = preSurgeTotal + breakdown.surgeCharge + breakdown.smallOrderFee;
  }

  return breakdown;
}

function getCartTotals() {
  const cart = getCart();
  const coupon = localStorage.getItem('foodrush_coupon') || '';
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  let discount = 0;
  if (coupon === 'FOOD10') discount = Math.round(subtotal * 0.1);
  else if (coupon === 'FIRST20') discount = Math.round(subtotal * 0.2);
  else if (coupon === 'FLAT50') discount = Math.min(50, subtotal);

  const charges = calculateDeliveryCharges(cart, subtotal - discount);
  const deliveryFee = charges.totalFee;
  const total = subtotal - discount + deliveryFee;
  return { subtotal, discount, deliveryFee, total, coupon, deliveryBreakdown: charges };
}

// ── Delivery Time Estimation ──
function estimateDeliveryTime(cart) {
  if (!cart || !cart.length) return null;

  const restaurantIds = [...new Set(cart.map(i => i.restaurantId || i.rid || 1))];
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  // Base prep time: 10-15 min
  let prepTimeMin = 10;
  let prepTimeMax = 15;

  // Add time per item beyond 3
  if (totalItems > 3) {
    const extraItems = totalItems - 3;
    prepTimeMin += Math.ceil(extraItems * 2);
    prepTimeMax += Math.ceil(extraItems * 3);
  }

  // Distance-based delivery time
  const maxDistance = Math.max(...restaurantIds.map(rid => getRestaurantDistance(rid)));
  const transitMin = Math.round(maxDistance * 2.5);
  const transitMax = Math.round(maxDistance * 4);

  let totalMin = prepTimeMin + transitMin;
  let totalMax = prepTimeMax + transitMax;

  // Peak hours add 5-10 min
  if (isPeakHour()) {
    totalMin += 5;
    totalMax += 10;
  }

  return { min: totalMin, max: totalMax, distance: maxDistance, peakHours: isPeakHour(), items: totalItems };
}

function renderDeliveryEstimate(cart) {
  const est = estimateDeliveryTime(cart);
  if (!est) return '';
  return `
    <div class="delivery-estimate-badge mt-2 mb-2">
      <i class="fas fa-clock"></i>
      Estimated delivery: ${est.min}-${est.max} min
      ${est.peakHours ? '<span class="small-order-badge ms-2">Peak Hours</span>' : ''}
    </div>`;
}

function renderDeliveryFeeBreakdown(breakdown) {
  if (!breakdown) return '';
  return `
    <div class="fee-breakdown">
      <div class="small fw-700 mb-2"><i class="fas fa-receipt me-1"></i>Delivery Fee Breakdown</div>
      <div class="fee-row"><span>Base Delivery Fee</span><span>${breakdown.freeDelivery ? '<del>₹'+breakdown.baseFee+'</del>' : '₹'+breakdown.baseFee}</span></div>
      <div class="fee-row"><span>Distance Charge (${breakdown.distance?.toFixed(1) || 0} km)</span><span>${breakdown.freeDelivery ? '<del>₹'+breakdown.distanceCharge+'</del>' : '₹'+breakdown.distanceCharge}</span></div>
      ${breakdown.surgeCharge > 0 ? `<div class="fee-row surge"><span>Peak Hour Surge (1.5×)</span><span>${breakdown.freeDelivery ? '<del>₹'+breakdown.surgeCharge+'</del>' : '₹'+breakdown.surgeCharge}</span></div>` : ''}
      ${breakdown.smallOrderFee > 0 ? `<div class="fee-row"><span>Small Order Fee</span><span>₹${breakdown.smallOrderFee}</span></div>` : ''}
      ${breakdown.freeDelivery ? '<div class="fee-row free"><span>🎉 Free Delivery (Order ≥ ₹499)</span><span>-₹'+(breakdown.baseFee + breakdown.distanceCharge + breakdown.surgeCharge)+'</span></div>' : ''}
      <div class="fee-row fw-700" style="border-top:1px solid var(--border-color);padding-top:8px;color:var(--text-primary);"><span>Total Delivery Fee</span><span>${breakdown.totalFee === 0 ? '<span class="text-success">FREE</span>' : '₹'+breakdown.totalFee}</span></div>
    </div>`;
}
