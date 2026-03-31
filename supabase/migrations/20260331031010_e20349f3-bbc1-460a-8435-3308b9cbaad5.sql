-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Carbon calculation history
CREATE TABLE public.carbon_calculations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  category_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  weight_kg NUMERIC(10, 2) NOT NULL,
  shipping_method TEXT NOT NULL,
  shipping_distance_km NUMERIC(10, 2) NOT NULL DEFAULT 500,
  production_emission NUMERIC(10, 2) NOT NULL,
  shipping_emission NUMERIC(10, 2) NOT NULL,
  packaging_emission NUMERIC(10, 2) NOT NULL,
  total_emission NUMERIC(10, 2) NOT NULL,
  recommendation_low_carbon TEXT,
  recommendation_standard TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.carbon_calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own calculations"
ON public.carbon_calculations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calculations"
ON public.carbon_calculations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE INDEX carbon_calculations_user_id_created_at_idx
ON public.carbon_calculations(user_id, created_at DESC);

-- Order history
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  calculation_id UUID REFERENCES public.carbon_calculations(id) ON DELETE SET NULL,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('low_carbon', 'standard')),
  platform TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_link TEXT,
  product_image TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_label TEXT,
  coupon_code TEXT,
  estimated_carbon NUMERIC(10, 2) NOT NULL,
  carbon_saved NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'recommended' CHECK (status IN ('recommended', 'opened', 'purchased')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
ON public.orders FOR UPDATE
USING (auth.uid() = user_id);

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX orders_user_id_created_at_idx
ON public.orders(user_id, created_at DESC);

-- Authentication activity log
CREATE TABLE public.user_auth_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('signed_in', 'signed_out')),
  provider TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_auth_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own auth events"
ON public.user_auth_events FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own auth events"
ON public.user_auth_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE INDEX user_auth_events_user_id_created_at_idx
ON public.user_auth_events(user_id, created_at DESC);
