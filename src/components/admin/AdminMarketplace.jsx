import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Package } from 'lucide-react';
import { toast } from 'sonner';
import CoinBadge from '@/components/ui/CoinBadge';

export default function AdminMarketplace() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', coin_price: 100, category: 'sports', stock: 10, is_premium_only: false });
  const queryClient = useQueryClient();

  const { data: items } = useQuery({
    queryKey: ['adminItems'],
    queryFn: () => base44.entities.MarketplaceItem.list('-created_date'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.MarketplaceItem.create({ ...data, is_active: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminItems', 'marketplaceItems'] });
      setShowForm(false);
      setForm({ name: '', description: '', coin_price: 100, category: 'sports', stock: 10, is_premium_only: false });
      toast.success("Mahsulot qo'shildi");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.MarketplaceItem.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminItems', 'marketplaceItems'] });
      toast.success("O'chirildi");
    },
  });

  return (
    <div className="space-y-4">
      <Button size="sm" onClick={() => setShowForm(!showForm)} className="rounded-full">
        <Plus className="w-4 h-4 mr-1" /> Mahsulot qo'shish
      </Button>

      {showForm && (
        <div className="glass rounded-xl p-4 space-y-3">
          <div>
            <Label className="text-xs">Nomi</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Mahsulot nomi" />
          </div>
          <div>
            <Label className="text-xs">Tavsif</Label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Narxi (tanga)</Label>
              <Input type="number" value={form.coin_price} onChange={(e) => setForm({ ...form, coin_price: parseInt(e.target.value) })} />
            </div>
            <div>
              <Label className="text-xs">Ombor</Label>
              <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })} />
            </div>
          </div>
          <div>
            <Label className="text-xs">Kategoriya</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sports">Sport</SelectItem>
                <SelectItem value="coupons">Kuponlar</SelectItem>
                <SelectItem value="accessories">Aksessuarlar</SelectItem>
                <SelectItem value="sponsor">Hamkorlar</SelectItem>
                <SelectItem value="vouchers">Chegirmalar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.is_premium_only} onCheckedChange={(v) => setForm({ ...form, is_premium_only: v })} />
            <Label className="text-xs">Faqat Premium</Label>
          </div>
          <Button className="w-full" onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending || !form.name}>
            Saqlash
          </Button>
        </div>
      )}

      {items.map((item) => (
        <div key={item.id} className="glass rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Package className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{item.name}</p>
            <div className="flex items-center gap-2">
              <CoinBadge amount={item.coin_price} size="sm" />
              <span className="text-[10px] text-muted-foreground">Ombor: {item.stock}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(item.id)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}