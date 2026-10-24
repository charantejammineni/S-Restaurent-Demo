/**
 * Srestaurents — Live Order Tracking Controller
 * Interactive order tracking with visual progress timeline, demo status simulation controls,
 * and comprehensive docket details.
 */

const TrackingController = {
  currentOrder: null,

  init() {
    this.resolveOrder();
    this.bindEvents();
  },

  resolveOrder() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdParam = urlParams.get('id');

    const orders = StorageService.getOrders();

    if (orderIdParam) {
      this.currentOrder = orders.find(o => o.id.toUpperCase() === orderIdParam.toUpperCase());
    }

    // Fallback to most recent order if no query or invalid query
    if (!this.currentOrder && orders.length > 0) {
      this.currentOrder = orders[0];
    }

    this.renderTracker();
  },

  bindEvents() {
    // Search Order by ID
    const searchForm = document.getElementById('tracking-search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('tracking-search-input');
        const q = input ? input.value.trim().toUpperCase() : '';
        if (q) {
          window.location.href = `track-order.html?id=${q}`;
        }
      });
    }
  },

  renderTracker() {
    const container = document.getElementById('tracker-container');
    if (!container) return;

    if (!this.currentOrder) {
      container.innerHTML = `
        <div class="empty-state-card text-center p-5">
          <div class="empty-state-icon">🔍</div>
          <h2 class="font-serif">No Demo Order Found</h2>
          <p class="text-muted">No demo order matches this reference ID. You can select one from the demo list below or place a new mock order from our menu.</p>
          <div class="mt-4 flex-center gap-3">
            <a href="menu.html" class="btn btn-primary">Browse Menu & Place Order</a>
          </div>
        </div>
      `;
      return;
    }

    const order = this.currentOrder;
    const isTakeaway = order.customer?.deliveryType === 'takeaway';
    
    // Status definitions
    const stages = [
      { key: 'placed', label: 'Order Placed', desc: 'Received in kitchen' },
      { key: 'confirmed', label: 'Confirmed', desc: 'Chef docket assigned' },
      { key: 'preparing', label: 'In the Kitchen', desc: 'Charcoal & degh simmering' },
      { key: 'out-for-delivery', label: isTakeaway ? 'Ready for Pickup' : 'Out for Delivery', desc: isTakeaway ? 'Waiting at valet counter' : 'Dispatched with thermal seal' },
      { key: 'completed', label: isTakeaway ? 'Picked Up' : 'Delivered', desc: isTakeaway ? 'Handed to guest' : 'Delivered safely' }
    ];

    const stageKeys = stages.map(s => s.key);
    const currentStageIndex = stageKeys.indexOf(order.status);

    const isCancelled = order.status === 'cancelled';

    container.innerHTML = `
      <!-- Simulation Controller Banner -->
      <div class="tracking-simulation-toolbar card mb-4 p-3">
        <div class="flex-between align-center flex-wrap gap-2">
          <div class="sim-label">
            <span class="badge badge-warning">Demo Presenter Tool</span>
            <span class="text-xs text-muted ml-2">Simulate real-time status transitions for this presentation:</span>
          </div>

          <div class="sim-actions flex-wrap gap-2">
            <button class="btn btn-sm btn-outline" id="sim-btn-placed" ${order.status === 'placed' ? 'disabled' : ''}>1. Placed</button>
            <button class="btn btn-sm btn-outline" id="sim-btn-confirmed" ${order.status === 'confirmed' ? 'disabled' : ''}>2. Confirmed</button>
            <button class="btn btn-sm btn-outline" id="sim-btn-preparing" ${order.status === 'preparing' ? 'disabled' : ''}>3. Preparing</button>
            <button class="btn btn-sm btn-outline" id="sim-btn-out" ${order.status === 'out-for-delivery' ? 'disabled' : ''}>4. ${isTakeaway ? 'Ready' : 'Out'}</button>
            <button class="btn btn-sm btn-success" id="sim-btn-completed" ${order.status === 'completed' ? 'disabled' : ''}>5. Complete ✓</button>
          </div>
        </div>
      </div>

      <div class="tracking-main-card card p-4 mb-4">
        <div class="tracking-header flex-between align-center flex-wrap gap-3 pb-3 border-bottom mb-4">
          <div>
            <span class="text-xs text-muted font-mono uppercase">Order Docket</span>
            <h2 class="font-serif text-2xl tracking-id">#${order.id}</h2>
            <div class="text-xs text-muted">Placed on ${new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
          </div>

          <div class="tracking-badges text-right">
            <span class="badge ${isCancelled ? 'badge-danger' : order.status === 'completed' ? 'badge-success' : 'badge-primary'}">
              ${isCancelled ? 'Cancelled' : stages.find(s => s.key === order.status)?.label || order.status}
            </span>
            <div class="text-xs text-muted mt-1 font-mono">${order.payment.status}</div>
          </div>
        </div>

        ${isCancelled ? `
          <div class="alert alert-danger mb-4">
            <strong>Order Cancelled (Demo):</strong> This demo order has been flagged as cancelled.
          </div>
        ` : `
          <!-- Visual Timeline -->
          <div class="tracking-timeline-wrapper mb-5">
            <div class="tracking-timeline">
              ${stages.map((stage, idx) => {
                const isPassed = currentStageIndex > idx;
                const isCurrent = currentStageIndex === idx;
                const timelineEntry = (order.timeline || []).find(t => t.status === stage.key);

                return `
                  <div class="timeline-step ${isPassed ? 'is-passed' : ''} ${isCurrent ? 'is-current' : ''}">
                    <div class="step-connector"></div>
                    <div class="step-node">
                      ${isPassed ? '✓' : idx + 1}
                    </div>
                    <div class="step-info">
                      <div class="step-title font-medium">${stage.label}</div>
                      <div class="step-desc text-xs text-muted">${stage.desc}</div>
                      ${timelineEntry ? `<div class="step-time text-xs font-mono text-primary mt-1">${timelineEntry.time}</div>` : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `}

        <!-- Driver / Dispatch Card if delivery -->
        ${order.deliveryPartner && !isTakeaway && order.status !== 'cancelled' ? `
          <div class="dispatch-partner-card mb-4">
            <div class="partner-avatar">🛵</div>
            <div class="partner-info">
              <div class="partner-name font-medium">${escapeHtml(order.deliveryPartner.name)} <span class="partner-rating font-serif">${order.deliveryPartner.rating}</span></div>
              <div class="text-xs text-muted">Delivery Connoisseur · ${escapeHtml(order.deliveryPartner.vehicle)}</div>
            </div>
            <div class="partner-actions">
              <button class="btn btn-outline btn-sm" onclick="showToast('Simulated Call: Connecting to delivery partner...', 'info')">📞 Call</button>
            </div>
          </div>
        ` : ''}

        <!-- Two column details: Items & Customer info -->
        <div class="tracking-details-grid">
          <div class="tracking-items-col">
            <h4 class="font-serif mb-3">Itemized Docket</h4>
            <div class="tracking-items-list mb-3">
              ${order.items.map(item => `
                <div class="tracking-item-row flex-between py-2 border-bottom">
                  <div>
                    <strong class="text-sm">${item.quantity}× ${escapeHtml(item.name)}</strong>
                    ${item.variantName ? `<div class="text-xs text-muted">${escapeHtml(item.variantName)}</div>` : ''}
                    ${item.addOns && item.addOns.length > 0 ? `<div class="text-xs text-muted">+ ${item.addOns.map(a => escapeHtml(a)).join(', ')}</div>` : ''}
                  </div>
                  <span class="font-mono text-sm">${formatCurrency(item.totalPrice)}</span>
                </div>
              `).join('')}
            </div>

            <!-- Price Breakdown -->
            <div class="bill-breakdown text-sm">
              <div class="bill-row">
                <span>Subtotal</span>
                <span>${formatCurrency(order.pricingSnapshot.subtotal)}</span>
              </div>
              ${order.pricingSnapshot.discount > 0 ? `
                <div class="bill-row text-success">
                  <span>Demo Promo Discount</span>
                  <span>−${formatCurrency(order.pricingSnapshot.discount)}</span>
                </div>
              ` : ''}
              <div class="bill-row">
                <span>Packaging Fee</span>
                <span>${formatCurrency(order.pricingSnapshot.packagingFee)}</span>
              </div>
              <div class="bill-row">
                <span>Delivery Fee</span>
                <span>${order.pricingSnapshot.deliveryFee === 0 ? 'FREE' : formatCurrency(order.pricingSnapshot.deliveryFee)}</span>
              </div>
              <div class="bill-row">
                <span>Demo GST (5%)</span>
                <span>${formatCurrency(order.pricingSnapshot.gst)}</span>
              </div>
              <div class="bill-divider"></div>
              <div class="bill-row font-semibold text-base">
                <span>Total Snapshot</span>
                <span class="font-serif text-primary">${formatCurrency(order.pricingSnapshot.grandTotal)}</span>
              </div>
            </div>
          </div>

          <div class="tracking-destination-col">
            <h4 class="font-serif mb-3">Service & Delivery Information</h4>
            <div class="card p-3 bg-subtle mb-3">
              <div class="mb-2">
                <span class="text-xs text-muted">Customer</span>
                <div class="font-medium">${escapeHtml(order.customer.name)}</div>
                <div class="text-xs text-muted">${escapeHtml(order.customer.phone)}</div>
              </div>

              ${isTakeaway ? `
                <div class="mb-2">
                  <span class="text-xs text-muted">Pickup Location</span>
                  <div class="text-sm font-medium">Srestaurents Curbside Valet Desk</div>
                  <div class="text-xs text-muted">Road No. 36, Jubilee Hills, Hyderabad</div>
                  <div class="text-xs text-primary mt-1">Expected: ${escapeHtml(order.customer.pickupTime || 'Within 30 mins')}</div>
                </div>
              ` : `
                <div class="mb-2">
                  <span class="text-xs text-muted">Delivery Address</span>
                  <div class="text-sm">${escapeHtml(order.customer.address?.line1 || '')}</div>
                  ${order.customer.address?.line2 ? `<div class="text-xs text-muted">${escapeHtml(order.customer.address.line2)}</div>` : ''}
                  <div class="text-xs text-muted">${escapeHtml(order.customer.address?.city || '')} — ${escapeHtml(order.customer.address?.pincode || '')}</div>
                </div>
              `}

              ${order.customer.instructions ? `
                <div class="mt-2 pt-2 border-top">
                  <span class="text-xs text-muted">Special Notes</span>
                  <div class="text-xs italic">"${escapeHtml(order.customer.instructions)}"</div>
                </div>
              ` : ''}
            </div>

            <div class="other-orders-selector card p-3">
              <h5 class="text-xs font-mono uppercase text-muted mb-2">Switch Demo Order</h5>
              <div class="demo-orders-chips flex-wrap gap-1">
                ${StorageService.getOrders().map(o => `
                  <a href="track-order.html?id=${o.id}" class="chip ${o.id === order.id ? 'chip-active' : ''}">
                    #${o.id} (${o.status})
                  </a>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach simulation buttons
    this.attachSimulationEvents();
  },

  attachSimulationEvents() {
    const advanceStatus = (newStatus, note) => {
      StorageService.updateOrderStatus(this.currentOrder.id, newStatus, note);
      this.currentOrder = StorageService.getOrderById(this.currentOrder.id);
      showToast(`Demo order status transitioned to "${newStatus}"!`, 'info');
      this.renderTracker();
    };

    const btnPlaced = document.getElementById('sim-btn-placed');
    if (btnPlaced) btnPlaced.addEventListener('click', () => advanceStatus('placed', 'Order reset to placed.'));

    const btnConfirmed = document.getElementById('sim-btn-confirmed');
    if (btnConfirmed) btnConfirmed.addEventListener('click', () => advanceStatus('confirmed', 'Chef approved order docket.'));

    const btnPrep = document.getElementById('sim-btn-preparing');
    if (btnPrep) btnPrep.addEventListener('click', () => advanceStatus('preparing', 'Cooking in progress inside kitchen.'));

    const btnOut = document.getElementById('sim-btn-out');
    if (btnOut) btnOut.addEventListener('click', () => advanceStatus('out-for-delivery', 'Handed over for delivery / ready at counter.'));

    const btnComplete = document.getElementById('sim-btn-completed');
    if (btnComplete) btnComplete.addEventListener('click', () => advanceStatus('completed', 'Successfully delivered to customer.'));
  }
};
