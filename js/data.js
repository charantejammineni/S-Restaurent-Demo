/**
 * Srestaurents — Sample Menu Data & Demo Seeds
 * All dishes, seed orders, and reservations are strictly sample data.
 */

const SEED_DATA = {
  categories: [
    { id: 'all', name: 'Full Repertoire', icon: '🍽️', count: 16 },
    { id: 'starters', name: 'Small Plates & Grills', icon: '🍢', count: 4 },
    { id: 'biryani', name: 'Royal Awadhi Biryani', icon: '🍲', count: 2 },
    { id: 'curries', name: 'Slow-Simmered Curries', icon: '🍛', count: 4 },
    { id: 'breads', name: 'Artisanal Clay Oven Breads', icon: '🫓', count: 2 },
    { id: 'pan-asian', name: 'Pan-Asian & Global Curations', icon: '🥢', count: 2 },
    { id: 'desserts', name: 'Confections & Coolers', icon: '🍨', count: 2 }
  ],

  dishes: [
    {
      id: 'dish-awadhi-biryani',
      name: 'Awadhi Murgh Dum Biryani',
      category: 'biryani',
      price: 545,
      dietary: 'non-veg',
      spiceLevel: 'medium',
      featured: true,
      bestseller: true,
      chefSpecial: true,
      available: true,
      image: 'assets/images/biryani_awadhi.jpg',
      shortDescription: 'Long-grain Dehradun aged basmati, slow-steamed in a sealed dough handi with saffron, tender chicken, and caramelized shallots.',
      description: 'An ode to Lucknow\'s royal kitchens. Free-range chicken marinated in stone-ground spices, aged yogurt, and Kashmiri saffron, layered with two-year aged fragrant basmati rice. Sealed with wheat dough and cooked over slow charcoal embers for four hours to let the aromatics infuse every grain.',
      story: 'Crafted using the ancient Dum Pukht (slow steam) technique passed down from Awadhi royal bawarchis.',
      preparationTime: '25-30 mins',
      servingSize: 'Serves 1-2 (550g)',
      calories: '680 kcal',
      allergens: ['Dairy', 'Nuts'],
      ingredients: ['Aged Basmati Rice', 'Farm Chicken', 'Kashmiri Saffron', 'Kewra Water', 'Caramelized Onions', 'Pure Desi Ghee'],
      variants: [
        { id: 'regular', name: 'Regular Handi (Serves 1-2)', priceDiff: 0, isDefault: true },
        { id: 'large', name: 'Royal Family Degchi (Serves 3-4)', priceDiff: 380 },
        { id: 'boneless', name: 'Boneless Succulent Breast & Thigh', priceDiff: 65 }
      ],
      addOns: [
        { id: 'burani-raita', name: 'Smoked Burani Garlic Raita', price: 65 },
        { id: 'mirchi-salan', name: 'Hyderabadi Salan Gravy', price: 75 },
        { id: 'laccha-onion', name: 'Spiced Laccha Onion & Lime Wedge', price: 30 }
      ]
    },

    {
      id: 'dish-dal-makhani',
      name: '24-Hour Slow-Cooked Dal Makhani',
      category: 'curries',
      price: 425,
      dietary: 'veg',
      spiceLevel: 'mild',
      featured: true,
      bestseller: true,
      chefSpecial: false,
      available: true,
      image: 'assets/images/dal_makhani.jpg',
      shortDescription: 'Black urad lentils simmered overnight over slow charcoal embers, finished with farm-churned white butter and vine-ripened tomatoes.',
      description: 'Our signature vegetarian masterpiece. Whole black lentils and kidney beans slow-simmered for twenty-four continuous hours on charcoal with stone-ground Tellicherry peppercorns, fresh tomato reduction, and generous dollops of artisanal white butter. Velvety, deeply smoky, and comforting.',
      story: 'A tribute to classical northern dhabas elevated with cold-pressed butter and sweet sun-ripened tomatoes.',
      preparationTime: '15-20 mins',
      servingSize: 'Serves 2 (400g)',
      calories: '490 kcal',
      allergens: ['Dairy'],
      ingredients: ['Whole Black Urad Lentils', 'Farm Churned White Butter', 'Tomato Puree', 'Smoked Degi Mirch', 'Kasuri Methi'],
      variants: [
        { id: 'standard', name: 'Classic Bowl (Serves 2)', priceDiff: 0, isDefault: true },
        { id: 'pot', name: 'Clay Handi (Serves 3-4)', priceDiff: 210 }
      ],
      addOns: [
        { id: 'extra-makhan', name: 'Artisanal White Butter Quenelle', price: 45 },
        { id: 'ginger-julienne', name: 'Crisp Ginger Juliennes & Green Chillies', price: 20 },
        { id: 'tandoori-roti', name: 'Clay Oven Whole Wheat Roti (2 pcs)', price: 60 }
      ]
    },

    {
      id: 'dish-butter-chicken',
      name: 'Murgh Makhani 1950',
      category: 'curries',
      price: 565,
      dietary: 'non-veg',
      spiceLevel: 'mild',
      featured: true,
      bestseller: true,
      chefSpecial: true,
      available: true,
      image: 'assets/images/butter_chicken.jpg',
      shortDescription: 'Chargrilled boneless tandoori chicken tikka tossed in a velvety, buttery tomato gravy scented with sun-dried kasuri methi.',
      description: 'The definitive Butter Chicken, prepared faithfully without shortcuts or artificial sugar. Tender boneless chicken pieces are first smoked in the clay tandoor, then gently folded into a silky reduction of ripe San Marzano tomatoes, cashew paste, rich A2 cream, and crushed dried fenugreek leaves.',
      story: 'Inspired by the original 1950 post-partition Delhi recipe, balanced between tangy tomato brightness and indulgent silk.',
      preparationTime: '20 mins',
      servingSize: 'Serves 2 (450g)',
      calories: '610 kcal',
      allergens: ['Dairy', 'Tree Nuts (Cashew)'],
      ingredients: ['Tandoori Smoked Chicken', 'Tomato Concasse', 'Cashew Cream', 'A2 Butter', 'Kasuri Methi', 'Cardamom'],
      variants: [
        { id: 'boneless', name: 'Boneless Classic Tikka', priceDiff: 0, isDefault: true },
        { id: 'shredded', name: 'Old Delhi Pulled Shredded Chicken', priceDiff: 25 },
        { id: 'large-portion', name: 'Family Degchi (Serves 3-4)', priceDiff: 390 }
      ],
      addOns: [
        { id: 'garlic-naan', name: 'Pair with Garlic Naan', price: 95 },
        { id: 'extra-gravy', name: 'Extra Makhani Gravy Bowl', price: 120 },
        { id: 'sirka-pyaz', name: 'Pickled Baby Shallots (Sirka Pyaz)', price: 35 }
      ]
    },

    {
      id: 'dish-paneer-tikka',
      name: 'Angara Paneer Tikka',
      category: 'starters',
      price: 435,
      dietary: 'veg',
      spiceLevel: 'medium',
      featured: true,
      bestseller: false,
      chefSpecial: false,
      available: true,
      image: 'assets/images/paneer_tikka.jpg?v=2',
      shortDescription: 'Cottage cheese steeped in mustard oil, yellow chilli marinade, and roasted gram flour, charred over clay tandoor embers.',
      description: 'Pillowy fresh cottage cheese cubes marinated in pungent stone-pressed mustard oil, sour curd, ajwain seeds, and degi chilli. Skewered with crunchy bell peppers and crisp red onions, grilled at 400°C in our clay oven to achieve smoky charred edges while retaining melt-in-the-mouth tenderness.',
      story: 'Seasoned with hand-pounded mountain salt and wild ajwain sourced directly from Rajasthan.',
      preparationTime: '15 mins',
      servingSize: '6 large skewers (320g)',
      calories: '420 kcal',
      allergens: ['Dairy', 'Mustard'],
      ingredients: ['Fresh Malai Paneer', 'Cold-Pressed Mustard Oil', 'Hung Curd', 'Bell Peppers', 'Ajwain', 'Mint Chutney'],
      variants: [
        { id: 'regular', name: 'Classic Angara Spiced', priceDiff: 0, isDefault: true },
        { id: 'lehsuni', name: 'Roasted Garlic Infused Marinade', priceDiff: 30 }
      ],
      addOns: [
        { id: 'mint-dip', name: 'Anardana Mint Chutney Jar', price: 40 },
        { id: 'rumali', name: 'Soft Handkerchief Rumali Roti', price: 55 }
      ]
    },

    {
      id: 'dish-tandoori-prawns',
      name: 'Charcoal Tandoori Jheenga',
      category: 'starters',
      price: 685,
      dietary: 'non-veg',
      spiceLevel: 'spicy',
      featured: true,
      bestseller: false,
      chefSpecial: true,
      available: true,
      image: 'assets/images/tandoori_prawns.jpg',
      shortDescription: 'Jumbo coastal tiger prawns marinated in yellow chilli, crushed coriander seeds, and charred over sweet mango wood.',
      description: 'Sourced fresh from the Andhra coast, these succulent tiger prawns are tossed in crushed coriander seeds, carom seeds, ginger reduction, and hung yogurt. Charred briefly over red-hot coals so they remain plump, sweet, and bursting with smoky ocean flavor. Served with roasted lime and raw mango relish.',
      story: 'Grilled on long sword skewers inside our heritage copper tandoor at peak heat.',
      preparationTime: '18 mins',
      servingSize: '6 Jumbo Prawns (340g)',
      calories: '380 kcal',
      allergens: ['Crustacean Shellfish', 'Dairy'],
      ingredients: ['Coastal Tiger Prawns', 'Kashmiri Chillies', 'Carom Seeds', 'Roasted Cumin', 'Charred Key Lime'],
      variants: [
        { id: 'half', name: 'Standard Platter (6 Prawns)', priceDiff: 0, isDefault: true },
        { id: 'full', name: 'Grand Feast Platter (10 Prawns)', priceDiff: 420 }
      ],
      addOns: [
        { id: 'kachumber', name: 'Crisp Pomegranate Kachumber', price: 50 },
        { id: 'truffle-dip', name: 'House Smoked Chilli Aioli', price: 60 }
      ]
    },

    {
      id: 'dish-kashmiri-rogan-josh',
      name: 'Slow-Braised Kashmiri Rogan Josh',
      category: 'curries',
      price: 645,
      dietary: 'non-veg',
      spiceLevel: 'medium',
      featured: false,
      bestseller: true,
      chefSpecial: true,
      available: true,
      image: 'assets/images/rogan_josh.jpg',
      shortDescription: 'Tender prime mutton shank slow-braised in aromatic maval flower extract, Kashmiri chilli, and fennel-scented stock.',
      description: 'An authentic preparation honoring the Wazwan tradition. Prime goat meat cut into tender shanks, browned in mustard oil, and simmered with Kashmiri shallots (pran), crushed dried ginger (sonth), and ground fennel (saunf). The striking crimson hue comes naturally from Kashmiri deggi mirch and ratanjyot bark.',
      story: 'Free of onion-garlic fillers; relies purely on whole Kashmiri mountain aromatics and slow marrow rendering.',
      preparationTime: '25 mins',
      servingSize: 'Serves 2 (450g)',
      calories: '580 kcal',
      allergens: ['Dairy'],
      ingredients: ['Tender Goat Shank', 'Ratanjyot Bark Extract', 'Fennel Powder', 'Dried Ginger', 'Mustard Oil'],
      variants: [
        { id: 'standard', name: 'Pot-Roasted Shank & Chops', priceDiff: 0, isDefault: true },
        { id: 'boneless', name: 'Boneless Tender Cutlets', priceDiff: 80 }
      ],
      addOns: [
        { id: 'sheermal', name: 'Saffron Sheermal Sweet Bread', price: 85 },
        { id: 'mooli-akhrot', name: 'Walnut & Radish Doon Chutney', price: 65 }
      ]
    },

    {
      id: 'dish-kebab-platter',
      name: 'Royal Kakori & Galouti Degchi',
      category: 'starters',
      price: 625,
      dietary: 'non-veg',
      spiceLevel: 'medium',
      featured: false,
      bestseller: false,
      chefSpecial: true,
      available: true,
      image: 'assets/images/kebab_platter.jpg',
      shortDescription: 'Melt-in-mouth lamb kebabs tenderized with raw papaya and scented with 16 royal spices, served on mini saffron rotis.',
      description: 'Finely pounded tender young lamb seasoned with smoked clove, rose petal water, roasted gram flour, and stone-ground mace. Griddled over a heavy brass mahi tawa until they surrender to a fork without resistance. Accompanied by mint caviar, ring onions, and miniature Mughlai ulte tawe ke parathas.',
      story: 'Originating from the royal court of Nawab Asad-ud-Daula of Kakori.',
      preparationTime: '20 mins',
      servingSize: '4 Kebabs with 4 Mini Parathas',
      calories: '520 kcal',
      allergens: ['Dairy', 'Gluten', 'Nuts'],
      ingredients: ['Fine Pounded Lamb', 'Raw Papaya Maceration', 'Rose Water', 'Shahi Jeera', 'Desi Ghee'],
      variants: [
        { id: 'classic-mutton', name: 'Mutton Galouti Selection', priceDiff: 0, isDefault: true },
        { id: 'chicken-kakori', name: 'Silken Chicken Kakori Variation', priceDiff: -40 }
      ],
      addOns: [
        { id: 'extra-paratha', name: 'Ulte Tawe Ka Paratha (2 pcs)', price: 70 },
        { id: 'chilli-relish', name: 'Smoked Green Chilli Relish', price: 35 }
      ]
    },

    {
      id: 'dish-samosa-potli',
      name: 'Truffle & Green Pea Potli Samosa',
      category: 'starters',
      price: 345,
      dietary: 'veg',
      spiceLevel: 'mild',
      featured: false,
      bestseller: false,
      chefSpecial: false,
      available: true,
      image: 'assets/images/samosa_truffle.jpg',
      shortDescription: 'Crisp hand-tied money bags filled with spiced baby green peas, roasted cashews, and a whisper of white truffle essence.',
      description: 'A contemporary artisanal reinvention of India\'s beloved street tea-snack. Flaky pastry pouches hand-pleated and filled with fresh sweet green peas, roasted cumin, pomegranate seeds, and golden cashews, finished with a subtle drizzle of white truffle oil. Served with tamarind jaggery reduction and fresh coriander coulis.',
      story: 'Handmade fresh twice daily before each lunch and dinner seating.',
      preparationTime: '12 mins',
      servingSize: '4 Handcrafted Potlis',
      calories: '360 kcal',
      allergens: ['Gluten', 'Tree Nuts'],
      ingredients: ['Organic Sweet Peas', 'Truffle Essence', 'Ajwain Pastry', 'Cashews', 'Tamarind Reduction'],
      variants: [
        { id: '4pcs', name: 'Petite Portion (4 pcs)', priceDiff: 0, isDefault: true },
        { id: '8pcs', name: 'Sharing Platter (8 pcs)', priceDiff: 260 }
      ],
      addOns: [
        { id: 'extra-saunth', name: 'Spiced Tamarind Saunth Chutney Jar', price: 35 }
      ]
    },

    {
      id: 'dish-lotus-stem',
      name: 'Crispy Honey Chilli Lotus Stem',
      category: 'pan-asian',
      price: 395,
      dietary: 'veg',
      spiceLevel: 'medium',
      featured: true,
      bestseller: true,
      chefSpecial: false,
      available: true,
      image: 'assets/images/lotus_stem.jpg',
      shortDescription: 'Sliced lotus root crisped in a wok, glazed with organic wild honey, toasted sesame seeds, and crushed Sichuan chillies.',
      description: 'Thinly sliced tender lotus root crisped to a golden crunch, tossed in a roaring wok with organic forest honey, garlic flakes, toasted white sesame seeds, and cracked Sichuan peppercorns. A striking balance of sticky sweetness, crunch, and tingling numbing spice.',
      story: 'A fan favorite from our Pan-Asian wok section combining Kashmiri lotus root with Sichuan fire.',
      preparationTime: '15 mins',
      servingSize: 'Serves 2 (280g)',
      calories: '340 kcal',
      allergens: ['Sesame', 'Soy'],
      ingredients: ['Fresh Lotus Root', 'Wild Forest Honey', 'Sichuan Pepper', 'White Sesame', 'Garlic Crunch'],
      variants: [
        { id: 'regular', name: 'Honey Chilli Classic', priceDiff: 0, isDefault: true },
        { id: 'extra-crisp', name: 'Smoky Burnt Garlic Toss', priceDiff: 25 }
      ],
      addOns: [
        { id: 'dip-scallion', name: 'Ginger Scallion Dipping Oil', price: 40 }
      ]
    },

    {
      id: 'dish-truffle-dimsum',
      name: 'Steamed Edamame & Truffle Dim Sum',
      category: 'pan-asian',
      price: 485,
      dietary: 'veg',
      spiceLevel: 'mild',
      featured: false,
      bestseller: false,
      chefSpecial: true,
      available: true,
      image: 'assets/images/dim_sum.jpg',
      shortDescription: 'Translucent crystal dumplings stuffed with young edamame beans, wild forest mushrooms, and Italian white truffle oil.',
      description: 'Delicate wheat-starch wrappers hand-pinched and steamed in bamboo baskets. Filled with tender edamame mash, water chestnuts for crunch, shiitake caps, and a judicious splash of white truffle oil. Served with chili crisp and black vinegar dip.',
      story: 'Steamed to order in traditional tiered bamboo steamers.',
      preparationTime: '16 mins',
      servingSize: '6 Dumplings (Bamboo Steamer)',
      calories: '280 kcal',
      allergens: ['Gluten', 'Soy'],
      ingredients: ['Young Edamame', 'Shiitake Mushroom', 'Truffle Essence', 'Wheat Starch', 'Chili Crisp'],
      variants: [
        { id: 'steamer-6', name: 'Basket of 6 Dumplings', priceDiff: 0, isDefault: true },
        { id: 'steamer-10', name: 'Basket of 10 Dumplings', priceDiff: 270 }
      ],
      addOns: [
        { id: 'chilli-crisp-jar', name: 'House Crisp Chilli Crunch Jar', price: 55 }
      ]
    },

    {
      id: 'dish-thai-green-curry',
      name: 'Bangkok Lemongrass Green Curry',
      category: 'pan-asian',
      price: 525,
      dietary: 'veg',
      spiceLevel: 'medium',
      featured: false,
      bestseller: false,
      chefSpecial: false,
      available: true,
      image: 'assets/images/thai_curry.jpg',
      shortDescription: 'Fresh galangal, kaffir lime leaves, and green chillies crushed with creamy coconut milk, baby corn, and Thai basil.',
      description: 'Fresh coconut milk infused with our own hand-pounded paste of fresh green birds eye chillies, lemongrass stalks, kaffir lime zest, and galangal. Simmered with tender zucchini, bamboo shoots, and fragrant sweet Thai basil. Served with steamed jasmine rice.',
      story: 'Our multi-cuisine team sources fresh Thai herbs weekly for authentic brightness.',
      preparationTime: '20 mins',
      servingSize: 'Curry Bowl + Jasmine Rice (500g total)',
      calories: '510 kcal',
      allergens: ['Coconut'],
      ingredients: ['Fresh Coconut Milk', 'Thai Basil', 'Kaffir Lime Leaves', 'Baby Corn', 'Bamboo Shoots', 'Jasmine Rice'],
      variants: [
        { id: 'tofu-veg', name: 'Silken Tofu & Farm Vegetables', priceDiff: 0, isDefault: true },
        { id: 'chicken', name: 'Free-Range Chicken Breast', priceDiff: 75 },
        { id: 'prawns', name: 'Fresh Water Coastal Prawns', priceDiff: 140 }
      ],
      addOns: [
        { id: 'extra-jasmine-rice', name: 'Extra Fragrant Jasmine Rice Bowl', price: 90 }
      ]
    },

    {
      id: 'dish-truffle-naan',
      name: 'Artisanal Truffle & Garlic Naan Basket',
      category: 'breads',
      price: 245,
      dietary: 'veg',
      spiceLevel: 'mild',
      featured: true,
      bestseller: true,
      chefSpecial: false,
      available: true,
      image: 'assets/images/truffle_naan.jpg',
      shortDescription: 'Fermented dough slapped onto glowing clay oven walls, brushed with clarified A2 butter, burnt garlic, and white truffle glaze.',
      description: 'Crafted using a natural 36-hour mother sourdough starter. Fermented slowly, hand-stretched, and slapped onto red-hot earthen tandoor walls until blistered and charred. Brushed immediately upon exit with churned A2 desi butter, micro-diced garlic crisps, and a drizzle of white truffle oil.',
      story: 'Baked fresh in 90 seconds flat inside our traditional subterranean clay pit.',
      preparationTime: '8 mins',
      servingSize: 'Basket of 2 Handcrafted Naans',
      calories: '310 kcal',
      allergens: ['Dairy', 'Gluten'],
      ingredients: ['Aged Wheat Flour', 'Desi A2 Butter', 'Charred Garlic', 'Truffle Oil', 'Nigella Seeds'],
      variants: [
        { id: 'truffle-garlic', name: 'Truffle & Burnt Garlic (2 pcs)', priceDiff: 0, isDefault: true },
        { id: 'chilli-cheese', name: 'Aged Cheddar & Green Chilli Stuffed', priceDiff: 50 },
        { id: 'amritsari-kulcha', name: 'Spiced Potato & Anardana Kulcha', priceDiff: 40 }
      ],
      addOns: [
        { id: 'white-butter', name: 'Side of Churned White Butter', price: 35 }
      ]
    },

    {
      id: 'dish-gulab-jamun',
      name: 'Warm Shahi Gulab Jamun & Rose Rabri',
      category: 'desserts',
      price: 295,
      dietary: 'veg',
      spiceLevel: 'mild',
      featured: true,
      bestseller: true,
      chefSpecial: true,
      available: true,
      image: 'assets/images/gulab_jamun.jpg',
      shortDescription: 'Slow-fried reduced milk dumplings soaked in green cardamom and rose syrup, served warm over chilled saffron rabri.',
      description: 'Made strictly with house-reduced full-fat cow\'s milk khoya and a hint of fresh chenna. Hand-rolled without flour fillers, gently fried in pure desi ghee over low heat until mahogany brown, and soaked in light saffron-rose syrup. Nestled on a bed of chilled, thickened saffron rabri and sprinkled with toasted Iranian pistachios.',
      story: 'A dessert that needs no introduction, perfected by our master halwai.',
      preparationTime: '10 mins',
      servingSize: '2 Royal Jamuns with Saffron Rabri',
      calories: '420 kcal',
      allergens: ['Dairy', 'Nuts (Pistachio, Almond)'],
      ingredients: ['Cow Milk Khoya', 'Pure Desi Ghee', 'Saffron Rabri', 'Damask Rose Water', 'Iranian Pistachios'],
      variants: [
        { id: 'duo', name: 'Royal Duo (2 pcs with Rabri)', priceDiff: 0, isDefault: true },
        { id: 'family-4', name: 'Family Degchi (4 pcs with Rabri)', priceDiff: 220 }
      ],
      addOns: [
        { id: 'extra-pistachio', name: 'Extra Crushed Pistachios & Silver Vark', price: 40 }
      ]
    },

    {
      id: 'dish-mango-kulfi',
      name: 'Old Delhi Mango Kulfi Falooda',
      category: 'desserts',
      price: 315,
      dietary: 'veg',
      spiceLevel: 'mild',
      featured: false,
      bestseller: false,
      chefSpecial: false,
      available: true,
      image: 'assets/images/mango_kulfi.jpg',
      shortDescription: 'Slow-churned Alphonso mango kulfi slice, hand-pressed cornstarch vermicelli, sweet basil seeds, and organic rose syrup.',
      description: 'Fresh Ratnagiri Alphonso mango pulp churned into dense, velvety traditional kulfi. Sliced onto a crystal glass dish, layered with silky cold falooda noodles, chilled sabja (sweet basil) seeds, and drizzled with organic rooh rose essence and condensed milk.',
      story: 'Handcrafted using copper molds frozen in a classic salt-and-ice chest.',
      preparationTime: '8 mins',
      servingSize: 'Individual Sundae Bowl',
      calories: '360 kcal',
      allergens: ['Dairy'],
      ingredients: ['Alphonso Mango Pulp', 'Reduced Buffalo Milk', 'Falooda Vermicelli', 'Sweet Basil Seeds', 'Rose Syrup'],
      variants: [
        { id: 'alphonso', name: 'Alphonso Mango', priceDiff: 0, isDefault: true },
        { id: 'malai-pista', name: 'Royal Malai & Roasted Pista', priceDiff: 0 }
      ],
      addOns: [
        { id: 'extra-rabri-drizzle', name: 'Ladle of Thick Rabri Drizzle', price: 45 }
      ]
    },

    {
      id: 'dish-kokum-cooler',
      name: 'Smoked Kokum & Lychee Botanical Shikanji',
      category: 'desserts',
      price: 245,
      dietary: 'veg',
      spiceLevel: 'mild',
      featured: false,
      bestseller: false,
      chefSpecial: false,
      available: true,
      image: 'assets/images/mocktail_cooler.jpg',
      shortDescription: 'Sun-dried Konkan kokum fruit infused with sweet litchi juice, black salt, fresh mint sprigs, and crushed ice.',
      description: 'An artisanal Indian botanical cooler. Sun-dried tart kokum from the Malabar coast is lightly smoked over cloves, blended with sweet organic lychee nectar, bruised garden mint, black rock salt, and effervescent sparkling soda. Deeply refreshing and naturally digestive.',
      story: 'Inspired by traditional coastal sun-steeped digestive cordials.',
      preparationTime: '5 mins',
      servingSize: '350ml Tall Crystal Goblet',
      calories: '110 kcal',
      allergens: [],
      ingredients: ['Konkan Kokum Rind', 'Lychee Nectar', 'Kala Namak', 'Garden Mint', 'Sparkling Mineral Soda'],
      variants: [
        { id: 'sparkling', name: 'Sparkling Soda Spritz', priceDiff: 0, isDefault: true },
        { id: 'still', name: 'Still Spring Water Infusion', priceDiff: 0 }
      ],
      addOns: [
        { id: 'chia-seeds', name: 'Infused Sweet Basil (Sabja) Seeds', price: 25 }
      ]
    },

    {
      id: 'dish-kulhad-chai',
      name: 'Hand-Brewed Kulhad Masala Chai',
      category: 'desserts',
      price: 185,
      dietary: 'veg',
      spiceLevel: 'mild',
      featured: false,
      bestseller: false,
      chefSpecial: false,
      available: true,
      image: 'assets/images/masala_chai.jpg',
      shortDescription: 'Single-estate Assam orthodox tea leaves slow-simmered with crushed green cardamom, ginger root, and served in terracotta clay cups.',
      description: 'The soul of Indian hospitality. Premium second-flush Assam tea leaves slow-boiled with whole milk, crushed ginger rhizome, green cardamom, cinnamon quills, and cloves. Poured hot from a height into fresh unglazed terracotta kulhads that impart an irreplaceable earthy scent to every sip.',
      story: 'Boiled thrice in brass kettles to extract the deep tea tannins and warmth.',
      preparationTime: '10 mins',
      servingSize: 'Serves 2 in Earthen Kulhads',
      calories: '140 kcal',
      allergens: ['Dairy'],
      ingredients: ['Assam Orthodox Tea', 'Fresh Ginger', 'Green Cardamom', 'Whole Milk', 'Terracotta Clay Vessel'],
      variants: [
        { id: 'kadak', name: 'Traditional Kadak Masala', priceDiff: 0, isDefault: true },
        { id: 'adrak-special', name: 'Winter Extra Fresh Adrak (Ginger)', priceDiff: 15 }
      ],
      addOns: [
        { id: 'biscuit', name: 'House Baked Osmania Tea Biscuits (4 pcs)', price: 40 }
      ]
    }
  ],

  // Seed sample orders for immediate demonstration in Admin & Tracking
  seedOrders: [
    {
      id: 'SR-2026-9042',
      customer: {
        name: 'Aarav Sharma',
        phone: '+91 98450 11223',
        email: 'aarav.sharma@example.com',
        deliveryType: 'delivery',
        address: {
          line1: 'Flat 402, Royal Palms Residency',
          line2: 'Road No. 10, Banjara Hills',
          landmark: 'Opposite Heritage Park',
          city: 'Hyderabad',
          pincode: '500034'
        },
        instructions: 'Please do not ring the bell, leave with security gate.'
      },
      items: [
        {
          dishId: 'dish-awadhi-biryani',
          name: 'Awadhi Murgh Dum Biryani',
          variantName: 'Regular Handi (Serves 1-2)',
          addOns: ['Smoked Burani Garlic Raita'],
          instructions: 'Medium spice level, extra fried onions please',
          unitPrice: 610,
          quantity: 2,
          totalPrice: 1220
        },
        {
          dishId: 'dish-dal-makhani',
          name: '24-Hour Slow-Cooked Dal Makhani',
          variantName: 'Classic Bowl (Serves 2)',
          addOns: [],
          instructions: '',
          unitPrice: 425,
          quantity: 1,
          totalPrice: 425
        },
        {
          dishId: 'dish-truffle-naan',
          name: 'Artisanal Truffle & Garlic Naan Basket',
          variantName: 'Truffle & Burnt Garlic (2 pcs)',
          addOns: [],
          instructions: '',
          unitPrice: 245,
          quantity: 2,
          totalPrice: 490
        }
      ],
      pricingSnapshot: {
        subtotal: 2135,
        discount: 250, // Promo FEAST20
        promoCode: 'FEAST20',
        packagingFee: 35,
        deliveryFee: 0, // Free above ₹850
        gst: 94.25, // 5% of (subtotal - discount)
        grandTotal: 2014.25
      },
      payment: {
        method: 'upi_mock',
        methodLabel: 'Simulated UPI (Mock GPay)',
        status: 'Paid (Demo Simulation)',
        transactionId: 'UPI-SIM-839219',
        isSimulation: true
      },
      status: 'preparing', // placed, confirmed, preparing, out-for-delivery, completed
      timeline: [
        { status: 'placed', label: 'Order Placed', time: '18:15', note: 'Order received via online atelier.' },
        { status: 'confirmed', label: 'Kitchen Confirmed', time: '18:18', note: 'Chef Vikramaditya approved docket.' },
        { status: 'preparing', label: 'Simmering in Kitchen', time: '18:22', note: 'Handis sealed and cooking over charcoal.' }
      ],
      createdAt: '2026-10-24T18:15:00.000Z',
      deliveryPartner: {
        name: 'Ramesh K.',
        vehicle: 'Ather 450X (TS 09 EU 4210)',
        rating: '4.9 ★',
        phone: '+91 98765 00112 (Demo Relay)'
      }
    },
    {
      id: 'SR-2026-8814',
      customer: {
        name: 'Priya Patel',
        phone: '+91 97110 33445',
        email: 'priya.patel@example.com',
        deliveryType: 'takeaway',
        pickupTime: '19:45 PM (Today)',
        instructions: 'Will pick up in car, call when ready curbside.'
      },
      items: [
        {
          dishId: 'dish-paneer-tikka',
          name: 'Angara Paneer Tikka',
          variantName: 'Classic Angara Spiced',
          addOns: ['Anardana Mint Chutney Jar'],
          instructions: 'Mild spice',
          unitPrice: 475,
          quantity: 1,
          totalPrice: 475
        },
        {
          dishId: 'dish-gulab-jamun',
          name: 'Warm Shahi Gulab Jamun & Rose Rabri',
          variantName: 'Royal Duo (2 pcs with Rabri)',
          addOns: [],
          instructions: '',
          unitPrice: 295,
          quantity: 1,
          totalPrice: 295
        }
      ],
      pricingSnapshot: {
        subtotal: 770,
        discount: 50,
        promoCode: 'SREST50',
        packagingFee: 35,
        deliveryFee: 0,
        gst: 36.00,
        grandTotal: 791.00
      },
      payment: {
        method: 'pay_at_pickup',
        methodLabel: 'Pay on Pickup (Curbside Demo)',
        status: 'Pending at Counter',
        isSimulation: true
      },
      status: 'out-for-delivery', // In takeaway terms: Ready for Pickup
      timeline: [
        { status: 'placed', label: 'Order Placed', time: '17:30', note: 'Customer scheduled pickup.' },
        { status: 'confirmed', label: 'Confirmed', time: '17:32', note: 'Packaged in warm thermal bag.' },
        { status: 'preparing', label: 'Freshly Assembled', time: '17:45', note: 'Chef plating completed.' },
        { status: 'out-for-delivery', label: 'Ready for Pickup at Desk', time: '17:55', note: 'Dossier ready at Valet Pickup counter.' }
      ],
      createdAt: '2026-10-24T17:30:00.000Z'
    },
    {
      id: 'SR-2026-7490',
      customer: {
        name: 'Vikram Malhotra',
        phone: '+91 99880 77665',
        email: 'vikram.m@example.com',
        deliveryType: 'delivery',
        address: {
          line1: 'Villa 12, Boulder Hills Golf County',
          line2: 'Gachibowli',
          landmark: 'Near Club House',
          city: 'Hyderabad',
          pincode: '500032'
        }
      },
      items: [
        {
          dishId: 'dish-kashmiri-rogan-josh',
          name: 'Slow-Braised Kashmiri Rogan Josh',
          variantName: 'Pot-Roasted Shank & Chops',
          addOns: ['Saffron Sheermal Sweet Bread'],
          unitPrice: 730,
          quantity: 1,
          totalPrice: 730
        }
      ],
      pricingSnapshot: {
        subtotal: 730,
        discount: 0,
        packagingFee: 35,
        deliveryFee: 50,
        gst: 36.50,
        grandTotal: 851.50
      },
      payment: {
        method: 'cod_mock',
        methodLabel: 'Cash on Delivery (Demo COD)',
        status: 'Completed (Demo)',
        isSimulation: true
      },
      status: 'completed',
      timeline: [
        { status: 'placed', label: 'Order Placed', time: '13:00' },
        { status: 'confirmed', label: 'Confirmed', time: '13:05' },
        { status: 'preparing', label: 'Cooking', time: '13:20' },
        { status: 'out-for-delivery', label: 'Out for Delivery', time: '13:40' },
        { status: 'completed', label: 'Delivered', time: '14:05', note: 'Handed over warm to customer.' }
      ],
      createdAt: '2026-10-24T13:00:00.000Z'
    }
  ],

  // Seed sample reservations for immediate demonstration
  seedReservations: [
    {
      id: 'RES-2026-301',
      guestName: 'Ananya Deshmukh',
      phone: '+91 98200 55443',
      email: 'ananya.d@example.com',
      date: '2026-10-25',
      timeSlot: '08:30 PM',
      partySize: 4,
      seatingArea: 'Heritage Courtyard',
      occasion: 'Anniversary Celebration',
      specialRequests: 'Quiet corner table near the stone fountain, celebrate with complimentary dessert candle.',
      status: 'confirmed', // pending, confirmed, seated, cancelled
      createdAt: '2026-10-23T14:30:00.000Z',
      tableAssigned: 'Table C-04'
    },
    {
      id: 'RES-2026-302',
      guestName: 'Dr. Siddharth Rao',
      phone: '+91 97000 88991',
      email: 'siddharth.rao@example.com',
      date: '2026-10-25',
      timeSlot: '01:15 PM',
      partySize: 2,
      seatingArea: 'Intimate Dining Hall',
      occasion: 'Executive Lunch',
      specialRequests: 'High acoustic comfort area for business discussion.',
      status: 'confirmed',
      createdAt: '2026-10-24T09:15:00.000Z',
      tableAssigned: 'Table D-02'
    },
    {
      id: 'RES-2026-303',
      guestName: 'Meera Nambiar',
      phone: '+91 99400 12345',
      email: 'meera.n@example.com',
      date: '2026-10-26',
      timeSlot: '07:45 PM',
      partySize: 8,
      seatingArea: 'Royal Private Dining Room',
      occasion: 'Family Birthday Feast',
      specialRequests: 'Two elderly guests, require easy access without stairs. High chair for toddler.',
      status: 'pending',
      createdAt: '2026-10-24T11:00:00.000Z',
      tableAssigned: 'PDR-01'
    }
  ],

  // Demo user personas for presentation
  demoPersonas: [
    {
      id: 'user-aarav',
      name: 'Aarav Sharma',
      phone: '+91 98450 11223',
      email: 'aarav.sharma@example.com',
      tier: 'Epicurean Club Member (Demo)',
      ordersCount: 3,
      reservationsCount: 1,
      addresses: [
        {
          id: 'addr-1',
          tag: 'Home',
          line1: 'Flat 402, Royal Palms Residency',
          line2: 'Road No. 10, Banjara Hills',
          landmark: 'Opposite Heritage Park',
          city: 'Hyderabad',
          pincode: '500034',
          isDefault: true
        },
        {
          id: 'addr-2',
          tag: 'Studio / Work',
          line1: 'Cyber Towers, Suite 508',
          line2: 'Hitec City, Madhapur',
          landmark: 'Near Metro Station',
          city: 'Hyderabad',
          pincode: '500081',
          isDefault: false
        }
      ],
      favorites: ['dish-awadhi-biryani', 'dish-dal-makhani', 'dish-truffle-naan']
    },
    {
      id: 'user-priya',
      name: 'Priya Patel',
      phone: '+91 97110 33445',
      email: 'priya.patel@example.com',
      tier: 'Tasting Guild Member (Demo)',
      ordersCount: 1,
      reservationsCount: 2,
      addresses: [
        {
          id: 'addr-3',
          tag: 'Residence',
          line1: 'House 88, Green Valley Enclave',
          line2: 'Jubilee Hills Road 45',
          city: 'Hyderabad',
          pincode: '500033',
          isDefault: true
        }
      ],
      favorites: ['dish-paneer-tikka', 'dish-lotus-stem', 'dish-gulab-jamun']
    }
  ]
};
