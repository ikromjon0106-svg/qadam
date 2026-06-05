import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import CoinBadge from '@/components/ui/CoinBadge';
import ProductImage from '@/components/marketplace/ProductImage';

const categoryLabels = {
  all: 'Hammasi',
  powerups: '⚡ Kuchlar',
  sports: 'Sport',
  coupons: 'Kuponlar',
  accessories: 'Aksessuarlar',
  sponsor: 'Hamkorlar',
  vouchers: 'Chegirmalar',
};

export default function Marketplace() {
  const [category, setCategory] = useState('all');
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by_id: (await base44.auth.me()).id });
      return profiles[0] || null;
    },
  });

  const { data: items, isLoading } = useQuery({
    queryKey: ['marketplaceItems'],
    queryFn: () => base44.entities.MarketplaceItem.filter({ is_active: true }),
    initialData: [],
  });

  const purchaseMutation = useMutation({
    mutationFn: async (item) => {
      if (!profile) throw new Error('Profil topilmadi');
      if ((profile.total_coins || 0) < item.coin_price) throw new Error("Tangalar yetarli emas");
      if (profile.subscription_type !== 'premium' && item.is_premium_only) throw new Error("Premium obuna kerak");

      await base44.entities.Order.create({
        item_id: item.id,
        item_name: item.name,
        coins_spent: item.coin_price,
        status: 'pending',
      });

      const updates = { total_coins: profile.total_coins - item.coin_price };
      if (item.item_type === 'shield') {
        const shieldExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        updates.is_shielded = true;
        updates.shield_expires = shieldExpires;
      }
      await base44.entities.UserProfile.update(profile.id, updates);
    },
    onSuccess: (_, item) => {
      if (item?.item_type === 'shield') toast.success("🛡️ Qalqon faollashtirildi! 24 soat himoyada!");
      else if (item?.item_type === 'bomb') toast.success("💣 Bomba sotib olindi!");
      else toast.success("Buyurtma qabul qilindi! 🎉");
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (err) => toast.error(err.message),
    });

  const filtered = category === 'all' ? items : items.filter((i) => i.category === category);

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display">Do'kon</h1>
            <p className="text-xs text-muted-foreground">Tangalarni sarflang</p>
          </div>
        </div>
        <CoinBadge amount={profile?.total_coins || 0} size="md" />
      </motion.div>

      {/* Category Tabs */}
      <div className="overflow-x-auto mb-5 -mx-4 px-4">
        <div className="flex gap-2 min-w-max">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <Button
              key={key}
              variant={category === key ? 'default' : 'outline'}
              size="sm"
              className="rounded-full text-xs"
              onClick={() => setCategory(key)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-3">
        {isLoading
          ? Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-52 rounded-2xl bg-muted/50 animate-pulse" />
            ))
          : filtered.map((item, i) => {
              const canAfford = (profile?.total_coins || 0) >= item.coin_price;
              const isBomb = item.item_type === 'bomb';
              const isShield = item.item_type === 'shield';
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-2xl overflow-hidden border-2 transition-all ${
                    isBomb ? 'border-red-800/40 shadow-lg shadow-red-900/20' :
                    isShield ? 'border-blue-500/40 shadow-lg shadow-blue-500/20' :
                    'border-border/60'
                  } bg-card`}
                >
                  {/* Image */}
                  <div className="h-32 relative overflow-hidden">
                    <ProductImage item={item} />
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {isBomb && (
                        <span className="text-[9px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded-full">💣 BOMBA</span>
                      )}
                      {isShield && (
                        <span className="text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded-full">🛡️ QALQON</span>
                      )}
                    </div>
                    {item.is_premium_only && (
                      <Badge className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] px-1.5 border-0">
                        <Star className="w-2.5 h-2.5 mr-0.5" />
                        VIP
                      </Badge>
                    )}
                    {!canAfford && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="text-[10px] text-white/80 font-semibold bg-black/50 px-2 py-1 rounded-full">Tanga yetarli emas</span>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-3 space-y-2">
                    <div>
                      <p className="text-xs font-bold truncate">{item.name}</p>
                      {item.description && (
                        <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{item.description}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <CoinBadge amount={item.coin_price} size="sm" />
                      <Button
                        size="sm"
                        className={`h-7 text-[10px] rounded-full font-semibold ${
                          isBomb ? 'bg-red-600 hover:bg-red-700 text-white' :
                          isShield ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''
                        }`}
                        disabled={purchaseMutation.isPending || !canAfford}
                        onClick={() => purchaseMutation.mutate(item)}
                      >
                        {isBomb ? '💣 Olish' : isShield ? '🛡️ Olish' : 'Olish'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
      </div>

      {filtered.length === 0 && !isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Hozircha mahsulot yo'q</p>
        </div>
      )}
    </div>
  );
}