import { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, TreePine, Sparkles } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';
import ProductInput from '@/components/ProductInput';
import CarbonResultComponent, { RecommendationSection } from '@/components/CarbonResult';
import { useAuth } from '@/contexts/AuthContext';
import { calculateCarbon, categories, getRecommendations, type ProductData, type ShippingMethod } from '@/lib/carbon-data';
import { getProductNameForCalculation, saveCarbonCalculation } from '@/lib/supabase-data';

interface CarbonResult {
  total: number;
  production: number;
  shipping: number;
  packaging: number;
}

const Index = () => {
  const [result, setResult] = useState<CarbonResult | null>(null);
  const [productInfo, setProductInfo] = useState<ProductData | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [calculationId, setCalculationId] = useState<string | null>(null);
  const { user } = useAuth();

  const handleCalculate = async (
    categoryId: string,
    quantity: number,
    shipping: ShippingMethod,
    distance: number,
    weight: number,
    _productLink: string,
    productData?: ProductData
  ) => {
    const calculated = calculateCarbon(categoryId, quantity, shipping, distance, weight);
    const recommendations = getRecommendations(categoryId, calculated, productData);
    const categoryName = categories.find((category) => category.id === categoryId)?.name || 'Product';
    setResult(calculated);
    setProductInfo(productData || null);
    setSelectedCategoryId(categoryId);
    setCalculationId(null);

    if (!user) return;

    try {
      const savedCalculationId = await saveCarbonCalculation({
        userId: user.id,
        productName: getProductNameForCalculation(productData, categoryName),
        categoryId,
        quantity,
        weightKg: weight,
        shippingMethod: shipping,
        shippingDistanceKm: distance,
        productionEmission: calculated.production,
        shippingEmission: calculated.shipping,
        packagingEmission: calculated.packaging,
        totalEmission: calculated.total,
        recommendationLowCarbon: recommendations?.lowCarbon.storeProduct.productName,
        recommendationStandard: recommendations?.standard.storeProduct.productName,
      });

      setCalculationId(savedCalculationId);
    } catch {
      setCalculationId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 pt-24 pb-20 md:pt-32 md:pb-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <TreePine className="w-4 h-4" /> Know Before You Buy
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground leading-tight mb-4">
              Carbon Footprint
              <br />
              <span className="text-primary">Tracker</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Estimate the environmental impact of your online purchases in real-time. Make eco-conscious decisions with every order.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 -mt-8 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <ProductInput onCalculate={handleCalculate} />
          <div>
            {result ? (
              <CarbonResultComponent
                result={result}
                productData={productInfo || undefined}
                categoryId={selectedCategoryId || productInfo?.category || ''}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-eco-surface rounded-2xl border border-border p-8 md:p-12 flex flex-col items-center justify-center text-center min-h-[400px]"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Leaf className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">Your Impact Awaits</h3>
                <p className="text-muted-foreground text-sm max-w-xs">Fill in the product details to see your estimated carbon footprint.</p>
              </motion.div>
            )}
          </div>
        </div>

        {result && (
          <div className="mt-8">
            <RecommendationSection
              result={result}
              productData={productInfo || undefined}
              categoryId={selectedCategoryId || productInfo?.category || ''}
              calculationId={calculationId}
            />
          </div>
        )}
      </section>

      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { value: '36B+', label: 'Packages shipped globally per year', icon: Sparkles },
              { value: '3.5%', label: 'Of global CO2 from e-commerce logistics', icon: TreePine },
              { value: '40%', label: 'Emissions cut by choosing standard shipping', icon: Leaf },
            ].map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15 }}>
                  <StatIcon className="w-6 h-6 mx-auto mb-3 opacity-70" />
                  <p className="font-display text-3xl md:text-4xl mb-1">{stat.value}</p>
                  <p className="text-sm opacity-80">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <footer className="py-8 text-center text-muted-foreground text-sm border-t border-border">
        <p>Carbon Footprint Tracker - promoting eco-conscious online shopping</p>
      </footer>
    </div>
  );
};

export default Index;
