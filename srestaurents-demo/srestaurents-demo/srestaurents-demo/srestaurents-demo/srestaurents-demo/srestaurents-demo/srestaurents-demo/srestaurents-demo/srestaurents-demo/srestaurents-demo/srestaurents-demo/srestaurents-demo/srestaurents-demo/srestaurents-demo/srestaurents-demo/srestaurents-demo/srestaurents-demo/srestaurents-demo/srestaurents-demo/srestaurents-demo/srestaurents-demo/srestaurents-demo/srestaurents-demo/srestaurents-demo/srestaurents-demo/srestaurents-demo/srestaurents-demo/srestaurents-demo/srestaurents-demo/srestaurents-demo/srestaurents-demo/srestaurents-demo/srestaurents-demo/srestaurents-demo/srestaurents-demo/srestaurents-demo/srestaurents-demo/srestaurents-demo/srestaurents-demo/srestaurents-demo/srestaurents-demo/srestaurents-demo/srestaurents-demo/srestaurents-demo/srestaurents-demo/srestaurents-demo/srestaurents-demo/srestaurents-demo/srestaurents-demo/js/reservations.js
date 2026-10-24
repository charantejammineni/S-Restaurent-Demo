/**
 * Srestaurents — Table Reservation Controller
 * Handles table booking, date/slot constraints, conflict prevention,
 * seating area preferences, and confirmation receipts.
 */

