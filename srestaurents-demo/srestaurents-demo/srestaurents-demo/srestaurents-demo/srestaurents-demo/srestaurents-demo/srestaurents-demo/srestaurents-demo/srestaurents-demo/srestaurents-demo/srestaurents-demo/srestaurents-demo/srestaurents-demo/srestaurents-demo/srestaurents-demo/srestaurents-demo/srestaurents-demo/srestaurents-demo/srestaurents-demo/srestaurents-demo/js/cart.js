/**
 * Srestaurents — Cart Service & Order Page Renderer
 * Manages cart state, variants, add-ons, pricing formulas, and localStorage persistence.
 */

const CartService = {
  // Add item with variants, add-ons, and special instructions
  addItem(dishId, variantId = null, addOnIds = [], instructions = '', quantity = 1) {
    const dish = StorageService.getDishById(dishId);
    if (!dish) {
      console.error(`[CartService] Dish not found: ${dishId}`);
      return false;
    }

    // Determine variant
    let chosenVariant = null;
    let variantPriceDiff = 0;
    if (dish.variants && dish.variants.length > 0) {
      chosenVariant = dish.variants.find(v => v.id === variantId) || dish.variants[0];
      variantPriceDiff = chosenVariant.priceDiff || 0;
    }

    // Determine add-ons
    const selectedAddOns = [];
    let addOnsPrice = 0;
    if (dish.addOns && dish.addOns.length > 0 && Array.isArray(addOnIds)) {
      addOnIds.forEach(id => {
        const found = dish.addOns.find(a => a.id === id);
        if (found) {
          selectedAddOns.push(found);
          addOnsPrice += (found.price || 0);
        }
      });
    }

    const unitPrice = dish.price + variantPriceDiff + addOnsPrice;
    
    // Create unique key to combine matching customized items
    const compositeKey = `${dish.id}__${chosenVariant ? chosenVariant.id : 'default'}__${selectedAddOns.map(a => a.id).sort().join(',')}`;

    const cart = StorageService.getCart();
    if (!Array.isArray(cart.items)) {
      cart.items = [];
    }

    const existingIndex = cart.items.findIndex(item => item.compositeKey === compositeKey && (item.instructions || '') === (instructions || ''));

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += quantity;
      cart.items[existingIndex].totalPrice = cart.items[existingIndex].unitPrice * cart.items[existingIndex].quantity;
    } else {
      cart.items.push({
        cartItemId: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        compositeKey: compositeKey,
        dishId: dish.id,
        name: dish.name,
        image: dish.image,
        dietary: dish.dietary,
        category: dish.category,
        variantName: chosenVariant ? chosenVariant.name : null,
        variantId: chosenVariant ? chosenVariant.id : null,
        addOns: selectedAddOns.map(a => ({ id: a.id, name: a.name, price: a.price })),
        instructions: instructions ? instructions.trim() : '',
        basePrice: dish.price,
        unitPrice: unitPrice,
        quantity: quantity,
        totalPrice: unitPrice * quantity
      });
    }

    StorageService.saveCart(cart);
    return true;
  },

  // Update Item Quantity
  updateQuantity(cartItemId, newQty) {
    const cart = StorageService.getCart();
    if (!cart.items) return;

    if (newQty <= 0) {
      this.removeItem(cartItemId);
      return;
    }

    const item = cart.items.find(i => i.cartItemId === cartItemId);
    if (item) {
      item.quantity = newQty;
      item.totalPrice = item.unitPrice * item.quantity;
      StorageService.saveCart(cart);
    }
  },

  // Remove Item from Cart
  removeItem(cartItemId) {
    const cart = StorageService.getCart();
    if (!cart.items) return;

    cart.items = cart.items.filter(i => i.cartItemId !== cartItemId);
    StorageService.saveCart(cart);
  },

  // Clear Cart
  clear() {
    StorageService.clearCart();
  },

  // Set Delivery vs Takeaway
  setOrderType(orderType) {
    const cart = StorageService.getCart();
    cart.orderType = orderType;
    StorageService.saveCart(cart);
  },

  // Apply Demo Promo Code
  applyPromo(codeStr) {
    if (!codeStr) return { success: false, message: 'Please enter a valid demo promo code.' };
    
    const cleanCode = codeStr.trim().toUpperCase();
    const promo = SRESTAURENTS_CONFIG.promoCodes.find(p => p.code === cleanCode);

    if (!promo) {
      return { success: false, message: `Code "${cleanCode}" is invalid. Try WELCOME10, FEAST20, or SREST50.` };
    }

    const cart = StorageService.getCart();
    const currentSubtotal = (cart.items || []).reduce((sum, item) => sum + item.totalPrice, 0);

    if (currentSubtotal < promo.minOrder) {
      return { 
        success: false, 
        message: `Code ${promo.code} requires a minimum order subtotal of ${formatCurrency(promo.minOrder)}. Current: ${formatCurrency(currentSubtotal)}.` 
      };
    }

    cart.appliedPromo = promo;
    StorageService.saveCart(cart);
    return { success: true, message: `Promo code ${promo.code} applied successfully!`, promo };
  },

  // Remove Applied Promo Code
  removePromo() {
    const cart = StorageService.getCart();
    cart.appliedPromo = null;
    StorageService.saveCart(cart);
  },

  // Calculate Comprehensive Pricing Snapshot
  calculateTotals(overrideOrderType = null) {
    const cart = StorageService.getCart();
    const items = cart.items || [];
    const orderType = overrideOrderType || cart.orderType || 'delivery';
    const settings = StorageService.getSettings();
    const pricing = settings.pricing || SRESTAURENTS_CONFIG.pricing;

    const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

    // Calculate Promo Discount
    let discount = 0;
    let promoDetails = cart.appliedPromo;

    if (promoDetails && subtotal >= promoDetails.minOrder) {
      if (promoDetails.discountPercent) {
        discount = (subtotal * promoDetails.discountPercent) / 100;
        if (promoDetails.maxDiscount && discount > promoDetails.maxDiscount) {
          discount = promoDetails.maxDiscount;
        }
      } else if (promoDetails.flatDiscount) {
        discount = Math.min(subtotal, promoDetails.flatDiscount);
      }
    } else if (promoDetails && subtotal < promoDetails.minOrder) {
      // Auto revoke promo if below threshold
      cart.appliedPromo = null;
      promoDetails = null;
      StorageService.saveCart(cart);
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);

    // Packaging Fee (Applies to all takeaway & delivery orders)
    const packagingFee = items.length > 0 ? (pricing.packagingFee || 35) : 0;

    // Delivery Fee: 0 for Takeaway or if subtotal meets freeDeliveryThreshold
    let deliveryFee = 0;
    if (orderType === 'delivery' && items.length > 0) {
      if (subtotal >= (pricing.freeDeliveryThreshold || 850)) {
        deliveryFee = 0;
      } else {
        deliveryFee = pricing.deliveryFee || 50;
      }
    }

    // GST (5% standard restaurant rate on food subtotal after discount)
    const gst = Math.round((discountedSubtotal * (pricing.gstRate || 0.05)) * 100) / 100;

    // Grand Total
    const grandTotal = Math.round((discountedSubtotal + packagingFee + deliveryFee + gst) * 100) / 100;

    return {
      subtotal,
      discount,
      discountedSubtotal,
      packagingFee,
      deliveryFee,
      isFreeDelivery: orderType === 'delivery' && subtotal >= (pricing.freeDeliveryThreshold || 850),
      freeDeliveryThreshold: pricing.freeDeliveryThreshold || 850,
      amountNeededForFreeDelivery: Math.max(0, (pricing.freeDeliveryThreshold || 850) - subtotal),
      gst,
      gstRate: (pricing.gstRate || 0.05) * 100,
      grandTotal,
      orderType,
      appliedPromo: promoDetails,
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0)
    };
  },

  // Render Order Page View (order.html)
  renderOrderPage() {
    const container = document.getElementById('order-page-container');
    if (!container) return;

    const cart = StorageService.getCart();
    const items = cart.items || [];
    const totals = this.calculateTotals();

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card text-center">
          <div class="empty-state-icon">🧺</div>
          <h2 class="font-serif">Your Order Basket is Empty</h2>
          <p class="text-muted">Our master chefs are stoking the charcoal embers. Explore the multi-cuisine menu to assemble your bespoke feast.</p>
          <div class="mt-4">
            <a href="menu.html" class="btn btn-primary">Browse Full Menu</a>
          </div>
        </div>
      `;
      return;
    }

    let itemsHtml = items.map(item => {
      const addOnsText = item.addOns && item.addOns.length > 0 
        ? item.addOns.map(a => `+ ${escapeHtml(a.name)} (${formatCurrency(a.price)})`).join(', ') 
        : '';

      return `
        <div class="cart-item-row" data-id="${item.cartItemId}">
          <div class="cart-item-media">
            <img src="${item.image}" alt="${escapeHtml(item.name)}" class="cart-item-img">
            <span class="dietary-dot dietary-${item.dietary}"></span>
          </div>

          <div class="cart-item-info">
            <div class="cart-item-header">
              <h4 class="cart-item-title font-serif">${escapeHtml(item.name)}</h4>
              <button class="cart-item-remove-btn" title="Remove Item" data-remove="${item.cartItemId}">&times;</button>
            </div>
            
            ${item.variantName ? `<div class="cart-item-variant">${escapeHtml(item.variantName)}</div>` : ''}
            ${addOnsText ? `<div class="cart-item-addons">${addOnsText}</div>` : ''}
            ${item.instructions ? `<div class="cart-item-instructions"><em>Note: "${escapeHtml(item.instructions)}"</em></div>` : ''}

            <div class="cart-item-footer">
              <div class="qty-stepper">
                <button class="qty-btn" data-action="decrease" data-id="${item.cartItemId}">−</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn" data-action="increase" data-id="${item.cartItemId}">+</button>
              </div>
              <div class="cart-item-pricing">
                <span class="cart-item-unit text-muted">${formatCurrency(item.unitPrice)} each</span>
                <span class="cart-item-total font-semibold">${formatCurrency(item.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="order-layout">
        <div class="order-items-col">
          <div class="card p-4 mb-4">
            <div class="flex-between align-center mb-3">
              <h3 class="font-serif">Curated Dishes (${totals.itemCount} items)</h3>
              <button id="clear-cart-btn" class="btn btn-link text-danger text-sm">Clear All</button>
            </div>
            <div class="cart-items-list">
              ${itemsHtml}
            </div>
            <div class="mt-4 pt-3 border-top flex-between">
              <a href="menu.html" class="btn btn-outline btn-sm">← Add More Dishes</a>
            </div>
          </div>

          <!-- Order Type Choice -->
          <div class="card p-4">
            <h4 class="font-serif mb-3">Dining & Service Preference</h4>
            <div class="service-type-toggle">
              <label class="service-type-option ${totals.orderType === 'delivery' ? 'is-selected' : ''}">
                <input type="radio" name="orderTypeChoice" value="delivery" ${totals.orderType === 'delivery' ? 'checked' : ''}>
                <div class="service-type-content">
                  <span class="service-icon">🛵</span>
                  <strong>Gourmet Home Delivery</strong>
                  <p class="text-xs text-muted">Eco-friendly temperature insulated delivery to your doorstep.</p>
                </div>
              </label>

              <label class="service-type-option ${totals.orderType === 'takeaway' ? 'is-selected' : ''}">
                <input type="radio" name="orderTypeChoice" value="takeaway" ${totals.orderType === 'takeaway' ? 'checked' : ''}>
                <div class="service-type-content">
                  <span class="service-icon">🛍️</span>
                  <strong>Curbside / Takeaway Pickup</strong>
                  <p class="text-xs text-muted">Pick up fresh and hot directly at our Jubilee Hills counter.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Bill Summary Column -->
        <div class="order-summary-col">
          <div class="card p-4 sticky-summary">
            <h3 class="font-serif mb-3">Order Summary</h3>

            <!-- Free Delivery Progress Bar -->
            ${totals.orderType === 'delivery' ? `
              <div class="free-delivery-badge mb-3 ${totals.isFreeDelivery ? 'is-achieved' : ''}">
                ${totals.isFreeDelivery 
                  ? '🎉 <strong>Complimentary Delivery Unlocked!</strong>' 
                  : `Add <strong>${formatCurrency(totals.amountNeededForFreeDelivery)}</strong> more for FREE delivery.`}
              </div>
            ` : ''}

            <!-- Promo Code Form -->
            <div class="promo-box mb-4">
              ${totals.appliedPromo ? `
                <div class="applied-promo-tag">
                  <span class="promo-code-name">🏷️ ${escapeHtml(totals.appliedPromo.code)}</span>
                  <span class="promo-desc text-xs text-success">(${escapeHtml(totals.appliedPromo.description)})</span>
                  <button id="remove-promo-btn" class="btn-icon-xs" title="Remove Coupon">&times;</button>
                </div>
              ` : `
                <div class="promo-input-group">
                  <input type="text" id="promo-code-input" placeholder="Promo code (e.g. FEAST20)" class="form-input text-uppercase">
                  <button id="apply-promo-btn" class="btn btn-secondary btn-sm">Apply</button>
                </div>
                <div class="text-xs text-muted mt-1">Try demo codes: <strong>WELCOME10</strong> or <strong>FEAST20</strong></div>
              `}
            </div>

            <!-- Detailed Breakdown -->
            <div class="bill-breakdown">
              <div class="bill-row">
                <span>Item Subtotal</span>
                <span>${formatCurrency(totals.subtotal)}</span>
              </div>

              ${totals.discount > 0 ? `
                <div class="bill-row text-success font-medium">
                  <span>Demo Promo Discount (${escapeHtml(totals.appliedPromo.code)})</span>
                  <span>−${formatCurrency(totals.discount)}</span>
                </div>
              ` : ''}

              <div class="bill-row">
                <span class="tooltip-trigger" title="Food grade tamper-proof biodegradable packaging">Packaging & Container Fee ℹ</span>
                <span>${formatCurrency(totals.packagingFee)}</span>
              </div>

              <div class="bill-row">
                <span>Delivery Fee</span>
                <span>${totals.orderType === 'takeaway' ? '₹0 (Takeaway)' : (totals.deliveryFee === 0 ? '<span class="text-success">FREE</span>' : formatCurrency(totals.deliveryFee))}</span>
              </div>

              <div class="bill-row">
                <span class="tooltip-trigger" title="Standard 5% restaurant GST">Demo GST (${totals.gstRate}%) ℹ</span>
                <span>${formatCurrency(totals.gst)}</span>
              </div>

              <div class="bill-divider"></div>

              <div class="bill-row bill-grand-total">
                <span>Total Amount</span>
                <span class="grand-price">${formatCurrency(totals.grandTotal)}</span>
              </div>
              <div class="text-right text-xs text-muted mt-1">Inclusive of all sample taxes</div>
            </div>

            <div class="demo-warning-callout mt-4 mb-4">
              <span class="warning-icon">✨</span>
              <div class="text-xs">
                <strong>Demo Order Simulation:</strong> No actual payment or credit card is processed. Live demo only.
              </div>
            </div>

            <div class="summary-actions">
              <a href="checkout.html" class="btn btn-primary btn-block btn-lg">Proceed to Checkout →</a>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach Event Handlers
    this.attachOrderPageEvents(container);
  },

  // Attach Event Handlers for Order Page
  attachOrderPageEvents(container) {
    // Steppers
    container.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = btn.getAttribute('data-action');
        const cartItemId = btn.getAttribute('data-id');
        const cart = StorageService.getCart();
        const item = (cart.items || []).find(i => i.cartItemId === cartItemId);
        if (item) {
          if (action === 'increase') {
            this.updateQuantity(cartItemId, item.quantity + 1);
          } else {
            this.updateQuantity(cartItemId, item.quantity - 1);
          }
          this.renderOrderPage();
        }
      });
    });

    // Remove buttons
    container.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        const cartItemId = btn.getAttribute('data-remove');
        this.removeItem(cartItemId);
        showToast('Item removed from basket', 'info');
        this.renderOrderPage();
      });
    });

    // Clear cart
    const clearBtn = container.querySelector('#clear-cart-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Clear all items from your order basket?')) {
          this.clear();
          showToast('Order basket cleared', 'info');
          this.renderOrderPage();
        }
      });
    }

    // Service type toggle
    container.querySelectorAll('input[name="orderTypeChoice"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.setOrderType(e.target.value);
        this.renderOrderPage();
      });
    });

    // Apply Promo
    const applyPromoBtn = container.querySelector('#apply-promo-btn');
    const promoInput = container.querySelector('#promo-code-input');
    if (applyPromoBtn && promoInput) {
      applyPromoBtn.addEventListener('click', () => {
        const res = this.applyPromo(promoInput.value);
        if (res.success) {
          showToast(res.message, 'success');
        } else {
          showToast(res.message, 'error');
        }
        this.renderOrderPage();
      });

      promoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          applyPromoBtn.click();
        }
      });
    }

    // Remove Promo
    const removePromoBtn = container.querySelector('#remove-promo-btn');
    if (removePromoBtn) {
      removePromoBtn.addEventListener('click', () => {
        this.removePromo();
        showToast('Promo code removed', 'info');
        this.renderOrderPage();
      });
    }
  }
};
