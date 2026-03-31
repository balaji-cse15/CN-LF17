import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { TablesInsert } from '@/integrations/supabase/types';
import type { ProductData, ProductRecommendation, ShippingMethod } from '@/lib/carbon-data';

interface CarbonCalculationPayload {
  userId: string;
  productName: string;
  categoryId: string;
  quantity: number;
  weightKg: number;
  shippingMethod: ShippingMethod;
  shippingDistanceKm: number;
  productionEmission: number;
  shippingEmission: number;
  packagingEmission: number;
  totalEmission: number;
  recommendationLowCarbon?: string;
  recommendationStandard?: string;
}

interface SaveOrderPayload {
  userId: string;
  calculationId?: string | null;
  recommendationType: 'low_carbon' | 'standard';
  recommendation: ProductRecommendation;
  quantity?: number;
}

export async function logUserAuthEvent(user: User, eventType: 'signed_in' | 'signed_out') {
  const payload: TablesInsert<'user_auth_events'> = {
    user_id: user.id,
    event_type: eventType,
    email: user.email ?? null,
    provider: user.app_metadata?.provider ?? null,
  };

  const { error } = await supabase.from('user_auth_events').insert(payload);
  if (error) throw error;
}

export async function saveCarbonCalculation(payload: CarbonCalculationPayload) {
  const insertPayload: TablesInsert<'carbon_calculations'> = {
    user_id: payload.userId,
    product_name: payload.productName,
    category_id: payload.categoryId,
    quantity: payload.quantity,
    weight_kg: payload.weightKg,
    shipping_method: payload.shippingMethod,
    shipping_distance_km: payload.shippingDistanceKm,
    production_emission: payload.productionEmission,
    shipping_emission: payload.shippingEmission,
    packaging_emission: payload.packagingEmission,
    total_emission: payload.totalEmission,
    recommendation_low_carbon: payload.recommendationLowCarbon ?? null,
    recommendation_standard: payload.recommendationStandard ?? null,
  };

  const { data, error } = await supabase
    .from('carbon_calculations')
    .insert(insertPayload)
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

export async function saveOrderSelection(payload: SaveOrderPayload) {
  const insertPayload: TablesInsert<'orders'> = {
    user_id: payload.userId,
    calculation_id: payload.calculationId ?? null,
    recommendation_type: payload.recommendationType,
    platform: payload.recommendation.storeProduct.platform,
    product_name: payload.recommendation.storeProduct.productName,
    product_link: payload.recommendation.storeProduct.link,
    product_image: payload.recommendation.storeProduct.image,
    quantity: payload.quantity ?? 1,
    price_label: payload.recommendation.storeProduct.price,
    coupon_code: payload.recommendation.storeProduct.couponCode,
    estimated_carbon: payload.recommendation.estimatedCarbon,
    carbon_saved: payload.recommendation.savings,
    status: 'opened',
  };

  const { error } = await supabase.from('orders').insert(insertPayload);
  if (error) throw error;
}

export function getProductNameForCalculation(productData: ProductData | undefined, fallbackName: string) {
  return productData?.product_name?.trim() || fallbackName;
}
