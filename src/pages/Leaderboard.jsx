import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp, Users, Star } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CoinBadge from '@/components/ui/CoinBadge';

function LeaderRow({ rank, profile, isCurrentUser }) {
  const rankIcons = {
    1: <Crown className="w-5 h-5 text-yellow-500" />,
    2: <Medal className="w-5 h-5 text-gray-400" />,
    3: <Medal className="w-5 h-5 text-amber-700" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${
        isCurrentUser ? 'glass border border-primary/30' : 'hover:bg-muted/50'
      } ${rank <= 3 ? 'glass' : ''}`}
    >
      <div className="w-8 text-center">
        {rankIcons[rank] || <span className="text-sm font-semibold text-muted-foreground">{rank}</span>}
      </div>
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
        {(profile.display_name || 'U')[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{profile.display_name || 'Foydalanuvchi'}</p>
        <p className="text-[11px] text-muted-foreground">
          {profile.total_distance_km?.toFixed(1) || 0} km · Daraja {profile.level || 1}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <CoinBadge amount={profile.total_coins || 0} size="sm" />
        <span className="text-[10px] font-bold text-muted-foreground">#{rank}-o'rin</span>
      </div>
    </motion.div>
  );
}

export default function Leaderboard() {
  const [period, setPeriod] = useState('monthly');

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['leaderboard', period],
    queryFn: () => base44.entities.UserProfile.list('-total_coins', 50),
    initialData: [],
  });

  const topThree = profiles.slice(0, 3);
  const rest = profiles.slice(3);

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-5"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-display">Reyting jadvali</h1>
          <p className="text-xs text-muted-foreground">Eng yaxshi yurishchilar</p>
        </div>
      </motion.div>

      <Tabs value={period} onValueChange={setPeriod} className="mb-5">
        <TabsList className="w-full glass">
          <TabsTrigger value="daily" className="flex-1 text-xs">Kunlik</TabsTrigger>
          <TabsTrigger value="weekly" className="flex-1 text-xs">Haftalik</TabsTrigger>
          <TabsTrigger value="monthly" className="flex-1 text-xs">Oylik</TabsTrigger>
          <TabsTrigger value="global" className="flex-1 text-xs">Global</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Top 3 Podium */}
      {topThree.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end justify-center gap-3 mb-6"
        >
          {/* Order: 2nd, 1st, 3rd */}
          {[1, 0, 2].map((idx) => {
            const p = topThree[idx];
            const rank = idx + 1;
            const isFirst = rank === 1;
            const heights = { 1: 'h-20', 2: 'h-14', 3: 'h-10' };
            return (
              <div key={idx} className={`flex flex-col items-center ${isFirst ? 'mb-4' : ''}`}>
                <div className={`relative ${isFirst ? 'w-16 h-16' : 'w-12 h-12'} rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary mb-2`}>
                  {(p?.display_name || 'U')[0].toUpperCase()}
                  {isFirst && <Crown className="absolute -top-3 w-6 h-6 text-yellow-500" />}
                </div>
                <p className="text-xs font-semibold truncate max-w-[80px] text-center">{p?.display_name}</p>
                <CoinBadge amount={p?.total_coins || 0} size="sm" />
                <div className={`mt-2 ${heights[rank]} w-16 rounded-t-xl bg-primary/10 flex items-center justify-center`}>
                  <span className="text-lg font-bold text-primary">#{rank}</span>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* List */}
      <div className="space-y-2">
        {isLoading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-muted/50 animate-pulse" />
          ))
        ) : profiles.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">
            Hali hech kim ro'yxatdan o'tmagan
          </div>
        ) : (
          profiles.map((profile, i) => (
            <LeaderRow
              key={profile.id}
              rank={i + 1}
              profile={profile}
              isCurrentUser={profile.created_by_id === currentUser?.id}
            />
          ))
        )}
      </div>
    </div>
  );
}