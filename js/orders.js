// ── ORDERS MODULE ──

function getOrders() {
  return JSON.parse(localStorage.getItem('foodrush_orders') || '[]');
}

function saveOrders(orders) {
  localStorage.setItem('foodrush_orders', JSON.stringify(orders));
}

function createOrder(cart, totals, address, payment) {
  const orders = getOrders();
  const order = {
    id: 'FR' + Date.now().toString().slice(-8),
    items: cart.map(i => ({
      id: i.id,
      name: i.name,
      price: i.price,
      image: i.image,
      qty: i.qty,
      customization: i.customization || null
    })),
    subtotal: totals.subtotal,
    discount: totals.discount,
    deliveryFee: totals.deliveryFee,
    total: totals.total,
    address: address,
    payment: payment,
    status: 'in-progress',
    date: new Date().toISOString(),
    rating: 0
  };
  orders.unshift(order);
  saveOrders(orders);
  return order;
}

function reorderItems(orderId) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) { showToast('Order not found', 'danger'); return; }

  let cart = getCart();
  order.items.forEach(item => {
    const foodItem = FOOD_ITEMS.find(f => f.id === item.id);
    if (foodItem) {
      const existing = cart.find(c => c.id === item.id && !c.customKey);
      if (existing) {
        existing.qty += item.qty;
      } else {
        cart.push({
          id: item.id,
          name: item.name,
          price: item.customization ? item.price : foodItem.price,
          image: foodItem.image,
          qty: item.qty,
          customization: item.customization || null,
          restaurantId: foodItem.rid
        });
      }
    }
  });
  saveCart(cart);
  showToast('Items added to cart! 🛒', 'success');
  updateCartCount();
}

function rateOrder(orderId, rating) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.rating = rating;
    saveOrders(orders);
    showToast(`Rated ${rating} stars ⭐`, 'success');
  }
}

function getOrderStatusClass(status) {
  switch (status) {
    case 'delivered': return 'delivered';
    case 'cancelled': return 'cancelled';
    default: return 'in-progress';
  }
}

function getOrderStatusLabel(status) {
  switch (status) {
    case 'delivered': return 'Delivered';
    case 'cancelled': return 'Cancelled';
    case 'in-progress': return 'In Progress';
    default: return status;
  }
}

function renderOrderCard(order) {
  const dateStr = new Date(order.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const itemImages = order.items.slice(0, 4).map(i => `<img src="${i.image}" alt="${i.name}" class="order-item-thumb"/>`).join('');
  const itemNames = order.items.map(i => `${i.name} ×${i.qty}`).join(', ');

  // Rating stars
  let ratingHtml = '<div class="order-rating mt-2">';
  for (let i = 1; i <= 5; i++) {
    ratingHtml += `<i class="fas fa-star ${i <= order.rating ? 'rated' : ''}" onclick="handleRateOrder('${order.id}', ${i})"></i>`;
  }
  ratingHtml += '</div>';

  return `
    <div class="order-card fade-in">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <span class="fw-700">#${order.id}</span>
          <span class="order-status ${getOrderStatusClass(order.status)} ms-2">${getOrderStatusLabel(order.status)}</span>
        </div>
        <span class="text-muted small">${dateStr}</span>
      </div>
      <div class="order-items-preview">${itemImages}</div>
      <div class="small text-muted mb-2">${itemNames}</div>
      <div class="d-flex justify-content-between align-items-center">
        <div class="fw-700 text-danger">₹${order.total}</div>
        <div class="d-flex gap-2">
          ${order.status === 'in-progress' ? `<a href="order-tracking.html?oid=${order.id}" class="btn btn-sm btn-outline-danger rounded-pill"><i class="fas fa-map-marker-alt me-1"></i>Track</a>` : ''}
          <button class="reorder-btn" onclick="reorderItems('${order.id}')"><i class="fas fa-redo me-1"></i>Reorder</button>
        </div>
      </div>
      ${order.status === 'delivered' ? ratingHtml : ''}
    </div>`;
}

function handleRateOrder(orderId, rating) {
  rateOrder(orderId, rating);
  if (typeof renderOrdersList === 'function') renderOrdersList();
}

// Seed demo orders if none exist
function seedDemoOrders() {
  const orders = getOrders();
  if (orders.length > 0) return;

  const demoOrders = [
    {
      id: 'FR94821537',
      items: [
        { id: 5, name: 'Pepperoni Feast', price: 399, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop', qty: 1 },
        { id: 15, name: 'McFlurry Oreo', price: 99, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop', qty: 2 }
      ],
      subtotal: 597, discount: 0, deliveryFee: 0, total: 597,
      address: { name: 'Demo User', phone: '9876543210', addr: '123, MG Road', city: 'Mumbai', pin: '400001' },
      payment: 'upi', status: 'delivered', date: '2024-11-10T14:30:00Z', rating: 4
    },
    {
      id: 'FR73625148',
      items: [
        { id: 8, name: 'Hyderabadi Chicken Biryani', price: 299, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=300&h=200&fit=crop', qty: 2 },
        { id: 13, name: 'Gulab Jamun', price: 79, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop', qty: 1 }
      ],
      subtotal: 677, discount: 67, deliveryFee: 0, total: 610,
      address: { name: 'Demo User', phone: '9876543210', addr: '456, Park Street', city: 'Delhi', pin: '110001' },
      payment: 'card', status: 'delivered', date: '2024-11-05T19:15:00Z', rating: 5
    }
  ];
  saveOrders(demoOrders);
}

seedDemoOrders();
