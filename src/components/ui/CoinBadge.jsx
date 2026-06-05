import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';

export default function CoinBadge({ amount, size = 'md' }) {
  const sizes = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-lg px-4 py-2 gap-2 font-bold',
  };

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className={`inline-flex items-center rounded-full bg-accent/20 text-accent-foreground font-semibold ${sizes[size]}`}
    >
      <Coins className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      <span>{amount?.toLocaleString() || 0}</span>
    </motion.div>
  );
}