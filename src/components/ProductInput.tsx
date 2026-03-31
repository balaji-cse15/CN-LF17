import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories, type ShippingMethod } from '@/lib/carbon-data';
import { Leaf, Link as LinkIcon, ChevronDown, Weight, Hash, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductData {
  product_name: string;
  category: string;
  weight_kg: number;
  materials: string[];
  price?: string;
  description?: string;
  brand?: string;
  is_eco_friendly?: boolean;
}

interface Props {
  onCalculate: (categoryId: string, quantity: number, shipping: ShippingMethod, distance: number, weight: number, productLink: string, productData?: ProductData) => void;
}

const ProductInput = ({ onCalculate }: Props) => {
  const [productLink, setProductLink] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [weight, setWeight] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [analyzeError, setAnalyzeError] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const analyzeProduct = async (url: string) => {
    if (!url.trim()) return;

    // Basic URL validation
    let testUrl = url.trim();
    if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
      testUrl = `https://${testUrl}`;
    }
    try {
      new URL(testUrl);
    } catch {
      return; // Not a valid URL yet
    }

    setAnalyzing(true);
    setAnalyzeError('');
    setProductData(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-product', {
        body: { url: testUrl },
      });

      if (error) throw new Error(error.message);
      if (!data?.success) throw new Error(data?.error || 'Failed to analyze product');

      const product: ProductData = data.product;
      setProductData(product);

      // Auto-fill form fields
      if (product.category && categories.find(c => c.id === product.category)) {
        setCategoryId(product.category);
        const cat = categories.find(c => c.id === product.category);
        setCategorySearch(cat?.name || '');
      }
      if (product.weight_kg) {
        setWeight(String(product.weight_kg));
      }

      toast.success(`Product detected: ${product.product_name}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to analyze product';
      setAnalyzeError(msg);
      toast.error(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLinkChange = (value: string) => {
    setProductLink(value);
    setProductData(null);
    setAnalyzeError('');

    // Debounce the analysis
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim().length > 10) {
        analyzeProduct(value);
      }
    }, 1000);
  };

  const handleSelectCategory = (id: string, name: string) => {
    setCategoryId(id);
    setCategorySearch(name);
    setShowDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !weight || quantity < 1) return;
    onCalculate(categoryId, quantity, 'standard', 500, parseFloat(weight), productLink, productData || undefined);
  };

  const isValid = categoryId && weight && parseFloat(weight) > 0 && quantity >= 1;

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      onSubmit={handleSubmit}
      className="bg-card rounded-2xl shadow-lg border border-border p-6 md:p-8 space-y-5"
    >
      <div className="flex items-center gap-2 mb-1">
        <Leaf className="w-5 h-5 text-primary" />
        <h2 className="font-display text-xl text-foreground">Estimate Your Impact</h2>
      </div>

      {/* Product Link */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          <span className="flex items-center gap-1.5"><LinkIcon className="w-3.5 h-3.5" /> Product Link</span>
        </label>
        <div className="relative">
          <input
            type="url"
            placeholder="Paste a product URL to auto-detect details..."
            value={productLink}
            onChange={e => handleLinkChange(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-10 text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {analyzing && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
            {!analyzing && productData && <CheckCircle2 className="w-4 h-4 text-eco-low" />}
            {!analyzing && analyzeError && <AlertCircle className="w-4 h-4 text-eco-high" />}
          </div>
        </div>

        {/* Product Detection Result */}
        <AnimatePresence>
          {analyzing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 flex items-center gap-2 text-xs text-primary"
            >
              <Loader2 className="w-3 h-3 animate-spin" />
              Scanning product page...
            </motion.div>
          )}
          {productData && !analyzing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 rounded-xl border border-eco-low/30 bg-eco-low/5 p-3 space-y-2"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-eco-low">
                <Sparkles className="w-3.5 h-3.5" />
                Product Detected
              </div>
              <p className="text-sm font-medium text-foreground">{productData.product_name}</p>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {productData.brand && <span className="bg-muted px-2 py-0.5 rounded-full">{productData.brand}</span>}
                {productData.price && <span className="bg-muted px-2 py-0.5 rounded-full">{productData.price}</span>}
                {productData.weight_kg && <span className="bg-muted px-2 py-0.5 rounded-full">{productData.weight_kg} kg</span>}
                {productData.is_eco_friendly && (
                  <span className="bg-eco-low/10 text-eco-low px-2 py-0.5 rounded-full">♻️ Eco-friendly</span>
                )}
              </div>
              {productData.materials.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {productData.materials.map((mat, i) => (
                    <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{mat}</span>
                  ))}
                </div>
              )}
              {productData.description && (
                <p className="text-xs text-muted-foreground mt-1">{productData.description}</p>
              )}
            </motion.div>
          )}
          {analyzeError && !analyzing && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-2 text-xs text-eco-high"
            >
              {analyzeError}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Product Type Dropdown */}
      <div ref={dropdownRef} className="relative">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          <span className="flex items-center gap-1.5"><ChevronDown className="w-3.5 h-3.5" /> Product Type</span>
        </label>
        <div
          onClick={() => setShowDropdown(true)}
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm cursor-pointer flex items-center justify-between transition-all focus-within:ring-2 focus-within:ring-ring"
        >
          <input
            type="text"
            placeholder="Search or select a category..."
            value={categorySearch}
            onChange={e => {
              setCategorySearch(e.target.value);
              setCategoryId('');
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="bg-transparent outline-none w-full text-foreground placeholder:text-muted-foreground/60"
          />
          {categoryId && (
            <span className="text-xl ml-2">{categories.find(c => c.id === categoryId)?.icon}</span>
          )}
        </div>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute z-20 top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl max-h-56 overflow-y-auto"
            >
              {filteredCategories.length > 0 ? (
                filteredCategories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id, cat.name)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors hover:bg-muted ${
                      categoryId === cat.id ? 'bg-primary/10 text-foreground font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-muted-foreground">No categories found</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Weight & Quantity */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            <span className="flex items-center gap-1.5"><Weight className="w-3.5 h-3.5" /> Weight (kg)</span>
          </label>
          <input
            type="number"
            min={0.01}
            step={0.01}
            placeholder="e.g. 1.5"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            <span className="flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" /> Quantity</span>
          </label>
          <input
            type="number"
            min={1}
            max={999}
            value={quantity}
            onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={!isValid || analyzing}
        className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg"
      >
        {analyzing ? 'Analyzing Product...' : 'Calculate Carbon Footprint'}
      </motion.button>
    </motion.form>
  );
};

export default ProductInput;
