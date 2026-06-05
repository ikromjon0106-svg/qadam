import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Target, Zap, Calendar, Star, CheckCircle2, Lock, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import CoinBadge from '@/components/ui/CoinBadge';
import { Link } from 'react-router-dom';

export default function Missions() {
  const queryClient = useQueryClient();

  const { data: missions, isLoading } = useQuery({
    queryKey: ['missions'],
    queryFn: () => base44.entities.Mission.filter({ is_active: true }),
    initialData: [],
  });

  const { data: userMissions } = useQuery({
    queryKey: ['userMissions'],
    queryFn: () => base44.entities.UserMission.list(),
    initialData: [],
  });

  const { data: profile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by_id: (await base44.auth.me()).id });
      return profiles[0] || null;
    },
  });

  const claimMutation = useMutation({
    mutationFn: async (userMission) => {
      await base44.entities.UserMission.update(userMission.id, { coins_claimed: true });
      const mission = missions.find((m) => m.id === userMission.mission_id);
      if (mission && profile) {
        await base44.entities.UserProfile.update(profile.id, {
          total_coins: (profile.total_coins || 0) + mission.coin_reward,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', 'userMissions'] });
      toast.success("Mukofot olindi! 🎉");
    },
  });

  const getUserMission = (missionId) => userMissions.find((um) => um.mission_id === missionId);

  const daily = missions.filter((m) => m.type === 'daily');
  const weekly = missions.filter((m) => m.type === 'weekly');
  const special = missions.filter((m) => m.type === 'special');

  const MissionCard = ({ mission, delay }) => {
    const um = getUserMission(mission.id);
    const progress = um ? Math.min((um.progress / mission.target_value) * 100, 100) : 0;
    const isPremiumLocked = mission.is_premium && profile?.subscription_type !== 'premium';

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className={`glass rounded-2xl p-4 ${isPremiumLocked ? 'opacity-60' : ''}`}
      >
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            {isPremiumLocked ? (
              <Lock className="w-5 h-5 text-muted-foreground" />
            ) : um?.is_completed ? (
              <CheckCircle2 className="w-5 h-5 text-primary" />
            ) : (
              <Zap className="w-5 h-5 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-semibold truncate">{mission.title}</p>
              {mission.is_premium && (
                <Badge className="bg-accent/20 text-accent-foreground text-[9px] px-1.5">
                  <Star className="w-2.5 h-2.5 mr-0.5" /> Premium
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground mb-2">{mission.description}</p>
            <Progress value={progress} className="h-1.5 mb-2" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                {um?.progress || 0} / {mission.target_value} {mission.target_unit}
              </span>
              {um?.is_completed && !um?.coins_claimed ? (
                <Button
                  size="sm"
                  className="h-6 text-[10px] rounded-full"
                  onClick={() => claimMutation.mutate(um)}
                >
                  Olish +{mission.coin_reward}
                </Button>
              ) : (
                <CoinBadge amount={mission.coin_reward} size="sm" />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <Link to="/">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold font-display">Missiyalar</h1>
          <p className="text-xs text-muted-foreground">Vazifalarni bajaring, tangalar yig'ing</p>
        </div>
      </div>

      <Tabs defaultValue="daily">
        <TabsList className="w-full glass mb-4">
          <TabsTrigger value="daily" className="flex-1 text-xs">
            <Calendar className="w-3 h-3 mr-1" /> Kunlik
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex-1 text-xs">
            <Target className="w-3 h-3 mr-1" /> Haftalik
          </TabsTrigger>
          <TabsTrigger value="special" className="flex-1 text-xs">
            <Star className="w-3 h-3 mr-1" /> Maxsus
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-3">
          {daily.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Kunlik missiyalar yo'q</p>}
          {daily.map((m, i) => <MissionCard key={m.id} mission={m} delay={i * 0.05} />)}
        </TabsContent>
        <TabsContent value="weekly" className="space-y-3">
          {weekly.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Haftalik missiyalar yo'q</p>}
          {weekly.map((m, i) => <MissionCard key={m.id} mission={m} delay={i * 0.05} />)}
        </TabsContent>
        <TabsContent value="special" className="space-y-3">
          {special.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Maxsus missiyalar yo'q</p>}
          {special.map((m, i) => <MissionCard key={m.id} mission={m} delay={i * 0.05} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}