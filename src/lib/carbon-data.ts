export interface ProductCategory {
  id: string;
  name: string;
  icon: string;
  baseCarbon: number;
  shippingFactor: number;
}

export interface ProductData {
  product_name: string;
  category: string;
  weight_kg: number;
  materials: string[];
  price?: string;
  description?: string;
  brand?: string;
  is_eco_friendly?: boolean;
}

export interface SuggestedStoreProduct {
  platform: string;
  productName: string;
  image: string;
  link: string;
  price: string;
  couponCode: string;
  couponLabel: string;
}

export interface ProductRecommendation {
  title: string;
  summary: string;
  estimatedCarbon: number;
  savings: number;
  tags: string[];
  rationale: string;
  storeProduct: SuggestedStoreProduct;
}

export interface RecommendationSet {
  lowCarbon: ProductRecommendation;
  standard: ProductRecommendation;
}

export const categories: ProductCategory[] = [
  { id: 'electronics', name: 'Electronics', icon: '💻', baseCarbon: 25, shippingFactor: 1.2 },
  { id: 'clothing', name: 'Clothing', icon: '👕', baseCarbon: 8, shippingFactor: 0.5 },
  { id: 'books', name: 'Books', icon: '📚', baseCarbon: 2.5, shippingFactor: 0.8 },
  { id: 'furniture', name: 'Furniture', icon: '🪑', baseCarbon: 45, shippingFactor: 3.0 },
  { id: 'food', name: 'Food & Grocery', icon: '🥑', baseCarbon: 3, shippingFactor: 1.5 },
  { id: 'beauty', name: 'Beauty & Care', icon: '🧴', baseCarbon: 5, shippingFactor: 0.6 },
  { id: 'toys', name: 'Toys & Games', icon: '🎮', baseCarbon: 10, shippingFactor: 0.9 },
  { id: 'home', name: 'Home & Garden', icon: '🏡', baseCarbon: 15, shippingFactor: 2.0 },
];

export type ShippingMethod = 'standard' | 'express' | 'overnight';

export const shippingMultipliers: Record<ShippingMethod, { label: string; multiplier: number; icon: string }> = {
  standard: { label: 'Standard (5-7 days)', multiplier: 1.0, icon: '📦' },
  express: { label: 'Express (2-3 days)', multiplier: 1.8, icon: '🚚' },
  overnight: { label: 'Overnight', multiplier: 3.2, icon: '✈️' },
};

const recommendationTemplates: Record<
  string,
  {
    lowCarbon: {
      title: string;
      summary: string;
      tags: string[];
      carbonMultiplier: number;
      rationale: string;
      storeProduct: SuggestedStoreProduct;
    };
    standard: {
      title: string;
      summary: string;
      tags: string[];
      carbonMultiplier: number;
      rationale: string;
      storeProduct: SuggestedStoreProduct;
    };
  }
