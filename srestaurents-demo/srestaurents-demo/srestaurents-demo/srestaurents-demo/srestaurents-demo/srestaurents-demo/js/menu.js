/**
 * Srestaurents — Interactive Menu & Dish Modal Controller
 * Handles filtering, search, sorting, dish customization modal, and quick add.
 */

const MenuController = {
  currentCategory: 'all',
  currentDietary: 'all', // all, veg, non-veg, chef-special
  currentSort: 'recommended',
  searchQuery: '',
  activeDishForModal: null,

  init() {
    this.bindEvents();
    this.renderCategoryNav();
    this.renderDishes();
    this.setupModal();
  },

  bindEvents() {
    // Search input
    const searchInput = document.getElementById('menu-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.renderDishes();
      });
    }

    // Dietary filter pills
    document.querySelectorAll('[data-dietary-filter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-dietary-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentDietary = btn.getAttribute('data-dietary-filter');
        this.renderDishes();
      });
    });

    // Sort select
    const sortSelect = document.getElementById('menu-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.renderDishes();
      });
    }

    // Listen for storage updates (e.g. if admin edits a dish)
    window.addEventListener('srestaurents:favorites-updated', () => {
      this.updateFavoriteButtons();
    });
  },

  renderCategoryNav() {
    const navContainer = document.getElementById('menu-category-tabs');
    if (!navContainer) return;

    const categories = SEED_DATA.categories;
    navContainer.innerHTML = categories.map(cat => `
      <button class="category-tab-btn ${this.currentCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
        <span class="cat-icon">${cat.icon}</span>
        <span class="cat-name">${cat.name}</span>
      </button>
    `).join('');

    navContainer.querySelectorAll('.category-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        navContainer.querySelectorAll('.category-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategory = btn.getAttribute('data-category');
        this.renderDishes();
      });
    });
  },

  getFilteredDishes() {
    let dishes = StorageService.getMenu();

    // 1. Filter by category
    if (this.currentCategory !== 'all') {
      dishes = dishes.filter(d => d.category === this.currentCategory);
    }

    // 2. Filter by dietary
    if (this.currentDietary === 'veg') {
      dishes = dishes.filter(d => d.dietary === 'veg');
    } else if (this.currentDietary === 'non-veg') {
      dishes = dishes.filter(d => d.dietary === 'non-veg');
    } else if (this.currentDietary === 'chef-special') {
      dishes = dishes.filter(d => d.chefSpecial || d.bestseller);
    }

    // 3. Filter by search query
    if (this.searchQuery) {
      const q = this.searchQuery;
      dishes = dishes.filter(d => 
        d.name.toLowerCase().includes(q) ||
        (d.shortDescription && d.shortDescription.toLowerCase().includes(q)) ||
        (d.description && d.description.toLowerCase().includes(q)) ||
        (d.ingredients && d.ingredients.some(ing => ing.toLowerCase().includes(q)))
      );
    }

    // 4. Sort
    if (this.currentSort === 'price-low') {
      dishes.sort((a, b) => a.price - b.price);
    } else if (this.currentSort === 'price-high') {
      dishes.sort((a, b) => b.price - a.price);
    } else if (this.currentSort === 'spiciness') {
      const spiceOrder = { 'mild': 1, 'medium': 2, 'spicy': 3 };
      dishes.sort((a, b) => (spiceOrder[b.spiceLevel] || 1) - (spiceOrder[a.spiceLevel] || 1));
    } else {
      // Recommended: featured first, then bestsellers
      dishes.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return dishes;
  },

  renderDishes() {
    const grid = document.getElementById('dishes-grid');
    const emptyState = document.getElementById('menu-empty-state');
    const resultsCount = document.getElementById('menu-results-count');

    if (!grid) return;

    const dishes = this.getFilteredDishes();
    const favorites = StorageService.getFavorites();

    if (resultsCount) {
      resultsCount.textContent = `Showing ${dishes.length} artisanal ${dishes.length === 1 ? 'dish' : 'dishes'}`;
    }

    if (dishes.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    grid.innerHTML = dishes.map(dish => {
      const isFav = favorites.includes(dish.id);
      const spiceIcons = dish.spiceLevel === 'spicy' ? '🌶️🌶️' : dish.spiceLevel === 'medium' ? '🌶️' : '🌿';

      return `
        <article class="dish-card ${!dish.available ? 'is-sold-out' : ''}" data-dish-id="${dish.id}">
          <div class="dish-card-media">
            <img src="${dish.image}" alt="${escapeHtml(dish.name)}" class="dish-card-img" loading="lazy">
            <div class="dish-media-overlay">
              <span class="dietary-marker dietary-${dish.dietary}" title="${dish.dietary === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}">
                <span class="dietary-symbol"></span>
              </span>
              ${dish.chefSpecial ? `<span class="badge badge-chef">Chef's Signature</span>` : ''}
              ${dish.bestseller && !dish.chefSpecial ? `<span class="badge badge-bestseller">Popular</span>` : ''}
              ${!dish.available ? `<span class="badge badge-sold-out">Sold Out Today</span>` : ''}
              
              <button class="btn-fav ${isFav ? 'is-fav' : ''}" data-fav-id="${dish.id}" title="${isFav ? 'Remove from favorites' : 'Save to favorites'}">
                <span class="fav-heart">${isFav ? '♥' : '♡'}</span>
              </button>
            </div>
          </div>

          <div class="dish-card-body">
            <div class="dish-meta-row">
              <span class="dish-spice-tag text-xs" title="Spice level: ${dish.spiceLevel}">
                ${spiceIcons} ${dish.spiceLevel.charAt(0).toUpperCase() + dish.spiceLevel.slice(1)}
              </span>
              ${dish.servingSize ? `<span class="dish-portion text-xs text-muted">${escapeHtml(dish.servingSize)}</span>` : ''}
            </div>

            <h3 class="dish-title font-serif">
              <a href="dish.html?id=${dish.id}" class="dish-title-link">${escapeHtml(dish.name)}</a>
            </h3>

            <p class="dish-desc text-muted">${escapeHtml(dish.shortDescription || dish.description)}</p>

            <div class="dish-card-footer">
              <div class="dish-price-block">
                <span class="dish-price font-serif">${formatCurrency(dish.price)}</span>
                ${dish.variants && dish.variants.length > 1 ? `<span class="dish-custom-hint text-xs text-muted">options available</span>` : ''}
              </div>

              <div class="dish-actions">
                ${dish.available ? `
                  <button class="btn btn-outline btn-sm btn-customize" data-open-dish="${dish.id}">
                    Customize & Add +
                  </button>
                ` : `
                  <button class="btn btn-disabled btn-sm" disabled>Sold Out</button>
                `}
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach Click Handlers to Cards
    this.attachCardEvents(grid);
  },

  attachCardEvents(container) {
    // Customize & Add button clicks
    container.querySelectorAll('[data-open-dish]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const dishId = btn.getAttribute('data-open-dish');
        this.openDishModal(dishId);
      });
    });

    // Favorite button clicks
    container.querySelectorAll('[data-fav-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const dishId = btn.getAttribute('data-fav-id');
        StorageService.toggleFavorite(dishId);
        const isFav = StorageService.getFavorites().includes(dishId);
        btn.classList.toggle('is-fav', isFav);
        btn.querySelector('.fav-heart').textContent = isFav ? '♥' : '♡';
        showToast(isFav ? 'Saved to your favourite dishes' : 'Removed from favourites', 'info');
      });
    });
  },

  updateFavoriteButtons() {
    const favorites = StorageService.getFavorites();
    document.querySelectorAll('[data-fav-id]').forEach(btn => {
      const dishId = btn.getAttribute('data-fav-id');
      const isFav = favorites.includes(dishId);
      btn.classList.toggle('is-fav', isFav);
      btn.querySelector('.fav-heart').textContent = isFav ? '♥' : '♡';
    });
  },

  setupModal() {
    const modal = document.getElementById('dish-customize-modal');
    if (!modal) return;

    modal.querySelector('.modal-close').addEventListener('click', () => {
      closeModal('dish-customize-modal');
    });

    // Backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal('dish-customize-modal');
      }
    });
  },

  openDishModal(dishId) {
    const dish = StorageService.getDishById(dishId);
    if (!dish) return;

    this.activeDishForModal = dish;
    const modal = document.getElementById('dish-customize-modal');
    if (!modal) return;

    // Reset modal form state
    let selectedVariantId = (dish.variants && dish.variants[0]) ? dish.variants[0].id : null;
    let selectedAddOnIds = [];
    let modalQuantity = 1;

    const modalBody = modal.querySelector('.dish-modal-content');

    const renderModalForm = () => {
      // Calculate current live price
      let livePrice = dish.price;
      if (dish.variants && selectedVariantId) {
        const v = dish.variants.find(varItem => varItem.id === selectedVariantId);
        if (v) livePrice += (v.priceDiff || 0);
      }
      if (dish.addOns && selectedAddOnIds.length > 0) {
        selectedAddOnIds.forEach(aId => {
          const a = dish.addOns.find(addOnItem => addOnItem.id === aId);
          if (a) livePrice += (a.price || 0);
        });
      }
      const totalModalPrice = livePrice * modalQuantity;

      modalBody.innerHTML = `
        <div class="dish-modal-grid">
          <div class="dish-modal-media">
            <img src="${dish.image}" alt="${escapeHtml(dish.name)}" class="dish-modal-img">
            <div class="dish-modal-badges">
              <span class="dietary-marker dietary-${dish.dietary}">
                <span class="dietary-symbol"></span>
              </span>
              <span class="badge badge-neutral">${dish.spiceLevel.toUpperCase()} SPICE</span>
            </div>
          </div>

          <div class="dish-modal-details">
            <div class="dish-modal-header">
              <h2 class="dish-modal-title font-serif">${escapeHtml(dish.name)}</h2>
              <div class="dish-modal-base-price font-serif">${formatCurrency(dish.price)}</div>
            </div>

            <p class="dish-modal-desc text-muted">${escapeHtml(dish.description || dish.shortDescription)}</p>

            ${dish.story ? `<div class="dish-modal-story-box text-xs"><strong>Culinary Note:</strong> ${escapeHtml(dish.story)}</div>` : ''}

            <!-- Variants Selector -->
            ${dish.variants && dish.variants.length > 0 ? `
              <div class="modal-section mb-4">
                <label class="modal-section-title">Portion & Preparation</label>
                <div class="variant-options-list">
                  ${dish.variants.map(variant => `
                    <label class="variant-option-card ${selectedVariantId === variant.id ? 'is-selected' : ''}">
                      <input type="radio" name="modal_variant" value="${variant.id}" ${selectedVariantId === variant.id ? 'checked' : ''}>
                      <span class="variant-name">${escapeHtml(variant.name)}</span>
                      <span class="variant-price">${variant.priceDiff > 0 ? `+${formatCurrency(variant.priceDiff)}` : 'Included'}</span>
                    </label>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Add-ons Selector -->
            ${dish.addOns && dish.addOns.length > 0 ? `
              <div class="modal-section mb-4">
                <label class="modal-section-title">Accompaniments & Add-ons (Optional)</label>
                <div class="addon-options-list">
                  ${dish.addOns.map(addon => `
                    <label class="addon-option-card ${selectedAddOnIds.includes(addon.id) ? 'is-selected' : ''}">
                      <input type="checkbox" name="modal_addon" value="${addon.id}" ${selectedAddOnIds.includes(addon.id) ? 'checked' : ''}>
                      <span class="addon-name">${escapeHtml(addon.name)}</span>
                      <span class="addon-price">+${formatCurrency(addon.price)}</span>
                    </label>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Special Instructions -->
            <div class="modal-section mb-4">
              <label for="modal-instructions" class="modal-section-title">Special Cooking Instructions</label>
              <input type="text" id="modal-instructions" class="form-input" placeholder="e.g. Less spicy, well-done, extra coriander..." maxlength="120">
            </div>

            <!-- Footer with Stepper & Add to Cart -->
            <div class="modal-footer-action">
              <div class="qty-stepper qty-stepper-lg">
                <button type="button" class="qty-btn" id="modal-qty-decrease">−</button>
                <span class="qty-val" id="modal-qty-display">${modalQuantity}</span>
                <button type="button" class="qty-btn" id="modal-qty-increase">+</button>
              </div>

              <button type="button" class="btn btn-primary btn-lg flex-1" id="modal-add-to-cart-btn">
                Add to Order Basket • <span id="modal-total-display">${formatCurrency(totalModalPrice)}</span>
              </button>
            </div>
          </div>
        </div>
      `;

      // Attach dynamic event handlers inside modal
      modalBody.querySelectorAll('input[name="modal_variant"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
          selectedVariantId = e.target.value;
          renderModalForm();
        });
      });

      modalBody.querySelectorAll('input[name="modal_addon"]').forEach(cb => {
        cb.addEventListener('change', (e) => {
          if (e.target.checked) {
            if (!selectedAddOnIds.includes(e.target.value)) {
              selectedAddOnIds.push(e.target.value);
            }
          } else {
            selectedAddOnIds = selectedAddOnIds.filter(id => id !== e.target.value);
          }
          renderModalForm();
        });
      });

      modalBody.querySelector('#modal-qty-decrease').addEventListener('click', () => {
        if (modalQuantity > 1) {
          modalQuantity--;
          renderModalForm();
        }
      });

      modalBody.querySelector('#modal-qty-increase').addEventListener('click', () => {
        if (modalQuantity < 15) {
          modalQuantity++;
          renderModalForm();
        }
      });

      modalBody.querySelector('#modal-add-to-cart-btn').addEventListener('click', () => {
        const instructions = modalBody.querySelector('#modal-instructions') 
          ? modalBody.querySelector('#modal-instructions').value 
          : '';

        CartService.addItem(dish.id, selectedVariantId, selectedAddOnIds, instructions, modalQuantity);
        closeModal('dish-customize-modal');
        showToast(`Added ${modalQuantity}× ${dish.name} to your basket!`, 'success');
      });
    };

    renderModalForm();
    openModal('dish-customize-modal');
  }
};
