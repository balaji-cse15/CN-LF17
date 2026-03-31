import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle,
  Copy,
  ExternalLink,
  Info,
  Leaf,
  Lightbulb,
  Package,
  ShieldCheck,
  TicketPercent,
  TrendingDown,
  Truck,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import {
  getCarbonLevel,
  getEquivalent,
  ecoTips,
  getRecommendations,
  type ProductData,
  type ProductRecommendation,
} from '@/lib/carbon-data';
import { saveOrderSelection } from '@/lib/supabase-data';

interface CarbonResultData {
  total: number;
  production: number;
  shipping: number;
  packaging: number;
}

interface Props {
  result: CarbonResultData;
  productData?: ProductData;
  categoryId: string;
}

interface RecommendationSectionProps extends Props {
  calculationId?: string | null;
}

const levelConfig = {
  low: {
    color: 'text-eco-low',
    bg: 'bg-eco-low/10',
    border: 'border-eco-low/40',
    barColor: 'bg-eco-low',
    icon: CheckCircle,
    label: 'Low Impact',
    description: 'This purchase has a minimal environmental impact.',
  },
  medium: {
    color: 'text-eco-medium',
    bg: 'bg-eco-medium/10',
    border: 'border-eco-medium/40',
    barColor: 'bg-eco-medium',
    icon: Info,
    label: 'Moderate Impact',
    description: 'Consider greener alternatives to reduce your footprint.',
  },
  high: {
    color: 'text-eco-high',
    bg: 'bg-eco-high/10',
    border: 'border-eco-high/40',
    barColor: 'bg-eco-high',
    icon: AlertTriangle,
    label: 'High Impact',
    description: 'This purchase has a significant carbon footprint.',
  },
} as const;

