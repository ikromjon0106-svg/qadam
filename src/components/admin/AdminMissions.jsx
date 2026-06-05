import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Zap } from 'lucide-react';
import { toast } from 'sonner';
import CoinBadge from '@/components/ui/CoinBadge';

export default function AdminMissions() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', type: 'daily', target_value: 5, target_unit: 'km', coin_reward: 25, is_premium: false,
  });
  const queryClient = useQueryClient();

  const { data: missions } = useQuery({
    queryKey: ['adminMissions'],
    queryFn: () => base44.entities.Mission.list('-created_date'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Mission.create({ ...data, is_active: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMissions', 'missions'] });
      setShowForm(false);
      toast.success("Missiya qo'shildi");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Mission.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMissions', 'missions'] });
      toast.success("O'chirildi");
    },
  });

  return (
    <div className="space-y-4">
      <Button size="sm" onClick={() => setShowForm(!showForm)} className="rounded-full">
        <Plus className="w-4 h-4 mr-1" /> Missiya qo'shish
      </Button>

      {showForm && (
        <div className="glass rounded-xl p-4 space-y-3">
          <div>
            <Label className="text-xs">Sarlavha</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Missiya nomi" />
          </div>
          <div>
            <Label className="text-xs">Tavsif</Label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Turi</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Kunlik</SelectItem>
                  <SelectItem value="weekly">Haftalik</SelectItem>
                  <SelectItem value="special">Maxsus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Birlik</Label>
              <Select value={form.target_unit} onValueChange={(v) => setForm({ ...form, target_unit: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="km">Km</SelectItem>
                  <SelectItem value="calories">Kaloriya</SelectItem>
                  <SelectItem value="routes">Yo'nalish</SelectItem>
                  <SelectItem value="coins">Tanga</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Maqsad</Label>
              <Input type="number" value={form.target_value} onChange={(e) => setForm({ ...form, target_value: parseInt(e.target.value) })} />
            </div>
            <div>
              <Label className="text-xs">Mukofot (tanga)</Label>
              <Input type="number" value={form.coin_reward} onChange={(e) => setForm({ ...form, coin_reward: parseInt(e.target.value) })} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.is_premium} onCheckedChange={(v) => setForm({ ...form, is_premium: v })} />
            <Label className="text-xs">Faqat Premium</Label>
          </div>
          <Button className="w-full" onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending || !form.title}>
            Saqlash
          </Button>
        </div>
      )}

      {missions.map((m) => (
        <div key={m.id} className="glass rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{m.title}</p>
            <p className="text-[10px] text-muted-foreground">
              {m.type} · {m.target_value} {m.target_unit}
            </p>
          </div>
          <CoinBadge amount={m.coin_reward} size="sm" />
          <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(m.id)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}