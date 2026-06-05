import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Crown, Check, ChevronLeft, Zap, Shield, Star, BarChart3, Gift, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function Subscription() {
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by_id: (await base44.auth.me()).id });
      return profiles[0] || null;
    },
  });

  const isPremium = profile?.subscription_type === 'premium';

  const upgradeMutation = useMutation({
    mutationFn: async () => {
      if (!profile) return;
      await base44.entities.UserProfile.update(profile.id, { subscription_type: 'premium' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success("Premium faollashtirildi! 🎉");
    },
  });

  const freeFeatures = [
    "Asosiy GPS tracking",
    "Cheklangan tangalar",
    "1000 kishilik guruh",
    "Top 50 mukofot olishi mumkin",
    "Kunlik missiyalar",
  ];

  const premiumFeatures = [
    { icon: Zap, text: "Cheksiz tanga ishlash" },
    { icon: Star, text: "Eksklyuziv missiyalar" },
    { icon: Gift, text: "Premium mukofotlar" },
    { icon: Crown, text: "Premium reyting" },
    { icon: Shield, text: "Do'kon foydalanish" },
    { icon: BarChart3, text: "Kengaytirilgan statistika" },
    { icon: Headphones, text: "Ustuvor qo'llab-quvvatlash" },
  ];

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <Link to="/profile">
          <Button variant="ghost" size="icon"><ChevronLeft className="w-5 h-5" /></Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold font-display">Obuna</h1>
          <p className="text-xs text-muted-foreground">Rejangizni tanlang</p>
        </div>
      </div>

      {/* Free Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass rounded-2xl p-5 mb-4 ${!isPremium ? 'border-2 border-primary' : ''}`}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">Bepul</h3>
          {!isPremium && (
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Hozirgi</span>
          )}
        </div>
        <p className="text-2xl font-bold mb-3">$0 <span className="text-sm font-normal text-muted-foreground">/ oy</span></p>
        <div className="space-y-2">
          {freeFeatures.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{f}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Premium Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-2xl p-5 relative overflow-hidden ${isPremium ? 'border-2 border-accent' : ''}`}
        style={{
          background: 'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--primary) / 0.1) 100%)',
        }}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl -translate-y-8 translate-x-8" />
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-accent-foreground" />
            <h3 className="text-lg font-bold">Premium</h3>
          </div>
          {isPremium && (
            <span className="text-[10px] bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full font-medium">Faol</span>
          )}
        </div>
        <p className="text-2xl font-bold mb-3">$5 <span className="text-sm font-normal text-muted-foreground">/ oy</span></p>
        <div className="space-y-2.5 mb-4">
          {premiumFeatures.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <f.icon className="w-4 h-4 text-primary" />
              <span className="text-sm">{f.text}</span>
            </div>
          ))}
        </div>
        {!isPremium && (
          <Button
            className="w-full rounded-xl bg-primary hover:bg-primary/90"
            onClick={() => upgradeMutation.mutate()}
            disabled={upgradeMutation.isPending}
          >
            <Crown className="w-4 h-4 mr-2" />
            Premiumga o'tish
          </Button>
        )}
      </motion.div>
    </div>
  );
}