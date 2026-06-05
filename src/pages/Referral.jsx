import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Share2, Copy, Users, Gift, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import CoinBadge from '@/components/ui/CoinBadge';

export default function Referral() {
  const { data: profile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by_id: (await base44.auth.me()).id });
      return profiles[0] || null;
    },
  });

  const referralCode = profile?.referral_code || '------';
  const referralCount = profile?.referral_count || 0;
  const coinsEarned = referralCount * 15;

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success("Kod nusxalandi!");
  };

  const steps = [
    { icon: Share2, title: "Kodni ulashing", desc: "Do'stlaringizga taklif kodingizni yuboring" },
    { icon: Users, title: "Do'st ro'yxatdan o'tadi", desc: "Ular ilovaga ro'yxatdan o'tishadi" },
    { icon: Gift, title: "Mukofot oling", desc: "Har bir do'st uchun +15 tanga" },
  ];

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <Link to="/profile">
          <Button variant="ghost" size="icon"><ChevronLeft className="w-5 h-5" /></Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold font-display">Taklif tizimi</h1>
          <p className="text-xs text-muted-foreground">Do'stlaringizni taklif qiling</p>
        </div>
      </div>

      {/* Referral Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-6 text-center mb-5"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Share2 className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-lg font-bold mb-1">Sizning kodingiz</h2>
        <div className="flex items-center gap-2 justify-center mb-4">
          <div className="bg-muted px-4 py-2 rounded-xl font-mono text-xl font-bold tracking-widest">
            {referralCode}
          </div>
          <Button variant="outline" size="icon" onClick={copyCode} className="shrink-0">
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-xl p-3">
            <p className="text-xl font-bold">{referralCount}</p>
            <p className="text-[10px] text-muted-foreground">Taklif qilingan</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-3">
            <CoinBadge amount={coinsEarned} size="md" />
            <p className="text-[10px] text-muted-foreground mt-1">Ishlangan tangalar</p>
          </div>
        </div>
      </motion.div>

      {/* Steps */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Qanday ishlaydi</h3>
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="flex items-center gap-3 glass rounded-xl p-4"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <step.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">{step.title}</p>
              <p className="text-[11px] text-muted-foreground">{step.desc}</p>
            </div>
            <CheckCircle2 className="w-4 h-4 text-muted-foreground/30 shrink-0" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}