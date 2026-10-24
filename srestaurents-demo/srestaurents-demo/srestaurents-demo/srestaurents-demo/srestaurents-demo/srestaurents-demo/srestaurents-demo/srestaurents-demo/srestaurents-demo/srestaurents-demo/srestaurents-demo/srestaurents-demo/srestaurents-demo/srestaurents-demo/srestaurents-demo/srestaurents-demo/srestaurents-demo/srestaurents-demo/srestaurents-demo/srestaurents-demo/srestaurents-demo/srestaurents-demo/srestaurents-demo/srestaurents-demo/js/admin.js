/**
 * Srestaurents — Admin Dashboard Controller
 * Powers metrics overview, live orders console, menu catalog CRUD,
 * table reservation management, and system settings.
 */

const AdminController = {
  activeOrderFilter: 'all',
  activeMenuFilter: 'all',
  activeReservationFilter: 'all',

  initDashboard() {
    this.renderOverviewMetrics();
    this.renderRecentOrdersTable();
    this.renderRecentReservationsTable();
    this.bindGlobalAdminEvents();
  },

  initMenuPage() {
    this.renderMenuCatalog();
    this.bindMenuEvents();
    this.bindGlobalAdminEvents();
  },

  initOrdersPage() {
    this.renderOrdersList();
    this.bindOrdersEvents();
    this.bindGlobalAdminEvents();
  },

  initReservationsPage() {
    this.renderReservationsList();
    this.bindReservationsEvents();
    this.bindGlobalAdminEvents();
  },

  initSettingsPage() {
    this.populateSettingsForm();
    this.bindSettingsEvents();
    this.bindGlobalAdminEvents();
  },

  bindGlobalAdminEvents() {
    // Reset Demo Data with confirmation
    const resetBtn = document.getElementById('admin-reset-demo-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to restore the initial demo state? All custom menu edits, newly placed demo orders, and bookings will be refreshed to default seed values.')) {
          StorageService.resetToDefaults();
          showToast('Demo data successfully restored to default state!', 'success');
          setTimeout(() => window.location.reload(), 700);
        }
      });
    }
  },

  // 1. Dashboard Overview Metrics (Calculated dynamically from demo dataset)
  renderOverviewMetrics() {
    const orders = StorageService.getOrders();
    const reservations = StorageService.getReservations();
    const menu = StorageService.getMenu();

    // Calculate total sales
    const totalSales = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.pricingSnapshot?.grandTotal || 0), 0);

    // Active preparing or placed orders
    const activeOrders = orders.filter(o => ['placed', 'confirmed', 'preparing', 'out-for-delivery'].includes(o.status)).length;

    // Upcoming reservations
    const upcomingReservations = reservations.filter(r => r.status === 'confirmed' || r.status === 'pending').length;

    // Best selling dishes calculated from actual ordered item frequency
    const dishCounts = {};
    orders.forEach(order => {
      (order.items || []).forEach(item => {
        const key = item.dishId || item.name;
        dishCounts[key] = (dishCounts[key] || 0) + (item.quantity || 1);
      });
    });

    const topDishEntries = Object.entries(dishCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const topDishesText = topDishEntries.map(([key, count]) => {
      const dish = menu.find(d => d.id === key) || { name: key };
      return `${dish.name} (${count} portions)`;
    }).join(', ') || 'Awadhi Biryani, Dal Makhani';

    // Update DOM
    const elSales = document.getElementById('stat-total-sales');
    const elOrders = document.getElementById('stat-total-orders');
    const elActive = document.getElementById('stat-active-orders');
    const elRes = document.getElementById('stat-upcoming-res');
    const elTop = document.getElementById('stat-top-dishes');

    if (elSales) elSales.textContent = formatCurrency(totalSales);
    if (elOrders) elOrders.textContent = orders.length;
    if (elActive) elActive.textContent = activeOrders;
    if (elRes) elRes.textContent = upcomingReservations;
    if (elTop) elTop.textContent = topDishesText;
  },

  renderRecentOrdersTable() {
    const tbody = document.getElementById('recent-orders-tbody');
    if (!tbody) return;

    const orders = StorageService.getOrders().slice(0, 5);

    if (orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted p-4">No demo orders recorded yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = orders.map(o => `
      <tr>
        <td class="font-mono font-bold"><a href="orders.html?search=${o.id}">#${o.id}</a></td>
        <td>
          <div class="font-medium">${escapeHtml(o.customer.name)}</div>
          <div class="text-xs text-muted">${o.customer.deliveryType === 'takeaway' ? '🛍️ Takeaway' : '🛵 Delivery'}</div>
        </td>
        <td>${o.items.length} items (${o.items.map(i => `${i.quantity}× ${i.name}`).slice(0, 2).join(', ')}${o.items.length > 2 ? '...' : ''})</td>
        <td class="font-mono font-medium">${formatCurrency(o.pricingSnapshot.grandTotal)}</td>
        <td><span class="badge ${this.getStatusBadgeClass(o.status)}">${o.status}</span></td>
        <td>
          <a href="orders.html" class="btn btn-sm btn-outline">Manage</a>
        </td>
      </tr>
    `).join('');
  },

  renderRecentReservationsTable() {
    const tbody = document.getElementById('recent-reservations-tbody');
    if (!tbody) return;

    const reservations = StorageService.getReservations().slice(0, 5);

    if (reservations.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted p-4">No reservations booked.</td></tr>`;
      return;
    }

    tbody.innerHTML = reservations.map(r => `
      <tr>
        <td class="font-mono font-bold">#${r.id}</td>
        <td>
          <div class="font-medium">${escapeHtml(r.guestName)}</div>
          <div class="text-xs text-muted">${escapeHtml(r.phone)}</div>
        </td>
        <td>${r.date} @ <strong class="text-primary">${r.timeSlot}</strong></td>
        <td>${r.partySize} Guests · ${escapeHtml(r.seatingArea)}</td>
        <td><span class="badge ${r.status === 'confirmed' ? 'badge-success' : r.status === 'seated' ? 'badge-primary' : 'badge-neutral'}">${r.status}</span></td>
        <td>
          <a href="reservations.html" class="btn btn-sm btn-outline">Review</a>
        </td>
      </tr>
    `).join('');
  },

  getStatusBadgeClass(status) {
    switch (status) {
      case 'placed': return 'badge-warning';
      case 'confirmed': return 'badge-primary';
      case 'preparing': return 'badge-info';
      case 'out-for-delivery': return 'badge-secondary';
      case 'completed': return 'badge-success';
      case 'cancelled': return 'badge-danger';
      default: return 'badge-neutral';
    }
  },

  // 2. Menu Catalog Management (CRUD)
  renderMenuCatalog() {
    const container = document.getElementById('admin-menu-list');
    if (!container) return;

    let menu = StorageService.getMenu();

    if (this.activeMenuFilter !== 'all') {
      menu = menu.filter(d => d.category === this.activeMenuFilter);
    }

    container.innerHTML = menu.map(dish => `
      <div class="admin-dish-row card p-3 mb-2 flex-between align-center flex-wrap gap-3 ${!dish.available ? 'is-disabled' : ''}">
        <div class="flex-align-center gap-3">
          <img src="../${dish.image}" alt="${escapeHtml(dish.name)}" class="admin-dish-thumb">
          <div>
            <div class="flex-align-center gap-2">
              <span class="dietary-marker dietary-${dish.dietary}"></span>
              <h4 class="font-serif font-bold text-base m-0">${escapeHtml(dish.name)}</h4>
              ${dish.featured ? `<span class="badge badge-warning text-xs">Featured</span>` : ''}
              ${!dish.available ? `<span class="badge badge-sold-out text-xs">Sold Out</span>` : ''}
            </div>
            <div class="text-xs text-muted mt-1">
              Category: <span class="capitalize">${dish.category}</span> · Price: <strong class="text-primary">${formatCurrency(dish.price)}</strong> · Spice: ${dish.spiceLevel}
            </div>
          </div>
        </div>

        <div class="admin-dish-actions flex-align-center gap-2">
          <button class="btn btn-sm ${dish.available ? 'btn-outline' : 'btn-success'} toggle-avail-btn" data-id="${dish.id}">
            ${dish.available ? 'Mark Sold Out' : 'Mark Available'}
          </button>
          <button class="btn btn-sm btn-outline edit-dish-btn" data-id="${dish.id}">Edit</button>
          <button class="btn btn-sm btn-danger delete-dish-btn" data-id="${dish.id}">Delete</button>
        </div>
      </div>
    `).join('');

    this.attachMenuCatalogEvents(container);
  },

  bindMenuEvents() {
    // Category tabs
    document.querySelectorAll('[data-admin-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-admin-cat]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeMenuFilter = btn.getAttribute('data-admin-cat');
        this.renderMenuCatalog();
      });
    });

    // Add Dish Form Submit
    const addDishForm = document.getElementById('add-dish-form');
    if (addDishForm) {
      addDishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveNewDish();
      });
    }
  },

  attachMenuCatalogEvents(container) {
    // Toggle availability
    container.querySelectorAll('.toggle-avail-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const newState = StorageService.toggleDishAvailability(id);
        showToast(`Item is now ${newState ? 'Available in live menu' : 'Sold Out today'}`, 'info');
        this.renderMenuCatalog();
      });
    });

    // Delete dish
    container.querySelectorAll('.delete-dish-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Delete this sample dish from the menu catalog?')) {
          StorageService.deleteDish(id);
          showToast('Sample dish removed from catalog.', 'info');
          this.renderMenuCatalog();
        }
      });
    });

    // Edit dish
    container.querySelectorAll('.edit-dish-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.openEditDishModal(id);
      });
    });
  },

  saveNewDish() {
    const name = document.getElementById('new-dish-name')?.value.trim();
    const category = document.getElementById('new-dish-category')?.value;
    const price = parseFloat(document.getElementById('new-dish-price')?.value) || 0;
    const dietary = document.getElementById('new-dish-dietary')?.value || 'veg';
    const spiceLevel = document.getElementById('new-dish-spice')?.value || 'mild';
    const desc = document.getElementById('new-dish-desc')?.value.trim();

    if (!name || price <= 0) {
      showToast('Please provide a dish title and valid price.', 'error');
      return;
    }

    const newDish = {
      id: 'dish-custom-' + Date.now(),
      name,
      category,
      price,
      dietary,
      spiceLevel,
      featured: false,
      bestseller: false,
      chefSpecial: false,
      available: true,
      image: dietary === 'veg' ? 'assets/images/paneer_tikka.jpg' : 'assets/images/biryani_awadhi.jpg',
      shortDescription: desc || 'Artisanal multi-cuisine preparation crafted by our kitchen.',
      description: desc || 'Artisanal multi-cuisine preparation crafted by our kitchen.',
      servingSize: 'Serves 2',
      variants: [{ id: 'std', name: 'Standard Serving', priceDiff: 0, isDefault: true }],
      addOns: []
    };

    StorageService.saveDish(newDish);
    showToast(`Dish "${name}" added to public menu!`, 'success');
    closeModal('add-dish-modal');
    this.renderMenuCatalog();
    document.getElementById('add-dish-form')?.reset();
  },

  openEditDishModal(dishId) {
    const dish = StorageService.getDishById(dishId);
    if (!dish) return;

    let modal = document.getElementById('edit-dish-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'edit-dish-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-md">
        <div class="modal-header flex-between align-center p-4 border-bottom">
          <h3 class="font-serif">Edit Dish: ${escapeHtml(dish.name)}</h3>
          <button class="modal-close" onclick="closeModal('edit-dish-modal')">&times;</button>
        </div>
        <div class="modal-body p-4">
          <form id="edit-dish-form">
            <div class="form-group mb-3">
              <label class="form-label">Dish Title</label>
              <input type="text" id="edit-dish-name" class="form-input" value="${escapeHtml(dish.name)}" required>
            </div>
            <div class="grid grid-2 gap-3 mb-3">
              <div class="form-group">
                <label class="form-label">Price (₹)</label>
                <input type="number" id="edit-dish-price" class="form-input" value="${dish.price}" min="1" required>
              </div>
              <div class="form-group">
                <label class="form-label">Category</label>
                <select id="edit-dish-category" class="form-select">
                  <option value="starters" ${dish.category === 'starters' ? 'selected' : ''}>Starters & Grills</option>
                  <option value="biryani" ${dish.category === 'biryani' ? 'selected' : ''}>Royal Biryani</option>
                  <option value="curries" ${dish.category === 'curries' ? 'selected' : ''}>Curries & Dals</option>
                  <option value="breads" ${dish.category === 'breads' ? 'selected' : ''}>Clay Oven Breads</option>
                  <option value="pan-asian" ${dish.category === 'pan-asian' ? 'selected' : ''}>Pan-Asian</option>
                  <option value="desserts" ${dish.category === 'desserts' ? 'selected' : ''}>Desserts & Beverages</option>
                </select>
              </div>
            </div>
            <div class="form-group mb-3">
              <label class="form-label">Description</label>
              <textarea id="edit-dish-desc" class="form-input" rows="3">${escapeHtml(dish.description || dish.shortDescription)}</textarea>
            </div>
            <div class="flex-align-center gap-3 mb-4">
              <label class="flex-align-center gap-2">
                <input type="checkbox" id="edit-dish-featured" ${dish.featured ? 'checked' : ''}>
                <span>Feature on Homepage</span>
              </label>
              <label class="flex-align-center gap-2">
                <input type="checkbox" id="edit-dish-available" ${dish.available ? 'checked' : ''}>
                <span>In Stock & Available</span>
              </label>
            </div>
            <div class="flex-end gap-2">
              <button type="button" class="btn btn-outline" onclick="closeModal('edit-dish-modal')">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    `;

    modal.querySelector('#edit-dish-form').addEventListener('submit', (e) => {
      e.preventDefault();
      dish.name = document.getElementById('edit-dish-name').value.trim();
      dish.price = parseFloat(document.getElementById('edit-dish-price').value) || dish.price;
      dish.category = document.getElementById('edit-dish-category').value;
      dish.description = document.getElementById('edit-dish-desc').value.trim();
      dish.shortDescription = dish.description;
      dish.featured = document.getElementById('edit-dish-featured').checked;
      dish.available = document.getElementById('edit-dish-available').checked;

      StorageService.saveDish(dish);
      showToast(`Updated "${dish.name}" in menu!`, 'success');
      closeModal('edit-dish-modal');
      this.renderMenuCatalog();
    });

    openModal('edit-dish-modal');
  },

  // 3. Orders Management
  renderOrdersList() {
    const container = document.getElementById('admin-orders-list');
    if (!container) return;

    let orders = StorageService.getOrders();

    if (this.activeOrderFilter !== 'all') {
      orders = orders.filter(o => o.status === this.activeOrderFilter);
    }

    if (orders.length === 0) {
      container.innerHTML = `<div class="card p-5 text-center text-muted">No orders match status "${this.activeOrderFilter}".</div>`;
      return;
    }

    container.innerHTML = orders.map(order => `
      <div class="card p-4 mb-3 admin-order-card" data-order-id="${order.id}">
        <div class="flex-between align-center flex-wrap gap-2 pb-3 border-bottom mb-3">
          <div>
            <span class="text-xs text-muted uppercase font-mono">Docket</span>
            <strong class="font-mono text-base ml-1">#${order.id}</strong>
            <span class="badge ${this.getStatusBadgeClass(order.status)} ml-2">${order.status}</span>
          </div>
          <div class="text-right">
            <span class="text-sm font-semibold">${formatCurrency(order.pricingSnapshot.grandTotal)}</span>
            <span class="text-xs text-muted font-mono block">${order.payment.status}</span>
          </div>
        </div>

        <div class="grid grid-2 gap-4 mb-3">
          <div>
            <div class="text-xs text-muted uppercase mb-1">Customer & Service</div>
            <strong>${escapeHtml(order.customer.name)}</strong> · ${escapeHtml(order.customer.phone)}
            <div class="text-xs text-muted mt-1">
              ${order.customer.deliveryType === 'delivery' 
                ? `🛵 Delivery: ${escapeHtml(order.customer.address?.line1 || '')}, ${escapeHtml(order.customer.address?.city || '')}` 
                : '🛍️ Curbside Takeaway Pickup'}
            </div>
            ${order.customer.instructions ? `<div class="text-xs italic text-muted mt-1">"${escapeHtml(order.customer.instructions)}"</div>` : ''}
          </div>

          <div>
            <div class="text-xs text-muted uppercase mb-1">Itemized Kitchen Order</div>
            <ul class="text-xs m-0 pl-3">
              ${order.items.map(i => `
                <li><strong>${i.quantity}×</strong> ${escapeHtml(i.name)} ${i.variantName ? `(${escapeHtml(i.variantName)})` : ''}</li>
              `).join('')}
            </ul>
          </div>
        </div>

        <div class="flex-between align-center flex-wrap gap-2 pt-2 border-top">
          <div class="text-xs text-muted">
            Created: ${new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </div>

          <div class="admin-order-status-stepper flex-align-center gap-2">
            <label class="text-xs text-muted">Update Status:</label>
            <select class="form-select form-select-sm order-status-select" data-id="${order.id}">
              <option value="placed" ${order.status === 'placed' ? 'selected' : ''}>1. Placed</option>
              <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>2. Confirmed</option>
              <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>3. Preparing</option>
              <option value="out-for-delivery" ${order.status === 'out-for-delivery' ? 'selected' : ''}>4. Out / Ready</option>
              <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>5. Completed</option>
              <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>✕ Cancelled</option>
            </select>
            <a href="../track-order.html?id=${order.id}" target="_blank" class="btn btn-sm btn-outline" title="Open Customer Tracking">Live View ↗</a>
          </div>
        </div>
      </div>
    `).join('');

    this.attachOrdersEvents(container);
  },

  bindOrdersEvents() {
    document.querySelectorAll('[data-order-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-order-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeOrderFilter = btn.getAttribute('data-order-filter');
        this.renderOrdersList();
      });
    });
  },

  attachOrdersEvents(container) {
    container.querySelectorAll('.order-status-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const id = select.getAttribute('data-id');
        const newStatus = e.target.value;
        StorageService.updateOrderStatus(id, newStatus, `Status updated by Admin to ${newStatus}`);
        showToast(`Order #${id} transitioned to "${newStatus}"!`, 'info');
        this.renderOrdersList();
      });
    });
  },

  // 4. Reservations Management
  renderReservationsList() {
    const container = document.getElementById('admin-reservations-list');
    if (!container) return;

    let res = StorageService.getReservations();

    if (this.activeReservationFilter !== 'all') {
      res = res.filter(r => r.status === this.activeReservationFilter);
    }

    if (res.length === 0) {
      container.innerHTML = `<div class="card p-5 text-center text-muted">No reservations found for filter "${this.activeReservationFilter}".</div>`;
      return;
    }

    container.innerHTML = res.map(r => `
      <div class="card p-4 mb-3 admin-res-card" data-res-id="${r.id}">
        <div class="flex-between align-center flex-wrap gap-2 pb-2 border-bottom mb-3">
          <div>
            <span class="font-mono font-bold text-base">#${r.id}</span>
            <span class="badge ${r.status === 'confirmed' ? 'badge-success' : r.status === 'seated' ? 'badge-primary' : 'badge-neutral'} ml-2">${r.status}</span>
          </div>
          <div class="text-right">
            <span class="badge badge-outline">${escapeHtml(r.tableAssigned || 'Table Unassigned')}</span>
          </div>
        </div>

        <div class="grid grid-3 gap-3 mb-3">
          <div>
            <div class="text-xs text-muted uppercase">Guest</div>
            <strong>${escapeHtml(r.guestName)}</strong>
            <div class="text-xs text-muted">${escapeHtml(r.phone)} · ${escapeHtml(r.email)}</div>
          </div>

          <div>
            <div class="text-xs text-muted uppercase">Schedule & Area</div>
            <div>${r.date} @ <strong class="text-primary">${r.timeSlot}</strong></div>
            <div class="text-xs text-muted">${r.partySize} Guests · ${escapeHtml(r.seatingArea)}</div>
          </div>

          <div>
            <div class="text-xs text-muted uppercase">Occasion & Requests</div>
            <div class="text-xs"><strong>${escapeHtml(r.occasion || 'Standard')}</strong></div>
            ${r.specialRequests ? `<div class="text-xs italic text-muted mt-1">"${escapeHtml(r.specialRequests)}"</div>` : ''}
          </div>
        </div>

        <div class="flex-end gap-2 pt-2 border-top">
          <button class="btn btn-sm btn-outline res-status-btn" data-id="${r.id}" data-status="confirmed" ${r.status === 'confirmed' ? 'disabled' : ''}>Confirm</button>
          <button class="btn btn-sm btn-primary res-status-btn" data-id="${r.id}" data-status="seated" ${r.status === 'seated' ? 'disabled' : ''}>Mark Seated</button>
          <button class="btn btn-sm btn-danger res-status-btn" data-id="${r.id}" data-status="cancelled" ${r.status === 'cancelled' ? 'disabled' : ''}>Cancel</button>
        </div>
      </div>
    `).join('');

    this.attachReservationsEvents(container);
  },

  bindReservationsEvents() {
    document.querySelectorAll('[data-res-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-res-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeReservationFilter = btn.getAttribute('data-res-filter');
        this.renderReservationsList();
      });
    });
  },

  attachReservationsEvents(container) {
    container.querySelectorAll('.res-status-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const status = btn.getAttribute('data-status');
        StorageService.updateReservationStatus(id, status);
        showToast(`Reservation #${id} updated to "${status}"!`, 'info');
        this.renderReservationsList();
      });
    });
  },

  // 5. Settings Management
  populateSettingsForm() {
    const settings = StorageService.getSettings();
    const rest = settings.restaurant || SRESTAURENTS_CONFIG.restaurant;
    const price = settings.pricing || SRESTAURENTS_CONFIG.pricing;

    const elName = document.getElementById('setting-name');
    const elStreet = document.getElementById('setting-street');
    const elPhone = document.getElementById('setting-phone');
    const elEmail = document.getElementById('setting-email');
    const elDeliveryFee = document.getElementById('setting-delivery-fee');
    const elFreeThreshold = document.getElementById('setting-free-threshold');
    const elPackaging = document.getElementById('setting-packaging-fee');
    const elGst = document.getElementById('setting-gst');

    if (elName) elName.value = rest.name || '';
    if (elStreet) elStreet.value = rest.street || '';
    if (elPhone) elPhone.value = rest.phone || '';
    if (elEmail) elEmail.value = rest.email || '';
    if (elDeliveryFee) elDeliveryFee.value = price.deliveryFee || 50;
    if (elFreeThreshold) elFreeThreshold.value = price.freeDeliveryThreshold || 850;
    if (elPackaging) elPackaging.value = price.packagingFee || 35;
    if (elGst) elGst.value = (price.gstRate || 0.05) * 100;
  },

  bindSettingsEvents() {
    const form = document.getElementById('settings-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const settings = StorageService.getSettings();

        settings.restaurant.name = document.getElementById('setting-name').value.trim();
        settings.restaurant.street = document.getElementById('setting-street').value.trim();
        settings.restaurant.phone = document.getElementById('setting-phone').value.trim();
        settings.restaurant.email = document.getElementById('setting-email').value.trim();

        settings.pricing.deliveryFee = parseFloat(document.getElementById('setting-delivery-fee').value) || 50;
        settings.pricing.freeDeliveryThreshold = parseFloat(document.getElementById('setting-free-threshold').value) || 850;
        settings.pricing.packagingFee = parseFloat(document.getElementById('setting-packaging-fee').value) || 35;
        settings.pricing.gstRate = (parseFloat(document.getElementById('setting-gst').value) || 5) / 100;

        StorageService.saveSettings(settings);
        showToast('Restaurant settings saved to demo storage!', 'success');
      });
    }
  }
};
