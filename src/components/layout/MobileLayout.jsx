import { Outlet, useLocation, Link } from 'react-router-dom';
import { Home, Map, Trophy, ShoppingBag, User } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', icon: Home, label: 'Bosh sahifa' },
  { path: '/map', icon: Map, label: 'Xarita' },
  { path: '/leaderboard', icon: Trophy, label: 'Reyting' },
  { path: '/marketplace', icon: ShoppingBag, label: "Do'kon" },
  { path: '/profile', icon: User, label: 'Profil' },
];

export default function MobileLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pb-20 overflow-y-auto">
        <Outlet />
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong safe-area-bottom">
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-1 w-8 h-1 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                <span
                  className={`text-[10px] font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}