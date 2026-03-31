import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, Mail, User, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .single()
        .then(({ data }) => {
          setDisplayName(data?.display_name || user.user_metadata?.full_name || user.email || 'Carbonix User');
        });
    }
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut();
    toast.success('Logged out successfully.');
    navigate('/');
    setLoggingOut(false);
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background pt-20 px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto"
      >
        <div className="flex items-center gap-2 mb-6">
          <User className="w-6 h-6 text-primary" />
          <h1 className="font-display text-2xl text-foreground">Profile</h1>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
          <div className="rounded-xl bg-muted/50 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Registered Name</p>
            <div className="flex items-center gap-2 text-foreground">
              <User className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{displayName}</span>
            </div>
          </div>

          <div className="rounded-xl bg-muted/50 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Account Mail ID</p>
            <div className="flex items-center gap-2 text-foreground">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{user.email}</span>
            </div>
          </div>

          <div className="rounded-xl bg-muted/50 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Account ID</p>
            <div className="flex items-center gap-2 text-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium font-mono">{user.id}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
