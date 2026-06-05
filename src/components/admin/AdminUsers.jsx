import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Ban, Crown } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUsers({ profiles = [] }) {
  const queryClient = useQueryClient();

  const flagMutation = useMutation({
    mutationFn: async ({ id, is_flagged }) => {
      await base44.entities.UserProfile.update(id, { is_flagged, flag_reason: is_flagged ? 'Admin tomonidan belgilangan' : '' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allProfiles'] });
      toast.success("Foydalanuvchi yangilandi");
    },
  });

  return (
    <div className="space-y-2">
      {profiles.map((p) => (
        <div key={p.id} className="glass rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
            {(p.display_name || 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold truncate">{p.display_name}</p>
              {p.subscription_type === 'premium' && <Crown className="w-3 h-3 text-accent-foreground" />}
              {p.is_flagged && <AlertTriangle className="w-3 h-3 text-destructive" />}
            </div>
            <p className="text-[10px] text-muted-foreground">
              {p.total_distance_km?.toFixed(1) || 0} km · {p.total_coins || 0} tanga
            </p>
          </div>
          <Button
            variant={p.is_flagged ? 'outline' : 'destructive'}
            size="sm"
            className="text-[10px] h-7"
            onClick={() => flagMutation.mutate({ id: p.id, is_flagged: !p.is_flagged })}
          >
            {p.is_flagged ? <Shield className="w-3 h-3 mr-1" /> : <Ban className="w-3 h-3 mr-1" />}
            {p.is_flagged ? 'Ochish' : 'Belgilash'}
          </Button>
        </div>
      ))}
      {profiles.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">Foydalanuvchilar yo'q</p>
      )}
    </div>
  );
}