const RecommendationCards = ({ result, productData, categoryId, calculationId }: RecommendationSectionProps) => {
  const recommendations = getRecommendations(categoryId, result, productData);
  const { user } = useAuth();

  const handleCopyCoupon = async (couponCode: string) => {
    try {
      await navigator.clipboard.writeText(couponCode);
      toast.success(`Coupon copied: ${couponCode}`);
    } catch {
      toast.error('Could not copy coupon automatically.');
    }
  };

  const handleRecommendationOpen = async (
    recommendationType: 'low_carbon' | 'standard',
    recommendation: ProductRecommendation
  ) => {
    const openProduct = () => {
      window.open(recommendation.storeProduct.link, '_blank', 'noopener,noreferrer');
    };

    if (!user) {
      openProduct();
      toast.info('Sign in to save this recommendation to your history.');
      return;
    }

    try {
      await saveOrderSelection({
        userId: user.id,
        calculationId,
        recommendationType,
        recommendation,
      });
      openProduct();
      toast.success('Saved to your order history.');
    } catch {
      openProduct();
      toast.error('Could not save order history, but the product link opened.');
    }
  };

  if (!recommendations) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Recommended Products</p>
          <h2 className="font-display text-2xl text-foreground">Better matched choices with a cleaner layout</h2>
        </div>
        <p className="max-w-2xl text-sm text-muted-foreground">
          These product cards use the full available width, save selected recommendations to your history, and keep the product, coupon, and savings details in one place.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {[
          {
            key: 'low-carbon',
            title: 'Low-Carbon Alternative',
            icon: Leaf,
            accent: 'text-eco-low',
            background: 'bg-eco-low/10',
            border: 'border-eco-low/30',
            button: 'bg-eco-low text-white hover:bg-eco-low/90',
            recommendationType: 'low_carbon' as const,
            recommendation: recommendations.lowCarbon,
          },
          {
            key: 'best-standard',
            title: 'Best Standard Option',
            icon: ShieldCheck,
            accent: 'text-primary',
            background: 'bg-primary/10',
            border: 'border-primary/20',
            button: 'bg-primary text-primary-foreground hover:opacity-90',
            recommendationType: 'standard' as const,
            recommendation: recommendations.standard,
          },
        ].map((item, index) => {
          const RecommendationIcon = item.icon;
          const storeProduct = item.recommendation.storeProduct;

          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.08 }}
              className={`overflow-hidden rounded-3xl border ${item.border} ${item.background} shadow-sm`}
            >
              <div className="grid md:grid-cols-[240px_minmax(0,1fr)]">
                <div className="relative h-56 overflow-hidden md:h-full">
                  <img src={storeProduct.image} alt={storeProduct.productName} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                <div className="flex h-full flex-col p-5 md:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <RecommendationIcon className={`h-4 w-4 ${item.accent}`} />
                      <p className={`text-sm font-semibold ${item.accent}`}>{item.title}</p>
                    </div>
                    <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">{storeProduct.platform}</span>
                  </div>

                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl leading-tight text-foreground">{storeProduct.productName}</h3>
                      <p className="mt-2 text-base font-semibold text-foreground">{storeProduct.price}</p>
                    </div>
                    <div className="rounded-2xl bg-background/80 px-4 py-3 text-right">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Potential savings</p>
                      <p className={`mt-1 text-xl font-semibold ${item.accent}`}>{item.recommendation.savings} kg</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.recommendation.summary}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.recommendation.tags.map((tag) => (
                      <span key={`${item.key}-${tag}`} className="rounded-full bg-background/80 px-3 py-1 text-xs text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-background/80 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Estimated footprint</p>
                      <p className="mt-1 text-lg font-semibold text-foreground">{item.recommendation.estimatedCarbon} kg CO2e</p>
                    </div>

                    <div className="rounded-2xl border border-dashed border-border bg-background/80 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <TicketPercent className="h-4 w-4 text-primary" />
                        {storeProduct.couponLabel}
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-3 py-2">
                        <span className="font-mono text-sm font-semibold text-foreground">{storeProduct.couponCode}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyCoupon(storeProduct.couponCode)}
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted"
                        >
                          <Copy className="h-3.5 w-3.5" /> Copy
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{item.recommendation.rationale}</span>
                  </p>

                  <button
                    type="button"
                    onClick={() => handleRecommendationOpen(item.recommendationType, item.recommendation)}
                    className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${item.button}`}
                  >
                    Use Coupon and View Product <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

const CarbonResult = ({ result, productData }: Props) => {
  const level = getCarbonLevel(result.total);
  const config = levelConfig[level];
  const equivalent = getEquivalent(result.total);
  const tips = ecoTips[level];
  const Icon = config.icon;

  const breakdown = [
    { label: 'Production', value: result.production, icon: Package, pct: result.total > 0 ? (result.production / result.total) * 100 : 0 },
    { label: 'Shipping', value: result.shipping, icon: Truck, pct: result.total > 0 ? (result.shipping / result.total) * 100 : 0 },
    { label: 'Packaging', value: result.packaging, icon: Package, pct: result.total > 0 ? (result.packaging / result.total) * 100 : 0 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-5">
      {productData && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Analyzing</p>
          <p className="font-display text-lg text-foreground">{productData.product_name}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {productData.brand && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{productData.brand}</span>}
            {productData.price && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{productData.price}</span>}
            {productData.materials.map((material, index) => (
              <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{material}</span>
            ))}
            {productData.is_eco_friendly && <span className="text-xs bg-eco-low/10 text-eco-low px-2 py-0.5 rounded-full">Eco-friendly</span>}
          </div>
        </motion.div>
      )}

      <div className={`rounded-2xl border-2 ${config.border} ${config.bg} p-6 md:p-8 text-center`}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          className={`w-16 h-16 rounded-full ${config.bg} border-2 ${config.border} flex items-center justify-center mx-auto mb-4`}
        >
          <Icon className={`w-8 h-8 ${config.color}`} />
        </motion.div>

        <span className={`inline-block text-xs font-bold uppercase tracking-widest ${config.color} mb-2`}>{config.label}</span>

        <motion.p
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="font-display text-5xl md:text-6xl text-foreground"
        >
          {result.total}
          <span className="text-lg text-muted-foreground ml-2">kg CO2e</span>
        </motion.p>

        <p className="text-muted-foreground text-sm mt-3">{equivalent}</p>
        <p className={`text-sm font-medium mt-2 ${config.color}`}>{config.description}</p>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <h3 className="font-display text-lg text-foreground flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-primary" /> Emission Breakdown
        </h3>
        {breakdown.map((item, index) => {
          const ItemIcon = item.icon;
          return (
            <motion.div key={item.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.1 }}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <ItemIcon className="w-4 h-4" /> {item.label}
                </span>
                <span className="font-semibold text-foreground">{item.value} kg</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.pct}%` }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                  className={`h-full ${config.barColor} rounded-full`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-display text-lg text-foreground flex items-center gap-2 mb-4">
          <Leaf className="w-4 h-4 text-eco-leaf" /> Eco Tips
        </h3>
        <ul className="space-y-3">
          {tips.map((tip, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-start gap-3 text-sm text-muted-foreground"
            >
              <span className={`mt-1 w-2 h-2 rounded-full ${config.barColor} shrink-0`} />
              {tip}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export { RecommendationCards as RecommendationSection };
export default CarbonResult;
