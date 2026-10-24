/**
 * Srestaurents — Central Configuration
 * Multi-Cuisine Culinary Atelier Demo
 * 
 * Note: All data, pricing, and settings here represent a demonstration prototype
 * for review before production development.
 */

const SRESTAURENTS_CONFIG = {
  brand: {
    name: 'Srestaurents',
    tagline: 'Multi-Cuisine Culinary Atelier',
    subtext: 'Heritage Awadhi, Royal Grills, Regional Curries & Pan-Asian Curations',
    currency: '₹',
    currencyCode: 'INR',
    establishedYear: 2024
  },
  
  demoNotice: {
    badge: 'Presentation Demo',
    short: 'Interactive Prototype · Demo Data Only',
    detailed: 'This website is a demonstration prototype. All orders, bookings, and payments are simulated locally in your browser without any real charges or actual food preparation.'
  },

  pricing: {
    gstRate: 0.05, // 5% GST on restaurant food services
    packagingFee: 35, // Eco-friendly temperature-sealed container fee
    deliveryFee: 50, // Standard delivery fee
    freeDeliveryThreshold: 850 // Orders above ₹850 qualify for complimentary delivery
  },

  promoCodes: [
    {
      code: 'WELCOME10',
      description: '10% off on your sample first order (up to ₹150)',
      discountPercent: 10,
      maxDiscount: 150,
      minOrder: 350
    },
    {
      code: 'FEAST20',
      description: '20% off on royal family feasts (up to ₹250)',
      discountPercent: 20,
      maxDiscount: 250,
      minOrder: 750
    },
    {
      code: 'SREST50',
      description: 'Flat ₹50 savings on any multi-cuisine order',
      flatDiscount: 50,
      minOrder: 400
    }
  ],

  restaurant: {
    name: 'Srestaurents Dining & Kitchen',
    street: 'Plot 420, Road No. 36, Jubilee Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    postalCode: '500033',
    country: 'India',
    phone: '+91 98765 43210',
    email: 'namaste@srestaurents.demo',
    supportWhatsApp: '+91 98765 43211',
    hours: {
      lunch: '12:00 PM – 03:30 PM',
      dinner: '07:00 PM – 11:30 PM',
      weekendBrunch: '11:30 AM – 04:00 PM (Sat & Sun)',
      closedNote: 'Open Tuesday through Sunday (Kitchen resets Mondays)'
    },
    features: ['Valet Parking Available', 'Full Bar License (Mock)', 'Private Dining Suites', 'Open-flame Tandoor Kitchen']
  },

  seatingAreas: [
    { id: 'courtyard', name: 'Heritage Courtyard', description: 'Open-air stone terrace under fragrant frangipani trees' },
    { id: 'dining-hall', name: 'Intimate Dining Hall', description: 'Acoustic comfort, warm brass and deep forest upholstery' },
    { id: 'verandah', name: 'Chef\'s Verandah', description: 'Semi-private elevated gallery facing the live charcoal grills' },
    { id: 'pdr', name: 'Royal Private Dining Room', description: 'Secluded banquet table for family feasts or executive dinners (6-12 guests)' }
  ],

  timeSlots: {
    lunch: ['12:30 PM', '01:15 PM', '02:00 PM', '02:45 PM'],
    dinner: ['07:00 PM', '07:45 PM', '08:30 PM', '09:15 PM', '10:00 PM']
  },

  maxReservationsPerSlot: 4 // Demo capacity limiter for conflict checking
};

// Freeze configuration to prevent accidental mutations
if (typeof Object.freeze === 'function') {
  Object.freeze(SRESTAURENTS_CONFIG);
}
