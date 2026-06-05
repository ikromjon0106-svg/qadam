import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users, Coins, Footprints, ShoppingBag, Trophy, Target,
  AlertTriangle, Crown, ChevronLeft, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminMarketplace from '@/components/admin/AdminMarketplace';
import AdminMissions from '@/components/admin/AdminMissions';
import AdminCompetitions from '@/components/admin/AdminCompetitions';

function StatBox({ icon: Icon, label, value, color = 'text-primary' }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-[11px] text-muted-foreground">{label}</span>
      </div>
      <p className="text-xl font-bold font-display">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: profiles } = useQuery({
    queryKey: ['allProfiles'],
    queryFn: () => base44.entities.UserProfile.list('-created_date', 1000),
    initialData: [],
  });

  const { data: activities } = useQuery({
    queryKey: ['allActivities'],
    queryFn: () => base44.entities.Activity.list('-created_date', 100),
    initialData: [],
  });

  const { data: orders } = useQuery({
    queryKey: ['allOrders'],
    queryFn: () => base44.entities.Order.list('-created_date', 100),
    initialData: [],
  });

  const totalUsers = profiles.length;
  const premiumUsers = profiles.filter((p) => p.subscription_type === 'premium').length;
  const totalDistance = profiles.reduce((s, p) => s + (p.total_distance_km || 0), 0);
  const totalCoins = profiles.reduce((s, p) => s + (p.total_coins || 0), 0);
  const flaggedUsers = profiles.filter((p) => p.is_flagged).length;

  return (
    <div className="px-4 pt-6 pb-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <Link to="/">
          <Button variant="ghost" size="icon"><ChevronLeft className="w-5 h-5" /></Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold font-display">Admin Panel</h1>
          <p className="text-xs text-muted-foreground">Ilovani boshqarish</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <StatBox icon={Users} label="Foydalanuvchilar" value={totalUsers} />
        <StatBox icon={Crown} label="Premium" value={premiumUsers} color="text-accent-foreground" />
        <StatBox icon={Footprints} label="Jami masofa (km)" value={totalDistance.toFixed(0)} />
        <StatBox icon={Coins} label="Jami tangalar" value={totalCoins} />
        <StatBox icon={ShoppingBag} label="Buyurtmalar" value={orders.length} />
        <StatBox icon={AlertTriangle} label="Shubhali" value={flaggedUsers} color="text-destructive" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users">
        <TabsList className="w-full glass mb-4 flex-wrap h-auto">
          <TabsTrigger value="users" className="text-xs"><Users className="w-3 h-3 mr-1" />Foydalanuvchilar</TabsTrigger>
          <TabsTrigger value="marketplace" className="text-xs"><ShoppingBag className="w-3 h-3 mr-1" />Do'kon</TabsTrigger>
          <TabsTrigger value="missions" className="text-xs"><Target className="w-3 h-3 mr-1" />Missiyalar</TabsTrigger>
          <TabsTrigger value="competitions" className="text-xs"><Trophy className="w-3 h-3 mr-1" />Musobaqalar</TabsTrigger>
        </TabsList>

        <TabsContent value="users"><AdminUsers profiles={profiles} /></TabsContent>
        <TabsContent value="marketplace"><AdminMarketplace /></TabsContent>
        <TabsContent value="missions"><AdminMissions /></TabsContent>
        <TabsContent value="competitions"><AdminCompetitions /></TabsContent>
      </Tabs>
    </div>
  );
}