import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trophy } from 'lucide-react';
import ReminderSettings from '@/components/profile/ReminderSettings';
import { motion } from 'framer-motion';
import {
  User, Settings, LogOut, Crown, Footprints, Coins, Flame,
  Clock, Award, Edit3, ChevronRight, Shield, Share2, Moon, Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import CoinBadge from '@/components/ui/CoinBadge';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [editOpen, setEditOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: profile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by_id: (await base44.auth.me()).id });
      if (profiles[0]) return profiles[0];
      const me = await base44.auth.me();
      const newProfile = await base44.entities.UserProfile.create({
        display_name: me.full_name || 'Foydalanuvchi',
        referral_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      });
      return newProfile;
    },
  });

  const { data: allProfiles } = useQuery({
    queryKey: ['leaderboardAll'],
    queryFn: () => base44.entities.UserProfile.list('-total_coins', 100),
    initialData: [],
  });

  const myRank = user && allProfiles
    ? (allProfiles.findIndex(p => p.created_by_id === user.id) + 1) || null
    : null;

  const [editForm, setEditForm] = useState({
    display_name: '',
    height_cm: '',
    weight_kg: '',
  });

  useEffect(() => {
    if (profile) {
      setEditForm({
        display_name: profile.display_name || '',
        height_cm: profile.height_cm || '',
        weight_kg: profile.weight_kg || '',
      });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.UserProfile.update(profile.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      setEditOpen(false);
      toast.success("Profil yangilandi");
    },
  });

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode(!darkMode);
  };

  const stats = [
    { icon: Footprints, label: 'Jami masofa', value: `${profile?.total_distance_km?.toFixed(1) || 0} km` },
    { icon: Coins, label: 'Tangalar', value: profile?.total_coins || 0 },
    { icon: Flame, label: 'Kaloriya', value: profile?.total_calories || 0 },
    { icon: Clock, label: 'Vaqt', value: `${profile?.total_time_minutes || 0} daq` },
    { icon: Award, label: 'Daraja', value: profile?.level || 1 },
    { icon: Shield, label: 'Kun ketma-ket', value: `${profile?.streak_days || 0} kun` },
  ];

  const menuItems = [
    { icon: Award, label: "Yutuqlar", path: "/achievements" },
    { icon: Footprints, label: "Missiyalar", path: "/missions" },
    { icon: Share2, label: "Do'stlarni taklif qilish", path: "/referral" },
    { icon: Crown, label: "Premium obuna", path: "/subscription" },
    ...(user?.role === 'admin' ? [{ icon: Settings, label: "Admin panel", path: "/admin" }] : []),
  ];

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto space-y-5">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-6 text-center relative"
      >
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute top-4 right-4">
              <Edit3 className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Profilni tahrirlash</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Ism</Label>
                <Input
                  value={editForm.display_name}
                  onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Bo'yi (sm)</Label>
                  <Input
                    type="number"
                    value={editForm.height_cm}
                    onChange={(e) => setEditForm({ ...editForm, height_cm: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Vazni (kg)</Label>
                  <Input
                    type="number"
                    value={editForm.weight_kg}
                    onChange={(e) => setEditForm({ ...editForm, weight_kg: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => updateMutation.mutate(editForm)}
                disabled={updateMutation.isPending}
              >
                Saqlash
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-3">
          {(profile?.display_name || 'U')[0].toUpperCase()}
        </div>
        <h2 className="text-lg font-bold font-display">{profile?.display_name || user?.full_name}</h2>
        <p className="text-xs text-muted-foreground mb-2">{user?.email}</p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Badge variant={profile?.subscription_type === 'premium' ? 'default' : 'secondary'} className="text-[10px]">
            {profile?.subscription_type === 'premium' ? (
              <><Crown className="w-3 h-3 mr-1" /> Premium</>
            ) : 'Bepul'}
          </Badge>
          <CoinBadge amount={profile?.total_coins || 0} size="sm" />
          {myRank > 0 && (
            <Badge variant="outline" className="text-[10px] gap-1">
              <Trophy className="w-3 h-3 text-primary" />
              #{myRank}-o'rin
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="glass rounded-xl p-3 text-center"
          >
            <stat.icon className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-sm font-bold">{stat.value}</p>
            <p className="text-[9px] text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Menu */}
      <div className="space-y-1.5">
        {menuItems.map((item, i) => (
          <Link key={i} to={item.path}>
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="flex-1 text-sm font-medium">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </Link>
        ))}

        {/* Reminder Settings */}
        <ReminderSettings />

        {/* Dark Mode Toggle */}
        <div className="flex items-center gap-3 p-3 rounded-xl">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            {darkMode ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-primary" />}
          </div>
          <span className="flex-1 text-sm font-medium">Tungi rejim</span>
          <Switch checked={darkMode} onCheckedChange={toggleDark} />
        </div>
      </div>

      {/* Logout */}
      <Button
        variant="outline"
        className="w-full rounded-xl"
        onClick={() => base44.auth.logout()}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Chiqish
      </Button>
    </div>
  );
}