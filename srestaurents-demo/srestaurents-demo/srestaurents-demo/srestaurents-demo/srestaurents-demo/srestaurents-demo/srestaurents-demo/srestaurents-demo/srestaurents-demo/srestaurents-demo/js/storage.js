/**
 * Srestaurents — LocalStorage Manager
 * Safely persists demo data with namespace isolation and validation.
 */

const STORAGE_KEYS = {
  SETTINGS: 'srestaurents_settings',
  MENU: 'srestaurents_menu',
  ORDERS: 'srestaurents_orders',
  RESERVATIONS: 'srestaurents_reservations',
  CART: 'srestaurents_cart',
  USER: 'srestaurents_user',
  FAVORITES: 'srestaurents_favorites'
};

const StorageService = {
  // Safe read from localStorage
  get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      if (data === null) return defaultValue;
      return JSON.parse(data);
    } catch (err) {
      console.warn(`[SrestaurentsStorage] Error reading key "${key}":`, err);
      return defaultValue;
    }
  },

  // Safe write to localStorage
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`[SrestaurentsStorage] Error writing key "${key}":`, err);
      return false;
    }
  },

  // Remove key
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.warn(`[SrestaurentsStorage] Error removing key "${key}":`, err);
      return false;
    }
  },

  // Initialize default data if not already present
  initDefaults(force = false) {
    if (force) {
      this.resetToDefaults();
      return;
    }

    // Initialize Settings
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.set(STORAGE_KEYS.SETTINGS, {
        restaurant: SRESTAURENTS_CONFIG.restaurant,
        pricing: SRESTAURENTS_CONFIG.pricing,
        onlineOrderingActive: true
      });
    }

    // Initialize Menu
    if (!localStorage.getItem(STORAGE_KEYS.MENU)) {
      this.set(STORAGE_KEYS.MENU, SEED_DATA.dishes);
    }

    // Initialize Orders
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      this.set(STORAGE_KEYS.ORDERS, SEED_DATA.seedOrders);
    }

    // Initialize Reservations
    if (!localStorage.getItem(STORAGE_KEYS.RESERVATIONS)) {
      this.set(STORAGE_KEYS.RESERVATIONS, SEED_DATA.seedReservations);
    }

    // Initialize Cart
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      this.set(STORAGE_KEYS.CART, {
        items: [],
        appliedPromo: null,
        orderType: 'delivery'
      });
    }

    // Initialize User
    if (!localStorage.getItem(STORAGE_KEYS.USER)) {
      this.set(STORAGE_KEYS.USER, SEED_DATA.demoPersonas[0]);
    }

    // Initialize Favorites
    if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
      this.set(STORAGE_KEYS.FAVORITES, SEED_DATA.demoPersonas[0].favorites);
    }
  },

  // Reset demo data strictly to defaults without touching any unrelated browser storage
  resetToDefaults() {
    Object.values(STORAGE_KEYS).forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (e) {}
    });

    this.set(STORAGE_KEYS.SETTINGS, {
      restaurant: SRESTAURENTS_CONFIG.restaurant,
      pricing: SRESTAURENTS_CONFIG.pricing,
      onlineOrderingActive: true
    });
    this.set(STORAGE_KEYS.MENU, JSON.parse(JSON.stringify(SEED_DATA.dishes)));
    this.set(STORAGE_KEYS.ORDERS, JSON.parse(JSON.stringify(SEED_DATA.seedOrders)));
    this.set(STORAGE_KEYS.RESERVATIONS, JSON.parse(JSON.stringify(SEED_DATA.seedReservations)));
    this.set(STORAGE_KEYS.CART, {
      items: [],
      appliedPromo: null,
      orderType: 'delivery'
    });
    this.set(STORAGE_KEYS.USER, JSON.parse(JSON.stringify(SEED_DATA.demoPersonas[0])));
    this.set(STORAGE_KEYS.FAVORITES, [...SEED_DATA.demoPersonas[0].favorites]);
    
    console.info('[SrestaurentsStorage] Demo storage successfully reset to default seeds.');
  },

  // Menu Methods
  getMenu() {
    return this.get(STORAGE_KEYS.MENU, SEED_DATA.dishes);
  },

  getDishById(id) {
    const menu = this.getMenu();
    return menu.find(d => d.id === id) || null;
  },

  saveDish(dishData) {
    const menu = this.getMenu();
    const index = menu.findIndex(d => d.id === dishData.id);
    if (index >= 0) {
      menu[index] = { ...menu[index], ...dishData };
    } else {
      menu.unshift(dishData);
    }
    this.set(STORAGE_KEYS.MENU, menu);
    return dishData;
  },

  deleteDish(id) {
    const menu = this.getMenu().filter(d => d.id !== id);
    this.set(STORAGE_KEYS.MENU, menu);
    return true;
  },

  toggleDishAvailability(id) {
    const menu = this.getMenu();
    const dish = menu.find(d => d.id === id);
    if (dish) {
      dish.available = !dish.available;
      this.set(STORAGE_KEYS.MENU, menu);
      return dish.available;
    }
    return false;
  },

  // Orders Methods
  getOrders() {
    return this.get(STORAGE_KEYS.ORDERS, SEED_DATA.seedOrders);
  },

  getOrderById(id) {
    const orders = this.getOrders();
    return orders.find(o => o.id === id) || null;
  },

  saveOrder(order) {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === order.id);
    if (index >= 0) {
      orders[index] = order;
    } else {
      orders.unshift(order);
    }
    this.set(STORAGE_KEYS.ORDERS, orders);
    return order;
  },

  updateOrderStatus(orderId, newStatus, note = '') {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;

    order.status = newStatus;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (!Array.isArray(order.timeline)) {
      order.timeline = [];
    }

    const statusLabels = {
      'placed': 'Order Placed',
      'confirmed': 'Kitchen Confirmed',
      'preparing': 'Kitchen Simmering',
      'out-for-delivery': order.customer?.deliveryType === 'takeaway' ? 'Ready for Pickup' : 'Out for Delivery',
      'completed': order.customer?.deliveryType === 'takeaway' ? 'Collected by Guest' : 'Delivered Safely',
      'cancelled': 'Order Cancelled (Demo)'
    };

    order.timeline.push({
      status: newStatus,
      label: statusLabels[newStatus] || newStatus,
      time: timeStr,
      note: note || `Status progressed to ${statusLabels[newStatus] || newStatus}.`
    });

    this.set(STORAGE_KEYS.ORDERS, orders);
    return order;
  },

  // Reservations Methods
  getReservations() {
    return this.get(STORAGE_KEYS.RESERVATIONS, SEED_DATA.seedReservations);
  },

  getReservationById(id) {
    const reservations = this.getReservations();
    return reservations.find(r => r.id === id) || null;
  },

  saveReservation(reservation) {
    const reservations = this.getReservations();
    const index = reservations.findIndex(r => r.id === reservation.id);
    if (index >= 0) {
      reservations[index] = reservation;
    } else {
      reservations.unshift(reservation);
    }
    this.set(STORAGE_KEYS.RESERVATIONS, reservations);
    return reservation;
  },

  updateReservationStatus(resId, newStatus, tableAssigned = null) {
    const reservations = this.getReservations();
    const res = reservations.find(r => r.id === resId);
    if (!res) return null;

    res.status = newStatus;
    if (tableAssigned) {
      res.tableAssigned = tableAssigned;
    }
    this.set(STORAGE_KEYS.RESERVATIONS, reservations);
    return res;
  },

  // Settings Methods
  getSettings() {
    return this.get(STORAGE_KEYS.SETTINGS, {
      restaurant: SRESTAURENTS_CONFIG.restaurant,
      pricing: SRESTAURENTS_CONFIG.pricing,
      onlineOrderingActive: true
    });
  },

  saveSettings(settings) {
    this.set(STORAGE_KEYS.SETTINGS, settings);
    return settings;
  },

  // Cart Methods
  getCart() {
    return this.get(STORAGE_KEYS.CART, {
      items: [],
      appliedPromo: null,
      orderType: 'delivery'
    });
  },

  saveCart(cart) {
    this.set(STORAGE_KEYS.CART, cart);
    // Dispatch custom event for cross-component reactivity
    try {
      window.dispatchEvent(new CustomEvent('srestaurents:cart-updated', { detail: cart }));
    } catch (e) {}
    return cart;
  },

  clearCart() {
    const emptyCart = {
      items: [],
      appliedPromo: null,
      orderType: 'delivery'
    };
    this.saveCart(emptyCart);
    return emptyCart;
  },

  // User & Persona Methods
  getCurrentUser() {
    return this.get(STORAGE_KEYS.USER, SEED_DATA.demoPersonas[0]);
  },

  setCurrentUser(user) {
    this.set(STORAGE_KEYS.USER, user);
    try {
      window.dispatchEvent(new CustomEvent('srestaurents:user-updated', { detail: user }));
    } catch (e) {}
    return user;
  },

  switchPersona(personaId) {
    const found = SEED_DATA.demoPersonas.find(p => p.id === personaId);
    if (found) {
      this.setCurrentUser(found);
      this.set(STORAGE_KEYS.FAVORITES, found.favorites || []);
      return found;
    }
    return null;
  },

  // Favorites
  getFavorites() {
    return this.get(STORAGE_KEYS.FAVORITES, []);
  },

  toggleFavorite(dishId) {
    let favs = this.getFavorites();
    if (favs.includes(dishId)) {
      favs = favs.filter(id => id !== dishId);
    } else {
      favs.push(dishId);
    }
    this.set(STORAGE_KEYS.FAVORITES, favs);
    try {
      window.dispatchEvent(new CustomEvent('srestaurents:favorites-updated', { detail: favs }));
    } catch (e) {}
    return favs;
  }
};

// Auto-initialize storage on script load
StorageService.initDefaults();
