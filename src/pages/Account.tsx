import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { Clock3, Mail, Package, Settings, Shield, Sparkles } from 'lucide-react';

type Order = Tables<'orders'>;
type Calculation = Tables<'carbon_calculations'>;
type AuthEvent = Tables<'user_auth_events'>;

const Account = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [authEvents, setAuthEvents] = useState<AuthEvent[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    const loadAccountData = async () => {
      setPageLoading(true);

      const [ordersResponse, calculationsResponse, authEventsResponse] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('carbon_calculations').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('user_auth_events').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      setOrders(ordersResponse.data ?? []);
      setCalculations(calculationsResponse.data ?? []);
      setAuthEvents(authEventsResponse.data ?? []);
      setPageLoading(false);
    };

    void loadAccountData();
  }, [user]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-background pt-20 px-4 pb-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          <h1 className="font-display text-2xl text-foreground">Account Settings</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-6 md:col-span-1">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Email</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Account ID</p>
                <p className="text-sm text-muted-foreground font-mono">{user.id.slice(0, 12)}...</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Clock3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Member Since</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 grid gap-6">
            <section className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <h2 className="font-display text-xl text-foreground">Recent Login Activity</h2>
              </div>
              <div className="space-y-3">
                {pageLoading ? (
                  <p className="text-sm text-muted-foreground">Loading login activity...</p>
                ) : authEvents.length > 0 ? (
                  authEvents.map((event) => (
                    <div key={event.id} className="rounded-xl bg-muted/50 px-4 py-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{event.event_type.replace('_', ' ')}</p>
                        <p className="text-xs text-muted-foreground">{event.provider || 'email'} {event.email ? `- ${event.email}` : ''}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(event.created_at).toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No login activity saved yet.</p>
                )}
              </div>
            </section>

            <section className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="font-display text-xl text-foreground">Recent Carbon Calculations</h2>
              </div>
              <div className="space-y-3">
                {pageLoading ? (
                  <p className="text-sm text-muted-foreground">Loading calculations...</p>
                ) : calculations.length > 0 ? (
                  calculations.map((calculation) => (
                    <div key={calculation.id} className="rounded-xl bg-muted/50 px-4 py-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{calculation.product_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {calculation.category_id} - {calculation.quantity} item(s) - {calculation.shipping_method}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary">{calculation.total_emission} kg CO2e</p>
                        <p className="text-xs text-muted-foreground">{new Date(calculation.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No calculations saved yet.</p>
                )}
              </div>
            </section>

            <section className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="font-display text-xl text-foreground">Recommended Product History</h2>
              </div>
              <div className="space-y-3">
                {pageLoading ? (
                  <p className="text-sm text-muted-foreground">Loading order history...</p>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <div key={order.id} className="rounded-xl bg-muted/50 px-4 py-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{order.product_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.platform} - {order.recommendation_type.replace('_', ' ')} - {order.coupon_code || 'No coupon'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary">{order.estimated_carbon} kg CO2e</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recommended products opened yet.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Account;