> = {
  electronics: {
    lowCarbon: {
      title: 'Refurbished or repairable electronics',
      summary: 'Choose a refurbished device or a model with longer upgrade support.',
      tags: ['Refurbished', 'Repairable', 'Long-life battery'],
      carbonMultiplier: 0.58,
      rationale: 'Refurbished electronics avoid much of the new manufacturing footprint while serving the same core need.',
      storeProduct: {
        platform: 'Amazon Renewed',
        productName: 'Refurbished laptop picks',
        image: 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
        link: 'https://www.amazon.in/s?k=refurbished+laptop',
        price: 'From Rs. 24,999',
        couponCode: 'ECOELECTRO10',
        couponLabel: 'Extra 10% off refurbished picks',
      },
    },
    standard: {
      title: 'Energy-efficient current-generation device',
      summary: 'Pick a durable mainstream model with good efficiency ratings and standard shipping.',
      tags: ['Energy efficient', 'Durable', 'Standard shipping'],
      carbonMultiplier: 0.82,
      rationale: 'A practical mainstream option still cuts impact by improving efficiency and avoiding urgent fulfillment.',
      storeProduct: {
        platform: 'Flipkart',
        productName: 'Energy-efficient laptops',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
        link: 'https://www.flipkart.com/search?q=energy+efficient+laptop',
        price: 'From Rs. 39,990',
        couponCode: 'SMARTSAVE7',
        couponLabel: 'Save 7% on efficient devices',
      },
    },
  },
  clothing: {
    lowCarbon: {
      title: 'Second-hand or natural-fiber basics',
      summary: 'Look for thrifted pieces or simple organic cotton staples that match the same style need.',
      tags: ['Second-hand', 'Organic cotton', 'Minimal packaging'],
      carbonMultiplier: 0.5,
      rationale: 'Pre-owned clothing and lower-impact fibers cut production emissions while covering the same use case.',
      storeProduct: {
        platform: 'Myntra',
        productName: 'Organic cotton everyday wear',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
        link: 'https://www.myntra.com/organic-cotton-clothing',
        price: 'From Rs. 899',
        couponCode: 'GREENSTYLE12',
        couponLabel: '12% off low-impact clothing',
      },
    },
    standard: {
      title: 'Durable everyday apparel',
      summary: 'Choose a well-made staple built for repeat wear instead of fast-fashion turnover.',
      tags: ['Durable fabric', 'Timeless style', 'Standard delivery'],
      carbonMultiplier: 0.78,
      rationale: 'A durable standard garment spreads its footprint across many more wears and reduces repeat purchases.',
      storeProduct: {
        platform: 'Ajio',
        productName: 'Durable wardrobe staples',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
        link: 'https://www.ajio.com/search/?text=durable%20clothing',
        price: 'From Rs. 1,299',
        couponCode: 'WARDROBE8',
        couponLabel: '8% off everyday apparel',
      },
    },
  },
  books: {
    lowCarbon: {
      title: 'Used copy or library option',
      summary: 'If ownership is optional, borrow or buy used to meet the same reading need with much lower impact.',
      tags: ['Used', 'Borrow', 'Local pickup'],
      carbonMultiplier: 0.35,
      rationale: 'Reuse removes most production emissions and often shortens delivery distance too.',
      storeProduct: {
        platform: 'Amazon',
        productName: 'Pre-owned book deals',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
        link: 'https://www.amazon.in/s?k=used+books',
        price: 'From Rs. 199',
        couponCode: 'BOOKGREEN15',
        couponLabel: '15% off pre-owned books',
      },
    },
    standard: {
      title: 'Single consolidated print order',
      summary: 'If you want a new copy, bundle it with other items and avoid rush shipping.',
      tags: ['New copy', 'Bundle order', 'Standard shipping'],
      carbonMultiplier: 0.74,
      rationale: 'Books are already lighter impact, so consolidation and calmer delivery become the biggest improvements.',
      storeProduct: {
        platform: 'Flipkart',
        productName: 'New releases with standard delivery',
        image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1200&q=80',
        link: 'https://www.flipkart.com/search?q=books',
        price: 'From Rs. 299',
        couponCode: 'READMORE5',
        couponLabel: '5% off book bundles',
      },
    },
  },
  furniture: {
    lowCarbon: {
      title: 'Pre-owned or certified wood furniture',
      summary: 'Choose second-hand or responsibly sourced pieces that solve the same room need with less material intensity.',
      tags: ['Second-hand', 'Certified wood', 'Flat-pack'],
      carbonMultiplier: 0.52,
      rationale: 'Furniture carries high embodied carbon, so reuse and efficient packaging create large savings.',
      storeProduct: {
        platform: 'Pepperfry',
        productName: 'Sustainable wood furniture',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
        link: 'https://www.pepperfry.com/site_product/search?q=sustainable%20furniture',
        price: 'From Rs. 6,499',
        couponCode: 'FURNIGREEN10',
        couponLabel: '10% off sustainable furniture',
      },
    },
    standard: {
      title: 'Long-life furniture with efficient shipping',
      summary: 'Pick a durable mainstream piece designed to last through moves and everyday use.',
      tags: ['Solid build', 'Repairable parts', 'Scheduled delivery'],
      carbonMultiplier: 0.81,
      rationale: 'A strong standard choice lowers replacement frequency while avoiding the highest shipping impact.',
      storeProduct: {
        platform: 'IKEA',
        productName: 'Durable home furniture picks',
        image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
        link: 'https://www.ikea.com/in/en/search/?q=furniture',
        price: 'From Rs. 7,990',
        couponCode: 'ROOMSAVE6',
        couponLabel: '6% off durable furniture',
      },
    },
  },
  food: {
    lowCarbon: {
      title: 'Local seasonal or plant-forward alternative',
      summary: 'Swap toward local, minimally processed, plant-rich options that satisfy the same grocery need.',
      tags: ['Local', 'Seasonal', 'Plant-forward'],
      carbonMultiplier: 0.48,
      rationale: 'Food emissions drop quickly when products are seasonal, plant-heavy, and sourced closer to the buyer.',
      storeProduct: {
        platform: 'BigBasket',
        productName: 'Seasonal plant-based grocery picks',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
        link: 'https://www.bigbasket.com/ps/?q=organic%20vegetables',
        price: 'From Rs. 249',
        couponCode: 'FRESHGREEN10',
        couponLabel: '10% off fresh low-impact groceries',
      },
    },
    standard: {
      title: 'Consolidated weekly grocery pick',
      summary: 'Keep a practical grocery choice but combine items into one standard delivery window.',
      tags: ['Bundle basket', 'Less packaging', 'Scheduled slot'],
      carbonMultiplier: 0.8,
      rationale: 'For groceries, the most practical win is reducing fragmented deliveries and excess packaging.',
      storeProduct: {
        platform: 'Blinkit',
        productName: 'Weekly essentials basket',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
        link: 'https://blinkit.com/s/?q=grocery',
        price: 'From Rs. 499',
        couponCode: 'WEEKLY5',
        couponLabel: '5% off scheduled grocery baskets',
      },
    },
  },
  beauty: {
    lowCarbon: {
      title: 'Refillable or multi-use personal care option',
      summary: 'Choose refillable formats or one product that covers the same routine with fewer materials.',
      tags: ['Refillable', 'Low-waste', 'Multi-use'],
      carbonMultiplier: 0.55,
      rationale: 'Beauty items become much lower impact when packaging is reused and product count is reduced.',
      storeProduct: {
        platform: 'Nykaa',
        productName: 'Refillable hair and skin care duo',
        image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=80',
        link: 'https://www.nykaa.com/search/result/?q=refillable%20beauty',
        price: 'From Rs. 599',
        couponCode: 'REFILL12',
        couponLabel: '12% off refillable care',
      },
    },
    standard: {
      title: 'Mainstream low-waste care product',
      summary: 'Pick a trusted everyday product with recyclable packaging and standard delivery.',
      tags: ['Recyclable pack', 'Trusted formula', 'Standard shipping'],
      carbonMultiplier: 0.84,
      rationale: 'A practical standard option still improves results when packaging and delivery choices are better aligned.',
      storeProduct: {
        platform: 'Tira',
        productName: 'Daily serum and shampoo essentials',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80',
        link: 'https://www.tirabeauty.com/search?q=hair%20serum',
        price: 'From Rs. 799',
        couponCode: 'CARESAVE8',
        couponLabel: '8% off everyday care',
      },
    },
  },
  toys: {
    lowCarbon: {
      title: 'Shared, second-hand, or wooden toy option',
      summary: 'Choose a reused or long-lasting toy that serves the same play or learning goal.',
      tags: ['Second-hand', 'Wooden', 'Long-lasting'],
      carbonMultiplier: 0.53,
      rationale: 'Toys benefit from reuse and durable materials because many otherwise have short ownership cycles.',
      storeProduct: {
        platform: 'FirstCry',
        productName: 'Wooden learning toys',
        image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80',
        link: 'https://www.firstcry.com/search?query=wooden%20toys',
        price: 'From Rs. 699',
        couponCode: 'PLAYGREEN10',
        couponLabel: '10% off durable toys',
      },
    },
    standard: {
      title: 'Durable mainstream toy',
      summary: 'Pick a sturdy option designed for repeated use instead of trend-based disposable items.',
      tags: ['Durable', 'Open-ended play', 'Standard delivery'],
      carbonMultiplier: 0.79,
      rationale: 'A good standard choice lowers waste by staying useful longer and avoiding repeat replacements.',
      storeProduct: {
        platform: 'Hamleys',
        productName: 'Long-lasting play sets',
        image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1200&q=80',
        link: 'https://www.hamleys.in/search?type=product&q=toys',
        price: 'From Rs. 1,299',
        couponCode: 'PLAYSMART7',
        couponLabel: '7% off selected toys',
      },
    },
  },
  home: {
    lowCarbon: {
      title: 'Reusable or recycled-material home essential',
      summary: 'Swap toward a reusable home product or one made from recycled inputs for the same household need.',
      tags: ['Reusable', 'Recycled material', 'Low packaging'],
      carbonMultiplier: 0.57,
      rationale: 'Home goods improve quickly when they replace disposables or use lower-carbon materials.',
      storeProduct: {
        platform: 'Amazon',
        productName: 'Reusable home essentials',
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        link: 'https://www.amazon.in/s?k=reusable+home+products',
        price: 'From Rs. 399',
        couponCode: 'HOMEGREEN10',
        couponLabel: '10% off reusable home products',
      },
    },
    standard: {
      title: 'Practical long-life home product',
      summary: 'Choose a dependable standard item that balances cost, durability, and lower delivery impact.',
      tags: ['Everyday use', 'Long-life', 'Standard shipping'],
      carbonMultiplier: 0.83,
      rationale: 'A well-made household item reduces future replacement demand while staying realistic for most shoppers.',
      storeProduct: {
        platform: 'Flipkart',
        productName: 'Durable home utility picks',
        image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
        link: 'https://www.flipkart.com/search?q=home+essentials',
        price: 'From Rs. 599',
        couponCode: 'HOMECARE6',
        couponLabel: '6% off home essentials',
      },
    },
  },
};

