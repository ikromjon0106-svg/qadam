import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Award, ChevronLeft, Lock, Check, Footprints, Coins, Flame, Map, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const categoryIcons = {
  distance: Footprints,
  coins: Coins,
  streak: Flame,
  exploration: Map,
  social: Users,
  special: Star,
};

const categoryLabels = {
  distance: 'Masofa',
  coins: 'Tangalar',
  streak: "Ketma-ketlik",
  exploration: "Kashfiyot",
  social: 'Ijtimoiy',
  special: 'Maxsus',
};

export default function Achievements() {
  const { data: achievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => base44.entities.Achievement.list(),
    initialData: [],
  });

  const { data: userAchievements } = useQuery({
    queryKey: ['userAchievements'],
    queryFn: () => base44.entities.UserAchievement.list(),
    initialData: [],
  });

  const isUnlocked = (achievementId) =>
    userAchievements.some((ua) => ua.achievement_id === achievementId);

  const categories = [...new Set(achievements.map((a) => a.category))];
  const unlockedCount = userAchievements.length;
  const totalCount = achievements.length;

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <Link to="/profile">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold font-display">Yutuqlar</h1>
          <p className="text-xs text-muted-foreground">{unlockedCount} / {totalCount} ochilgan</p>
        </div>
      </div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-2xl p-5 mb-5 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Award className="w-8 h-8 text-primary" />
        </div>
        <p className="text-2xl font-bold font-display">{unlockedCount}</p>
        <p className="text-xs text-muted-foreground">Yutuqlar ochilgan</p>
        <div className="w-full bg-muted rounded-full h-2 mt-3">
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${totalCount ? (unlockedCount / totalCount) * 100 : 0}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </motion.div>

      {/* Achievements by category */}
      {categories.map((cat) => {
        const Icon = categoryIcons[cat] || Award;
        const catAchievements = achievements.filter((a) => a.category === cat);

        return (
          <div key={cat} className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">{categoryLabels[cat] || cat}</h3>
              <Badge variant="secondary" className="text-[9px] ml-auto">
                {catAchievements.filter((a) => isUnlocked(a.id)).length}/{catAchievements.length}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {catAchievements.map((ach, i) => {
                const unlocked = isUnlocked(ach.id);
                return (
                  <motion.div
                    key={ach.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`glass rounded-xl p-3 text-center ${!unlocked ? 'opacity-40' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                      unlocked ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      {unlocked ? (
                        <Check className="w-5 h-5 text-primary" />
                      ) : (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-[10px] font-medium leading-tight">{ach.title}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}

      {achievements.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Yutuqlar hali qo'shilmagan</p>
        </div>
      )}
    </div>
  );
}