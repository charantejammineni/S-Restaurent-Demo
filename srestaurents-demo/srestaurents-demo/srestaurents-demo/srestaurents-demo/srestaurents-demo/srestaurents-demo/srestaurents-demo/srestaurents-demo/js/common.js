/**
 * Srestaurents — Common UI & Utility Scripts
 * Handles navigation, mobile drawer, toasts, currency formatters, and demo disclaimers.
 */

// Format INR Currency
function formatCurrency(amount) {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  return '₹' + amount.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2
  });
}

// Safe string escaping for HTML injection protection
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Toast Notification Manager
function showToast(message, type = 'success', duration = 3200) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warning' ? '⚠' : 'ℹ';
  
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <div class="toast-content">${escapeHtml(message)}</div>
    <button class="toast-close" aria-label="Close">&times;</button>
  `;

  const removeToast = () => {
    toast.classList.add('toast-fadeout');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 280);
  };

  toast.querySelector('.toast-close').addEventListener('click', removeToast);

  container.appendChild(toast);

  setTimeout(removeToast, duration);
}

// Update Cart Badge in Header
function updateCartBadge() {
  const cartBadges = document.querySelectorAll('.cart-badge');
  const cart = StorageService.getCart();
  const totalCount = (cart.items || []).reduce((sum, item) => sum + (item.quantity || 1), 0);
  
  cartBadges.forEach(badge => {
    badge.textContent = totalCount;
    if (totalCount > 0) {
      badge.classList.remove('is-empty');
      badge.classList.add('has-items');
    } else {
      badge.classList.add('is-empty');
      badge.classList.remove('has-items');
    }
  });

  // Also update any header cart total displays if present
  const cartSubtotals = document.querySelectorAll('.header-cart-subtotal');
  if (cartSubtotals.length > 0 && typeof CartService !== 'undefined') {
    const totals = CartService.calculateTotals();
    cartSubtotals.forEach(el => {
      el.textContent = formatCurrency(totals.subtotal);
    });
  }
}

// Initialize Global Navigation & Common Elements
document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer Toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');

  if (mobileMenuToggle && mobileNav) {
    const toggleMenu = () => {
      const isOpen = mobileNav.classList.toggle('is-active');
      mobileMenuToggle.setAttribute('aria-expanded', isOpen);
      if (mobileNavOverlay) {
        mobileNavOverlay.classList.toggle('is-active', isOpen);
      }
      document.body.classList.toggle('nav-drawer-open', isOpen);
    };

    mobileMenuToggle.addEventListener('click', toggleMenu);
    if (mobileNavOverlay) {
      mobileNavOverlay.addEventListener('click', toggleMenu);
    }

    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileNav.classList.contains('is-active')) {
          toggleMenu();
        }
      });
    });
  }

  // 2. Active Link Highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 3. Sync Cart Count on load
  updateCartBadge();

  // 4. Listen for cart updates
  window.addEventListener('srestaurents:cart-updated', updateCartBadge);

  // 5. Setup Accessible Modals
  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-modal-open');
      openModal(modalId);
    });
  });

  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        closeModal(modal.id);
      }
    });
  });

  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal-overlay.is-open');
      if (openModal) {
        closeModal(openModal.id);
      }
    }
  });

  // 6. Demo Disclaimer Banner Reset Handler
  const resetDemoBtn = document.getElementById('global-reset-demo-btn');
  if (resetDemoBtn) {
    resetDemoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Reset demo data back to default sample state? This will refresh your cart, sample orders, and menu customizations.')) {
        StorageService.resetToDefaults();
        showToast('Demo data restored to initial state!', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 600);
      }
    });
  }
});

// Modal Helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 80);
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
  }
}
