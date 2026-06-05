import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Footprints, Flame, Clock, Coins, Target, ChevronRight, Zap, Shield, Bot, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '@/components/ui/StatCard';
import CoinBadge from '@/components/ui/CoinBadge';
import ActivityRing from '@/components/dashboard/ActivityRing';
import WeeklyChart from '@/components/dashboard/WeeklyChart';

export default function Dashboard() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: profile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by_id: (await base44.auth.me()).id });
      return profiles[0] || null;
    },
  });

  const { data: missions } = useQuery({
    queryKey: ['activeMissions'],
    queryFn: () => base44.entities.Mission.filter({ is_active: true }),
    initialData: [],
  });

  const dailyGoal = 5;
  const todayKm = profile?.daily_steps ? (profile.daily_steps / 1300).toFixed(1) : 0;
  const progress = Math.min((todayKm / dailyGoal) * 100, 100);
  const weeklyData = [2.1, 3.4, 1.8, 4.2, 2.9, 0, parseFloat(todayKm) || 0];

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <p className="text-sm text-muted-foreground">Salom 👋</p>
          <h1 className="text-xl font-bold font-display">
            {profile?.display_name || user?.full_name || 'Qadam yuruvchi'}
          </h1>
        </div>
        <CoinBadge amount={profile?.total_coins || 0} size="md" />
      </motion.div>

      {/* Activity Ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-3xl p-6 flex items-center gap-6"
      >
        <ActivityRing
          progress={progress}
          value={`${todayKm}`}
          label="km bugun"
          size={110}
          strokeWidth={10}
        />
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">Kunlik maqsad</p>
            <p className="text-lg font-bold">{dailyGoal} km</p>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {progress >= 100 ? "Maqsadga erishdingiz! 🎉" : `Yana ${(dailyGoal - todayKm).toFixed(1)} km qoldi`}
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Footprints} label="Jami masofa" value={profile?.total_distance_km?.toFixed(1) || '0'} unit="km" delay={0.2} />
        <StatCard icon={Coins} label="Tangalar" value={profile?.total_coins || 0} color="text-accent-foreground" delay={0.25} />
        <StatCard icon={Flame} label="Kaloriya" value={profile?.total_calories || 0} color="text-destructive" delay={0.3} />
        <StatCard icon={Clock} label="Vaqt" value={profile?.total_time_minutes || 0} unit="daq" delay={0.35} />
      </div>

      {/* Weekly Chart */}
      <WeeklyChart data={weeklyData} />

      {/* Quick Actions */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Tezkor harakatlar</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link to="/map">
            <motion.div
              whileTap={{ scale: 0.97 }}
              className="glass rounded-2xl p-4 flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Footprints className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Yurishni boshlash</p>
                <p className="text-[10px] text-muted-foreground">GPS tracking</p>
              </div>
            </motion.div>
          </Link>
          <Link to="/missions">
            <motion.div
              whileTap={{ scale: 0.97 }}
              className="glass rounded-2xl p-4 flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold">Missiyalar</p>
                <p className="text-[10px] text-muted-foreground">{missions?.length || 0} faol</p>
              </div>
            </motion.div>
          </Link>
          <Link to="/ai-coach">
            <motion.div
              whileTap={{ scale: 0.97 }}
              className="glass rounded-2xl p-4 flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">AI Murabbiy</p>
                <p className="text-[10px] text-muted-foreground">Shaxsiy maslahat</p>
              </div>
            </motion.div>
          </Link>
          <Link to="/leaderboard">
            <motion.div
              whileTap={{ scale: 0.97 }}
              className="glass rounded-2xl p-4 flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold">Reyting</p>
                <p className="text-[10px] text-muted-foreground">O'rningizni ko'ring</p>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Active Missions Preview */}
      {missions?.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Faol missiyalar</h3>
            <Link to="/missions" className="text-xs text-primary flex items-center gap-0.5">
              Hammasi <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {missions.slice(0, 2).map((mission, i) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="glass rounded-2xl p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{mission.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {mission.target_value} {mission.target_unit} · +{mission.coin_reward} tanga
                </p>
              </div>
              {mission.is_premium && (
                <Shield className="w-4 h-4 text-accent-foreground" />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}