export function calculateCarbon(
  categoryId: string,
  quantity: number,
  shippingMethod: ShippingMethod,
  distance: number,
  weight?: number
): { total: number; production: number; shipping: number; packaging: number } {
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return { total: 0, production: 0, shipping: 0, packaging: 0 };

  const weightFactor = weight ? weight / 1.0 : 1;
  const production = category.baseCarbon * quantity * (weightFactor * 0.3 + 0.7);
  const shippingBase = (distance / 1000) * category.shippingFactor * quantity * weightFactor;
  const shipping = shippingBase * shippingMultipliers[shippingMethod].multiplier;
  const packaging = 0.2 * quantity * weightFactor;
  const total = production + shipping + packaging;

  return {
    total: Math.round(total * 100) / 100,
    production: Math.round(production * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    packaging: Math.round(packaging * 100) / 100,
  };
}

export function getCarbonLevel(kgCO2: number): 'low' | 'medium' | 'high' {
  if (kgCO2 < 5) return 'low';
  if (kgCO2 < 20) return 'medium';
  return 'high';
}

export function getEquivalent(kgCO2: number): string {
  if (kgCO2 < 1) return `${Math.round(kgCO2 * 1000)}g - like charging your phone ${Math.round(kgCO2 * 120)} times`;
  if (kgCO2 < 5) return `${kgCO2.toFixed(1)} kg - like driving ${Math.round(kgCO2 * 4)} km by car`;
  if (kgCO2 < 20) return `${kgCO2.toFixed(1)} kg - like ${Math.round(kgCO2 / 2.3)} loads of laundry`;
  return `${kgCO2.toFixed(1)} kg - equivalent to a ${Math.round(kgCO2 / 0.255)}-km flight`;
}

export const ecoTips: Record<string, string[]> = {
  low: [
    'Great choice! This has a minimal carbon footprint.',
    'Consider combining orders to reduce shipping trips.',
  ],
  medium: [
    'Choose standard shipping to cut emissions by up to 40%.',
    'Look for refurbished or second-hand alternatives.',
    'Buy from local sellers when possible.',
  ],
  high: [
    'This purchase has a significant footprint. Consider if you really need it.',
    'Look for energy-efficient or eco-certified alternatives.',
    'Offset your carbon by planting trees or supporting carbon projects.',
    'Choose standard shipping - overnight can triple the emissions.',
  ],
};

export function getRecommendations(
  categoryId: string,
  result: { total: number },
  productData?: ProductData
): RecommendationSet | null {
  const template = recommendationTemplates[categoryId];
  const category = categories.find((item) => item.id === categoryId);

  if (!template || !category) return null;

  const productDescriptor = productData?.product_name || category.name;
  const productSignals = [productData?.is_eco_friendly ? 'Eco-marked' : null, productData?.materials[0]].filter(Boolean) as string[];

  const buildRecommendation = (
    base: (typeof template)['lowCarbon']
  ): ProductRecommendation => {
    const estimatedCarbon = Math.max(0.2, Math.round(result.total * base.carbonMultiplier * 100) / 100);
    const savings = Math.max(0, Math.round((result.total - estimatedCarbon) * 100) / 100);

    return {
      title: base.title,
      summary: `${base.summary} Best fit for shoppers considering ${productDescriptor.toLowerCase()}.`,
      estimatedCarbon,
      savings,
      tags: [...productSignals, ...base.tags],
      rationale: base.rationale,
      storeProduct: base.storeProduct,
    };
  };

  return {
    lowCarbon: buildRecommendation(template.lowCarbon),
    standard: buildRecommendation(template.standard),
  };
}
