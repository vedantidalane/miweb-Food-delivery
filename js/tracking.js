// ── LIVE ORDER TRACKING MODULE ──

const TRACKING_STEPS = [
  { key: 'placed', label: 'Order Placed', icon: '📋', desc: 'Your order has been received' },
  { key: 'accepted', label: 'Restaurant Accepted', icon: '✅', desc: 'Restaurant is preparing your order' },
  { key: 'preparing', label: 'Preparing Food', icon: '🍳', desc: 'Your food is being cooked fresh' },
  { key: 'delivery', label: 'Out for Delivery', icon: '🚴', desc: 'Rider is on the way to you' },
  { key: 'delivered', label: 'Delivered', icon: '🏠', desc: 'Enjoy your meal!' }
];

const STEP_INTERVAL = 8000; // 8 seconds per step

function getTrackingData(orderId) {
  const all = JSON.parse(localStorage.getItem('foodrush_tracking') || '{}');
  return all[orderId] || null;
}

function saveTrackingData(orderId, data) {
  const all = JSON.parse(localStorage.getItem('foodrush_tracking') || '{}');
  all[orderId] = data;
  localStorage.setItem('foodrush_tracking', JSON.stringify(all));
}

function initTracking(orderId) {
  let data = getTrackingData(orderId);
  if (!data) {
    data = {
      orderId: orderId,
      currentStep: 0,
      startTime: Date.now(),
      stepTimes: [new Date().toISOString()],
      completed: false
    };
    saveTrackingData(orderId, data);
  }
  renderTrackingUI(data);

  if (!data.completed) {
    startTrackingSimulation(orderId, data);
  }
}

function startTrackingSimulation(orderId, data) {
  if (data.currentStep >= TRACKING_STEPS.length - 1) {
    data.completed = true;
    saveTrackingData(orderId, data);
    renderTrackingUI(data);
    launchConfetti();
    return;
  }

  setTimeout(() => {
    data = getTrackingData(orderId);
    if (!data || data.completed) return;
    data.currentStep++;
    data.stepTimes.push(new Date().toISOString());

    if (data.currentStep >= TRACKING_STEPS.length - 1) {
      data.completed = true;
    }
    saveTrackingData(orderId, data);
    renderTrackingUI(data);

    if (data.completed) {
      launchConfetti();
      // Save to order history as delivered
      updateOrderStatus(orderId, 'delivered');
    } else {
      startTrackingSimulation(orderId, data);
    }
  }, STEP_INTERVAL);
}

function updateOrderStatus(orderId, status) {
  const orders = JSON.parse(localStorage.getItem('foodrush_orders') || '[]');
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    localStorage.setItem('foodrush_orders', JSON.stringify(orders));
  }
}

function renderTrackingUI(data) {
  const container = document.getElementById('trackingSteps');
  const progressBar = document.getElementById('deliveryProgressFill');
  const rider = document.getElementById('deliveryRider');
  if (!container) return;

  const progress = (data.currentStep / (TRACKING_STEPS.length - 1)) * 100;

  // Update progress bar
  if (progressBar) progressBar.style.width = progress + '%';

  // Update rider position
  if (rider) rider.style.marginLeft = Math.min(progress, 90) + '%';

  // Render steps
  container.innerHTML = TRACKING_STEPS.map((step, idx) => {
    let stepClass = '';
    let timeStr = '';
    if (idx < data.currentStep) {
      stepClass = 'completed';
      if (data.stepTimes[idx]) {
        timeStr = new Date(data.stepTimes[idx]).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      }
    } else if (idx === data.currentStep) {
      stepClass = data.completed && idx === TRACKING_STEPS.length - 1 ? 'completed' : 'active';
      if (data.stepTimes[idx]) {
        timeStr = new Date(data.stepTimes[idx]).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      }
    }

    return `
      <div class="tracking-step ${stepClass}">
        <div class="step-icon">${stepClass === 'completed' ? '✓' : step.icon}</div>
        <div class="step-info flex-grow-1">
          <h6>${step.label}</h6>
          <p>${step.desc}</p>
        </div>
        ${timeStr ? `<span class="step-time">${timeStr}</span>` : ''}
      </div>`;
  }).join('');

  // Update status text
  const statusEl = document.getElementById('trackingStatus');
  if (statusEl) {
    if (data.completed) {
      statusEl.innerHTML = '<span class="text-success fw-700"><i class="fas fa-check-circle me-2"></i>Order Delivered Successfully!</span>';
    } else {
      statusEl.innerHTML = `<span class="fw-600">${TRACKING_STEPS[data.currentStep].label}</span>`;
    }
  }
}

function launchConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);

  const colors = ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#ff6b81', '#ffd700', '#6c63ff'];
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 2 + 's';
    piece.style.animationDuration = (2 + Math.random() * 2) + 's';
    const size = 6 + Math.random() * 10;
    piece.style.width = size + 'px';
    piece.style.height = size + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), 5000);
}
