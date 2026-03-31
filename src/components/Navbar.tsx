import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Sprout, Home, User, LogIn, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = (path: string) =>
    `flex items-center gap-2 text-sm font-medium transition-colors ${
      location.pathname === path ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary font-display text-lg tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/15">
            <Sprout className="h-4 w-4" />
          </span>
          <span>Carbonix</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={linkClass('/')}>
            <Home className="w-4 h-4" /> Home
          </Link>

          <Link to="/profile" className={linkClass('/profile')}>
            <User className="w-4 h-4" /> Profile
          </Link>

          {user ? (
            <Link to="/account" className={linkClass('/account')}>
              <User className="w-4 h-4" /> Account
            </Link>
          ) : (
            <Link to="/auth" className="flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:shadow-md transition-all">
              <LogIn className="w-4 h-4" /> Sign In
            </Link>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-b border-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              <Link to="/" onClick={() => setMobileOpen(false)} className={linkClass('/')}>
                <Home className="w-4 h-4" /> Home
              </Link>

              <Link to="/profile" onClick={() => setMobileOpen(false)} className={linkClass('/profile')}>
                <User className="w-4 h-4" /> Profile
              </Link>

              {user ? (
                <Link to="/account" onClick={() => setMobileOpen(false)} className={linkClass('/account')}>
                  <User className="w-4 h-4" /> Account
                </Link>
              ) : (
                <Link to="/auth" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-medium text-primary">
                  <LogIn className="w-4 h-4" /> Sign In / Sign Up
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
