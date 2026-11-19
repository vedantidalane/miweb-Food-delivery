// ── FOOD CUSTOMIZATION MODULE ──

const CUSTOMIZATION_OPTIONS = {
  sizes: [
    { label: 'Regular', extra: 0 },
    { label: 'Large', extra: 50 }
  ],
  spiceLevels: ['Mild', 'Medium', 'Hot', 'Extra Hot'],
  toppings: [
    { label: 'Extra Cheese', extra: 30 },
    { label: 'Mushrooms', extra: 25 },
    { label: 'Olives', extra: 20 },
    { label: 'Jalapeños', extra: 15 }
  ]
};

let currentCustomItem = null;
let customState = { size: 'Regular', sizeExtra: 0, spice: 'Medium', toppings: [], instructions: '' };

function openCustomizationModal(itemId) {
  const item = FOOD_ITEMS.find(i => i.id === itemId);
  if (!item) return;
  currentCustomItem = item;
  customState = { size: 'Regular', sizeExtra: 0, spice: 'Medium', toppings: [], instructions: '' };

  // Remove existing modal if any
  const existing = document.getElementById('customModal');
  if (existing) existing.remove();

  const basePrice = item.price;
  const modal = document.createElement('div');
  modal.innerHTML = `
  <div class="modal fade custom-modal" id="customModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <div class="d-flex align-items-center gap-3">
            <img src="${item.image}" alt="${item.name}" style="width:60px;height:60px;object-fit:cover;border-radius:12px;"/>
            <div>
              <h5 class="modal-title fw-700 mb-0">${item.name}</h5>
              <div class="text-muted small">${item.desc}</div>
            </div>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <!-- Size Selection -->
          <div class="mb-4">
            <h6 class="fw-700 mb-2"><i class="fas fa-expand-arrows-alt me-2 text-danger"></i>Choose Size</h6>
            <div id="sizeOptions">
              ${CUSTOMIZATION_OPTIONS.sizes.map(s => `
                <span class="size-option ${s.label === 'Regular' ? 'active' : ''}" onclick="selectSize('${s.label}', ${s.extra})" data-size="${s.label}">
                  ${s.label} ${s.extra > 0 ? '<span class="text-muted small">(+₹' + s.extra + ')</span>' : ''}
                </span>
              `).join('')}
            </div>
          </div>

          <!-- Spice Level -->
          <div class="mb-4">
            <h6 class="fw-700 mb-2"><i class="fas fa-pepper-hot me-2 text-danger"></i>Spice Level</h6>
            <div id="spiceOptions">
              ${CUSTOMIZATION_OPTIONS.spiceLevels.map(s => `
                <span class="spice-option ${s === 'Medium' ? 'active' : ''}" onclick="selectSpice('${s}')" data-spice="${s}">
                  ${s === 'Mild' ? '🌶️' : s === 'Medium' ? '🌶️🌶️' : s === 'Hot' ? '🌶️🌶️🌶️' : '🌶️🌶️🌶️🌶️'} ${s}
                </span>
              `).join('')}
            </div>
          </div>

          <!-- Extra Toppings -->
          <div class="mb-4">
            <h6 class="fw-700 mb-2"><i class="fas fa-layer-group me-2 text-danger"></i>Extra Toppings</h6>
            <div id="toppingOptions">
              ${CUSTOMIZATION_OPTIONS.toppings.map((t, i) => `
                <div class="topping-check" onclick="toggleTopping(${i}, this)" data-idx="${i}">
                  <input type="checkbox" class="form-check-input" style="pointer-events:none;" id="top${i}"/>
                  <label class="flex-grow-1 mb-0" style="cursor:pointer;pointer-events:none;">${t.label}</label>
                  <span class="text-muted small">+₹${t.extra}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Special Instructions -->
          <div class="mb-3">
            <h6 class="fw-700 mb-2"><i class="fas fa-edit me-2 text-danger"></i>Special Instructions</h6>
            <textarea class="form-control" id="specialInstructions" rows="2" placeholder="E.g. Less oil, no onions, extra sauce..." oninput="customState.instructions=this.value"></textarea>
          </div>
        </div>
        <div class="modal-footer d-flex justify-content-between align-items-center">
          <div>
            <div class="text-muted small">Total Price</div>
            <div class="custom-price-display" id="customTotalPrice">₹${basePrice}</div>
          </div>
          <button class="btn btn-danger rounded-pill px-4 fw-700" onclick="addCustomizedToCart()">
            <i class="fas fa-cart-plus me-2"></i>Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>`;
  document.body.appendChild(modal.firstElementChild);
  const bsModal = new bootstrap.Modal(document.getElementById('customModal'));
  bsModal.show();
  updateCustomPrice();
}

function selectSize(label, extra) {
  customState.size = label;
  customState.sizeExtra = extra;
  document.querySelectorAll('.size-option').forEach(el => {
    el.classList.toggle('active', el.dataset.size === label);
  });
  updateCustomPrice();
}

function selectSpice(level) {
  customState.spice = level;
  document.querySelectorAll('.spice-option').forEach(el => {
    el.classList.toggle('active', el.dataset.spice === level);
  });
}

function toggleTopping(idx, el) {
  const cb = el.querySelector('input[type="checkbox"]');
  const topping = CUSTOMIZATION_OPTIONS.toppings[idx];
  const tIdx = customState.toppings.findIndex(t => t.label === topping.label);
  if (tIdx > -1) {
    customState.toppings.splice(tIdx, 1);
    cb.checked = false;
    el.classList.remove('checked');
  } else {
    customState.toppings.push({ label: topping.label, extra: topping.extra });
    cb.checked = true;
    el.classList.add('checked');
  }
  updateCustomPrice();
}

function updateCustomPrice() {
  if (!currentCustomItem) return;
  const base = currentCustomItem.price;
  const toppingsExtra = customState.toppings.reduce((s, t) => s + t.extra, 0);
  const total = base + customState.sizeExtra + toppingsExtra;
  const el = document.getElementById('customTotalPrice');
  if (el) el.textContent = '₹' + total;
}

function getCustomizedPrice() {
  if (!currentCustomItem) return 0;
  const base = currentCustomItem.price;
  const toppingsExtra = customState.toppings.reduce((s, t) => s + t.extra, 0);
  return base + customState.sizeExtra + toppingsExtra;
}

function addCustomizedToCart() {
  if (!currentCustomItem) return;
  const item = currentCustomItem;
  const finalPrice = getCustomizedPrice();
  const customization = {
    size: customState.size,
    spice: customState.spice,
    toppings: customState.toppings.map(t => t.label),
    instructions: customState.instructions,
    extras: finalPrice - item.price
  };

  let cart = getCart();
  // Create a unique key for customized items
  const customKey = `${item.id}_${customState.size}_${customState.toppings.map(t => t.label).sort().join(',')}`;
  const existing = cart.find(i => i.customKey === customKey);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id: item.id,
      customKey: customKey,
      name: item.name,
      price: finalPrice,
      basePrice: item.price,
      image: item.image,
      qty: 1,
      customization: customization,
      restaurantId: item.rid
    });
  }
  saveCart(cart);
  showToast(`${item.name} (${customState.size}) added to cart 🛒`, 'success');

  // Close modal
  const modalEl = document.getElementById('customModal');
  if (modalEl) {
    const bsModal = bootstrap.Modal.getInstance(modalEl);
    if (bsModal) bsModal.hide();
  }

  if (typeof renderCartPanel === 'function') renderCartPanel();
  if (typeof renderFullCart === 'function') renderFullCart();
}

function getCustomizationSummary(item) {
  if (!item.customization) return '';
  const c = item.customization;
  const parts = [];
  if (c.size && c.size !== 'Regular') parts.push(c.size);
  if (c.spice) parts.push(c.spice + ' spice');
  if (c.toppings && c.toppings.length) parts.push(c.toppings.join(', '));
  if (c.instructions) parts.push('"' + c.instructions + '"');
  return parts.length ? parts.join(' · ') : '';
}
