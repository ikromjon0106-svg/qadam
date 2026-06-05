import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function AdminCompetitions() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', type: 'global', prize_pool: '', start_date: '', end_date: '',
  });
  const queryClient = useQueryClient();

  const { data: competitions } = useQuery({
    queryKey: ['adminCompetitions'],
    queryFn: () => base44.entities.Competition.list('-created_date'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Competition.create({ ...data, is_active: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCompetitions'] });
      setShowForm(false);
      toast.success("Musobaqa qo'shildi");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Competition.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCompetitions'] });
      toast.success("O'chirildi");
    },
  });

  return (
    <div className="space-y-4">
      <Button size="sm" onClick={() => setShowForm(!showForm)} className="rounded-full">
        <Plus className="w-4 h-4 mr-1" /> Musobaqa qo'shish
      </Button>

      {showForm && (
        <div className="glass rounded-xl p-4 space-y-3">
          <div>
            <Label className="text-xs">Sarlavha</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Tavsif</Label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Turi</Label>
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="section">Guruh</SelectItem>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Mukofot fondi</Label>
            <Input value={form.prize_pool} onChange={(e) => setForm({ ...form, prize_pool: e.target.value })} placeholder="$500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Boshlanish</Label>
              <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">Tugash</Label>
              <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
            </div>
          </div>
          <Button className="w-full" onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending || !form.title}>
            Saqlash
          </Button>
        </div>
      )}

      {competitions.map((c) => (
        <div key={c.id} className="glass rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-accent-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{c.title}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[9px]">{c.type}</Badge>
              {c.prize_pool && <span className="text-[10px] text-muted-foreground">{c.prize_pool}</span>}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(c.id)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}