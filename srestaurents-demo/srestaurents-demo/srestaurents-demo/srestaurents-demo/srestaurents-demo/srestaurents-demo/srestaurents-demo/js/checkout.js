/**
 * Srestaurents — Checkout Controller
 * Validates forms, manages simulated payment methods, generates order snapshots,
 * and records orders in localStorage.
 */

const CheckoutController = {
  selectedPaymentMethod: 'upi_mock', // upi_mock, cod_mock, card_mock
  isPaymentSimulatedAuthorized: false,

  init() {
    this.checkCart();
    this.populateUserDetails();
    this.bindEvents();
    this.renderCheckoutSummary();
  },

  checkCart() {
    const cart = StorageService.getCart();
    if (!cart.items || cart.items.length === 0) {
      window.location.href = 'order.html';
    }
  },

  populateUserDetails() {
    const user = StorageService.getCurrentUser();
    if (!user) return;

    const nameInput = document.getElementById('checkout-name');
    const phoneInput = document.getElementById('checkout-phone');
    const emailInput = document.getElementById('checkout-email');

    if (nameInput && !nameInput.value) nameInput.value = user.name || '';
    if (phoneInput && !phoneInput.value) phoneInput.value = user.phone || '';
    if (emailInput && !emailInput.value) emailInput.value = user.email || '';

    // If delivery addresses exist, populate default
    if (user.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
      const line1 = document.getElementById('checkout-address-line1');
      const line2 = document.getElementById('checkout-address-line2');
      const landmark = document.getElementById('checkout-landmark');
      const pincode = document.getElementById('checkout-pincode');

      if (line1 && !line1.value) line1.value = defaultAddr.line1 || '';
      if (line2 && !line2.value) line2.value = defaultAddr.line2 || '';
      if (landmark && !landmark.value) landmark.value = defaultAddr.landmark || '';
      if (pincode && !pincode.value) pincode.value = defaultAddr.pincode || '';
    }
  },

  bindEvents() {
    // Delivery vs Takeaway tabs
    document.querySelectorAll('input[name="checkoutOrderType"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const type = e.target.value;
        CartService.setOrderType(type);

        const deliverySection = document.getElementById('checkout-delivery-fields');
        const takeawaySection = document.getElementById('checkout-takeaway-fields');

        if (type === 'delivery') {
          if (deliverySection) deliverySection.classList.remove('hidden');
          if (takeawaySection) takeawaySection.classList.add('hidden');
        } else {
          if (deliverySection) deliverySection.classList.add('hidden');
          if (takeawaySection) takeawaySection.classList.remove('hidden');
        }

        this.renderCheckoutSummary();
      });
    });

    // Payment method selector
    document.querySelectorAll('input[name="paymentMethodChoice"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.selectedPaymentMethod = e.target.value;
        document.querySelectorAll('.payment-method-details').forEach(el => el.classList.add('hidden'));

        const targetDetails = document.getElementById(`payment-details-${this.selectedPaymentMethod}`);
        if (targetDetails) {
          targetDetails.classList.remove('hidden');
        }
      });
    });

    // Simulated UPI 1-Click Authorize
    const simAuthBtn = document.getElementById('sim-authorize-upi-btn');
    if (simAuthBtn) {
      simAuthBtn.addEventListener('click', () => {
        this.isPaymentSimulatedAuthorized = true;
        simAuthBtn.textContent = '✓ Simulated Authorization Approved';
        simAuthBtn.classList.remove('btn-secondary');
        simAuthBtn.classList.add('btn-success');
        showToast('Demo payment authorized successfully!', 'success');
      });
    }

    // Form Submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.processOrder();
      });
    }
  },

  renderCheckoutSummary() {
    const container = document.getElementById('checkout-summary-container');
    if (!container) return;

    const cart = StorageService.getCart();
    const totals = CartService.calculateTotals();

    let itemsList = (cart.items || []).map(item => `
      <div class="checkout-summary-item">
        <div class="summary-item-qty">${item.quantity}×</div>
        <div class="summary-item-details">
          <div class="summary-item-name font-medium">${escapeHtml(item.name)}</div>
          ${item.variantName ? `<div class="text-xs text-muted">${escapeHtml(item.variantName)}</div>` : ''}
          ${item.addOns && item.addOns.length > 0 ? `<div class="text-xs text-muted">+ ${item.addOns.map(a => escapeHtml(a.name)).join(', ')}</div>` : ''}
        </div>
        <div class="summary-item-price font-medium">${formatCurrency(item.totalPrice)}</div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="checkout-summary-card card p-4">
        <h3 class="font-serif mb-3">Order Basket Review</h3>
        <div class="checkout-items-list mb-3">
          ${itemsList}
        </div>

        <div class="bill-breakdown border-top pt-3">
          <div class="bill-row">
            <span>Subtotal</span>
            <span>${formatCurrency(totals.subtotal)}</span>
          </div>

          ${totals.discount > 0 ? `
            <div class="bill-row text-success">
              <span>Promo Discount (${escapeHtml(totals.appliedPromo.code)})</span>
              <span>−${formatCurrency(totals.discount)}</span>
            </div>
          ` : ''}

          <div class="bill-row">
            <span>Packaging & Eco Container</span>
            <span>${formatCurrency(totals.packagingFee)}</span>
          </div>

          <div class="bill-row">
            <span>Delivery Fee</span>
            <span>${totals.orderType === 'takeaway' ? '₹0 (Takeaway)' : (totals.deliveryFee === 0 ? '<span class="text-success">FREE</span>' : formatCurrency(totals.deliveryFee))}</span>
          </div>

          <div class="bill-row">
            <span>Demo GST (${totals.gstRate}%)</span>
            <span>${formatCurrency(totals.gst)}</span>
          </div>

          <div class="bill-divider"></div>

          <div class="bill-row bill-grand-total">
            <span>Grand Total</span>
            <span class="grand-price">${formatCurrency(totals.grandTotal)}</span>
          </div>
        </div>

        <div class="demo-badge-banner mt-3 mb-4">
          <span class="badge-icon">🔒</span>
          <div class="text-xs">
            <strong>Demonstration Prototype:</strong> No genuine financial transaction will take place.
          </div>
        </div>

        <button type="submit" form="checkout-form" class="btn btn-primary btn-block btn-lg" id="confirm-order-btn">
          Confirm Demo Order (${formatCurrency(totals.grandTotal)}) →
        </button>
      </div>
    `;
  },

  validateForm() {
    const name = document.getElementById('checkout-name')?.value.trim();
    const phone = document.getElementById('checkout-phone')?.value.trim();
    const email = document.getElementById('checkout-email')?.value.trim();
    const orderType = document.querySelector('input[name="checkoutOrderType"]:checked')?.value || 'delivery';

    if (!name) {
      showToast('Please enter your full name.', 'error');
      document.getElementById('checkout-name')?.focus();
      return false;
    }

    if (!phone || phone.length < 10) {
      showToast('Please enter a valid 10-digit mobile number.', 'error');
      document.getElementById('checkout-phone')?.focus();
      return false;
    }

    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      document.getElementById('checkout-email')?.focus();
      return false;
    }

    if (orderType === 'delivery') {
      const line1 = document.getElementById('checkout-address-line1')?.value.trim();
      const pincode = document.getElementById('checkout-pincode')?.value.trim();

      if (!line1) {
        showToast('Please enter your street address / apartment.', 'error');
        document.getElementById('checkout-address-line1')?.focus();
        return false;
      }

      if (!pincode || pincode.length !== 6) {
        showToast('Please enter a 6-digit postal pincode.', 'error');
        document.getElementById('checkout-pincode')?.focus();
        return false;
      }
    }

    return true;
  },

  processOrder() {
    if (!this.validateForm()) return;

    const cart = StorageService.getCart();
    const totals = CartService.calculateTotals();
    const orderType = document.querySelector('input[name="checkoutOrderType"]:checked')?.value || 'delivery';

    const name = document.getElementById('checkout-name').value.trim();
    const phone = document.getElementById('checkout-phone').value.trim();
    const email = document.getElementById('checkout-email').value.trim();
    const instructions = document.getElementById('checkout-delivery-instructions')?.value.trim() || '';

    // Generate Unique Order Reference
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `SR-2026-${randomSuffix}`;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Customer payload
    const customer = {
      name,
      phone,
      email,
      deliveryType: orderType,
      instructions
    };

    if (orderType === 'delivery') {
      customer.address = {
        line1: document.getElementById('checkout-address-line1').value.trim(),
        line2: document.getElementById('checkout-address-line2')?.value.trim() || '',
        landmark: document.getElementById('checkout-landmark')?.value.trim() || '',
        city: 'Hyderabad',
        pincode: document.getElementById('checkout-pincode').value.trim()
      };
    } else {
      customer.pickupTime = document.getElementById('checkout-pickup-slot')?.value || 'In 25 minutes';
    }

    // Payment payload
    const methodLabels = {
      'upi_mock': 'Simulated UPI (Mock GPay/PhonePe)',
      'cod_mock': orderType === 'takeaway' ? 'Pay at Restaurant Desk' : 'Cash on Delivery (Demo COD)',
      'card_mock': 'Simulated Visa / Mastercard'
    };

    const payment = {
      method: this.selectedPaymentMethod,
      methodLabel: methodLabels[this.selectedPaymentMethod] || 'Simulated Payment',
      status: this.selectedPaymentMethod === 'cod_mock' ? 'Pending on Handover' : 'Paid (Demo Simulation)',
      transactionId: `SIM-${Date.now().toString(36).toUpperCase()}`,
      isSimulation: true
    };

    // Item snapshot with frozen prices
    const itemSnapshots = (cart.items || []).map(item => ({
      dishId: item.dishId,
      name: item.name,
      variantName: item.variantName,
      addOns: (item.addOns || []).map(a => a.name),
      instructions: item.instructions,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      totalPrice: item.totalPrice
    }));

    const newOrder = {
      id: orderId,
      customer,
      items: itemSnapshots,
      pricingSnapshot: {
        subtotal: totals.subtotal,
        discount: totals.discount,
        promoCode: totals.appliedPromo ? totals.appliedPromo.code : null,
        packagingFee: totals.packagingFee,
        deliveryFee: totals.deliveryFee,
        gst: totals.gst,
        grandTotal: totals.grandTotal
      },
      payment,
      status: 'placed',
      timeline: [
        {
          status: 'placed',
          label: 'Order Placed',
          time: timeStr,
          note: 'Demo order received and placed in live kitchen docket.'
        }
      ],
      createdAt: now.toISOString(),
      deliveryPartner: orderType === 'delivery' ? {
        name: 'Karthik V.',
        vehicle: 'Ola S1 Pro (TS 09 FL 7819)',
        rating: '4.9 ★',
        phone: '+91 98765 00199 (Demo Relay)'
      } : null
    };

    // Save order to localStorage
    StorageService.saveOrder(newOrder);

    // Update user's demo order history count
    const user = StorageService.getCurrentUser();
    if (user) {
      user.ordersCount = (user.ordersCount || 0) + 1;
      StorageService.setCurrentUser(user);
    }

    // Clear cart
    CartService.clear();

    // Show Confirmation Modal
    this.showConfirmationModal(newOrder);
  },

  showConfirmationModal(order) {
    let modal = document.getElementById('order-confirmation-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'order-confirmation-modal';
      modal.className = 'modal-overlay is-open';
      document.body.appendChild(modal);
    } else {
      modal.classList.add('is-open');
    }

    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-md">
        <div class="modal-body text-center p-5">
          <div class="confirmation-icon-circle mb-3">✓</div>
          <span class="badge badge-success mb-2">Simulated Order Confirmed</span>
          <h2 class="font-serif mb-1">Thank You, ${escapeHtml(order.customer.name)}!</h2>
          <p class="text-muted mb-4">Your order docket <strong>#${order.id}</strong> has been transmitted to our master chefs.</p>

          <div class="order-receipt-summary card p-3 text-left mb-4">
            <div class="flex-between mb-2">
              <span class="text-muted text-xs">Order Reference</span>
              <strong class="font-mono text-sm">${order.id}</strong>
            </div>
            <div class="flex-between mb-2">
              <span class="text-muted text-xs">Service Type</span>
              <span class="text-sm">${order.customer.deliveryType === 'delivery' ? '🛵 Gourmet Home Delivery' : '🛍️ Curbside Takeaway'}</span>
            </div>
            <div class="flex-between mb-2">
              <span class="text-muted text-xs">Simulated Payment</span>
              <span class="text-sm font-medium text-success">${escapeHtml(order.payment.status)}</span>
            </div>
            <div class="flex-between border-top pt-2 mt-2">
              <strong class="text-sm">Grand Total</strong>
              <strong class="text-sm font-serif text-primary">${formatCurrency(order.pricingSnapshot.grandTotal)}</strong>
            </div>
          </div>

          <div class="demo-callout-note mb-4 text-xs text-muted">
            ℹ This is an interactive demo order stored in your browser's localStorage. You can track its live timeline or test administrative status advancement.
          </div>

          <div class="confirmation-modal-actions flex-center gap-3">
            <a href="track-order.html?id=${order.id}" class="btn btn-primary btn-lg flex-1">
              Track Live Order Timeline →
            </a>
            <a href="menu.html" class="btn btn-outline btn-lg">
              Return to Menu
            </a>
          </div>
        </div>
      </div>
    `;
    document.body.classList.add('modal-open');
  }
};