const ReservationController = {
  selectedMeal: 'dinner', // lunch or dinner
  selectedSlot: '08:30 PM',
  selectedArea: 'Heritage Courtyard',
  selectedPartySize: 2,

  init() {
    this.setupDateConstraints();
    this.renderTimeSlots();
    this.populateUserDetails();
    this.bindEvents();
  },

  setupDateConstraints() {
    const dateInput = document.getElementById('res-date');
    if (!dateInput) return;

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    dateInput.min = `${yyyy}-${mm}-${dd}`;

    // Max 30 days in future
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);
    const maxY = maxDate.getFullYear();
    const maxM = String(maxDate.getMonth() + 1).padStart(2, '0');
    const maxD = String(maxDate.getDate()).padStart(2, '0');
    dateInput.max = `${maxY}-${maxM}-${maxD}`;

    // Default to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    dateInput.value = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  },

  populateUserDetails() {
    const user = StorageService.getCurrentUser();
    if (!user) return;

    const nameInput = document.getElementById('res-name');
    const phoneInput = document.getElementById('res-phone');
    const emailInput = document.getElementById('res-email');

    if (nameInput && !nameInput.value) nameInput.value = user.name || '';
    if (phoneInput && !phoneInput.value) phoneInput.value = user.phone || '';
    if (emailInput && !emailInput.value) emailInput.value = user.email || '';
  },

  renderTimeSlots() {
    const container = document.getElementById('res-slots-container');
    if (!container) return;

    const slots = this.selectedMeal === 'lunch' 
      ? SRESTAURENTS_CONFIG.timeSlots.lunch 
      : SRESTAURENTS_CONFIG.timeSlots.dinner;

    const selectedDate = document.getElementById('res-date')?.value;
    const existingReservations = StorageService.getReservations();

    container.innerHTML = slots.map(slot => {
      // Check demo capacity
      const bookedCount = existingReservations.filter(r => 
        r.date === selectedDate && 
        r.timeSlot === slot && 
        r.status !== 'cancelled'
      ).length;

      const isFull = bookedCount >= (SRESTAURENTS_CONFIG.maxReservationsPerSlot || 4);
      const isSelected = this.selectedSlot === slot && !isFull;

      return `
        <button type="button" 
          class="slot-chip ${isSelected ? 'is-selected' : ''} ${isFull ? 'is-booked-out' : ''}" 
          data-slot="${slot}" 
          ${isFull ? 'disabled' : ''}>
          <span class="slot-time">${slot}</span>
          <span class="slot-avail text-xs">${isFull ? 'Fully Booked' : `${4 - bookedCount} tables left`}</span>
        </button>
      `;
    }).join('');

    // Attach slot selection
    container.querySelectorAll('.slot-chip:not(.is-booked-out)').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.slot-chip').forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        this.selectedSlot = btn.getAttribute('data-slot');
      });
    });
  },

  bindEvents() {
    // Meal Service Toggle (Lunch vs Dinner)
    document.querySelectorAll('[data-meal-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('[data-meal-tab]').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.selectedMeal = tab.getAttribute('data-meal-tab');
        this.selectedSlot = this.selectedMeal === 'lunch' ? '01:15 PM' : '08:30 PM';
        this.renderTimeSlots();
      });
    });

    // Date change updates slots
    const dateInput = document.getElementById('res-date');
    if (dateInput) {
      dateInput.addEventListener('change', () => {
        this.renderTimeSlots();
      });
    }

    // Party size change
    const partyInput = document.getElementById('res-party-size');
    if (partyInput) {
      partyInput.addEventListener('change', (e) => {
        this.selectedPartySize = parseInt(e.target.value, 10) || 2;
        const pdrHint = document.getElementById('pdr-recommendation-hint');
        if (pdrHint) {
          if (this.selectedPartySize >= 7) {
            pdrHint.classList.remove('hidden');
          } else {
            pdrHint.classList.add('hidden');
          }
        }
      });
    }

    // Seating Area radios
    document.querySelectorAll('input[name="resArea"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.selectedArea = e.target.value;
      });
    });

    // Occasion chips
    document.querySelectorAll('.occasion-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        document.querySelectorAll('.occasion-tag').forEach(t => t.classList.remove('is-selected'));
        tag.classList.add('is-selected');
        const specialInput = document.getElementById('res-requests');
        if (specialInput) {
          const occText = tag.getAttribute('data-occasion');
          if (occText && !specialInput.value.includes(occText)) {
            specialInput.value = specialInput.value ? `${specialInput.value}, ${occText}` : occText;
          }
        }
      });
    });

    // Reservation Form Submit
    const form = document.getElementById('reservation-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitReservation();
      });
    }
  },

  submitReservation() {
    const name = document.getElementById('res-name')?.value.trim();
    const phone = document.getElementById('res-phone')?.value.trim();
    const email = document.getElementById('res-email')?.value.trim();
    const date = document.getElementById('res-date')?.value;
    const specialRequests = document.getElementById('res-requests')?.value.trim() || '';

    if (!name) {
      showToast('Please enter guest name.', 'error');
      document.getElementById('res-name')?.focus();
      return;
    }

    if (!phone || phone.length < 10) {
      showToast('Please provide a valid 10-digit mobile number.', 'error');
      document.getElementById('res-phone')?.focus();
      return;
    }

    if (!email || !email.includes('@')) {
      showToast('Please provide a valid email for the table voucher.', 'error');
      document.getElementById('res-email')?.focus();
      return;
    }

    if (!date) {
      showToast('Please select your preferred dining date.', 'error');
      return;
    }

    if (!this.selectedSlot) {
      showToast('Please pick an available time slot.', 'error');
      return;
    }

    // Conflict & Capacity Verification
    const existing = StorageService.getReservations();
    const conflicts = existing.filter(r => 
      r.date === date && 
      r.timeSlot === this.selectedSlot && 
      r.seatingArea === this.selectedArea && 
      r.status !== 'cancelled'
    );

    if (conflicts.length >= 2) {
      showToast(`Notice: The ${this.selectedArea} is at capacity for ${this.selectedSlot}. Please choose another seating area or slot.`, 'warning');
      return;
    }

    // Generate Booking Reference
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const bookingId = `RES-2026-${randomSuffix}`;

    const newReservation = {
      id: bookingId,
      guestName: name,
      phone,
      email,
      date,
      timeSlot: this.selectedSlot,
      partySize: this.selectedPartySize,
      seatingArea: this.selectedArea,
      occasion: document.querySelector('.occasion-tag.is-selected')?.textContent.trim() || 'Dining Experience',
      specialRequests,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      tableAssigned: `${this.selectedArea.split(' ')[0][0]}-${Math.floor(1 + Math.random() * 8)}`
    };

    StorageService.saveReservation(newReservation);

    // Update user reservations count
    const user = StorageService.getCurrentUser();
    if (user) {
      user.reservationsCount = (user.reservationsCount || 0) + 1;
      StorageService.setCurrentUser(user);
    }

    showToast('Table reservation confirmed!', 'success');
    this.showConfirmationReceipt(newReservation);
  },

  showConfirmationReceipt(res) {
    const container = document.getElementById('reservation-card-wrapper');
    if (!container) return;

    container.innerHTML = `
      <div class="card reservation-confirmed-card p-5 text-center">
        <div class="confirmation-icon-circle mb-3">✓</div>
        <span class="badge badge-success mb-2">Table Reserved · Presentation Demo</span>
        <h2 class="font-serif mb-1">Your Table Awaits, ${escapeHtml(res.guestName)}</h2>
        <p class="text-muted mb-4">We look forward to hosting your culinary feast at Srestaurents.</p>

        <div class="res-voucher-card p-4 text-left mb-4">
          <div class="flex-between align-center mb-3 pb-3 border-bottom">
            <div>
              <span class="text-xs text-muted uppercase font-mono">Booking Dossier</span>
              <div class="font-serif text-xl font-bold text-primary">#${res.id}</div>
            </div>
            <div class="text-right">
              <span class="badge badge-primary">${escapeHtml(res.tableAssigned)}</span>
            </div>
          </div>

          <div class="res-voucher-grid mb-3">
            <div>
              <span class="text-xs text-muted">Dining Date</span>
              <div class="font-medium text-sm">${new Date(res.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
            <div>
              <span class="text-xs text-muted">Time Slot</span>
              <div class="font-medium text-sm text-primary">${res.timeSlot}</div>
            </div>
            <div>
              <span class="text-xs text-muted">Party Size</span>
              <div class="font-medium text-sm">${res.partySize} ${res.partySize === 1 ? 'Guest' : 'Guests'}</div>
            </div>
            <div>
              <span class="text-xs text-muted">Seating Environment</span>
              <div class="font-medium text-sm">${escapeHtml(res.seatingArea)}</div>
            </div>
          </div>

          ${res.specialRequests ? `
            <div class="pt-2 border-top text-xs text-muted">
              <strong>Special Request:</strong> "${escapeHtml(res.specialRequests)}"
            </div>
          ` : ''}
        </div>

        <div class="demo-callout-note text-xs text-muted mb-4">
          ✨ <strong>Demo Table Reservation:</strong> Saved locally in localStorage. You can view or manage this table reservation in the Demo Admin Suite.
        </div>

        <div class="flex-center gap-3">
          <a href="menu.html" class="btn btn-primary">Pre-browse Menu Dishes →</a>
          <button class="btn btn-outline" onclick="window.location.reload()">Book Another Table</button>
        </div>
      </div>
    `;

    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};
