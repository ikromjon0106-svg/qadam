import { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// Analog clock face showing the set reminder time
function AnalogClock({ hours, minutes }) {
  const h = hours % 12;
  const hourDeg = h * 30 + minutes * 0.5;
  const minDeg = minutes * 6;

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Face */}
      <circle cx="50" cy="50" r="46" fill="hsl(var(--primary)/0.08)" stroke="hsl(var(--primary)/0.2)" strokeWidth="1.5" />
      {/* Hour marks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x1 = 50 + 38 * Math.cos(angle);
        const y1 = 50 + 38 * Math.sin(angle);
        const x2 = 50 + 43 * Math.cos(angle);
        const y2 = 50 + 43 * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="hsl(var(--primary)/0.4)" strokeWidth="2" strokeLinecap="round" />;
      })}
      {/* Hour hand */}
      <line
        x1="50" y1="50"
        x2={50 + 24 * Math.cos((hourDeg - 90) * Math.PI / 180)}
        y2={50 + 24 * Math.sin((hourDeg - 90) * Math.PI / 180)}
        stroke="hsl(var(--foreground))" strokeWidth="3" strokeLinecap="round"
      />
      {/* Minute hand */}
      <line
        x1="50" y1="50"
        x2={50 + 34 * Math.cos((minDeg - 90) * Math.PI / 180)}
        y2={50 + 34 * Math.sin((minDeg - 90) * Math.PI / 180)}
        stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round"
      />
      {/* Center dot */}
      <circle cx="50" cy="50" r="3.5" fill="hsl(var(--primary))" />
    </svg>
  );
}

// Scroll-wheel hour/minute picker
function TimeWheel({ value, max, onChange, label }) {
  const items = Array.from({ length: max }, (_, i) => String(i).padStart(2, '0'));
  const handleUp = () => onChange((value - 1 + max) % max);
  const handleDown = () => onChange((value + 1) % max);

  return (
    <div className="flex flex-col items-center gap-1">
      <button onClick={handleUp} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-primary/10 transition-colors text-muted-foreground text-lg font-light select-none">
        ‹
      </button>
      <div className="w-14 h-12 flex items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
        <span className="text-2xl font-bold font-display text-primary">{items[value]}</span>
      </div>
      <button onClick={handleDown} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-primary/10 transition-colors text-muted-foreground text-lg font-light select-none">
        ›
      </button>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</span>
    </div>
  );
}

function scheduleNotification(t) {
  const [hours, minutes] = t.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  const delay = target - now;
  if (window._qadamReminderTimer) clearTimeout(window._qadamReminderTimer);
  window._qadamReminderTimer = setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification('Qadam — Yurish vaqti! 🏃', {
        body: 'Bugungi qadamingizni boshlash vaqti keldi!',
        icon: '/favicon.ico',
      });
    }
    scheduleNotification(t);
  }, delay);
}

export default function ReminderSettings() {
  const [enabled, setEnabled] = useState(false);
  const [hours, setHours] = useState(8);
  const [minutes, setMinutes] = useState(0);
  const [permission, setPermission] = useState(() => Notification?.permission || 'default');

  const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  useEffect(() => {
    const saved = localStorage.getItem('qadam_reminder');
    if (saved) {
      const parsed = JSON.parse(saved);
      setEnabled(parsed.enabled || false);
      if (parsed.time) {
        const [h, m] = parsed.time.split(':').map(Number);
        setHours(h);
        setMinutes(m);
      }
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('qadam_reminder');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.enabled && Notification?.permission === 'granted') {
        scheduleNotification(parsed.time || '08:00');
      }
    }
  }, []);

  const save = (newEnabled, h, m) => {
    const t = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    localStorage.setItem('qadam_reminder', JSON.stringify({ enabled: newEnabled, time: t }));
    return t;
  };

  const handleToggle = async (val) => {
    if (val && permission !== 'granted') {
      if (!('Notification' in window)) { toast.error("Brauzer bildirishnomalarni qo'llab-quvvatlamaydi"); return; }
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== 'granted') { toast.error("Bildirishnoma ruxsati berilmadi"); return; }
    }
    setEnabled(val);
    const t = save(val, hours, minutes);
    if (val) { toast.success(`Eslatma ${t} ga sozlandi`); scheduleNotification(t); }
    else toast.info("Eslatma o'chirildi");
  };

  const handleHours = (h) => { setHours(h); if (enabled) { const t = save(enabled, h, minutes); scheduleNotification(t); } else save(enabled, h, minutes); };
  const handleMinutes = (m) => { setMinutes(m); if (enabled) { const t = save(enabled, hours, m); scheduleNotification(t); } else save(enabled, hours, m); };

  return (
    <div className="mx-1">
      {/* Card */}
      <div className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden ${enabled ? 'border-primary/30 bg-primary/5' : 'border-border bg-muted/20'}`}>
        {/* Header row */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${enabled ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            {enabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Kunlik eslatma</p>
            <p className="text-[11px] text-muted-foreground">
              {enabled ? `Har kuni soat ${timeStr} da` : "O'chirilgan"}
            </p>
          </div>
          <Switch checked={enabled} onCheckedChange={handleToggle} />
        </div>

        {/* Time picker panel */}
        <AnimatePresence>
          {enabled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-5 pt-1">
                <div className="h-px bg-border/60 mb-4" />
                <div className="flex items-center justify-center gap-6">
                  {/* Analog clock */}
                  <div className="w-24 h-24 flex-shrink-0">
                    <AnalogClock hours={hours} minutes={minutes} />
                  </div>

                  {/* Separator */}
                  <div className="h-20 w-px bg-border/60" />

                  {/* Wheel pickers */}
                  <div className="flex items-center gap-2">
                    <TimeWheel value={hours} max={24} onChange={handleHours} label="Soat" />
                    <span className="text-2xl font-bold text-primary mb-4">:</span>
                    <TimeWheel value={minutes} max={60} onChange={handleMinutes} label="Daqiqa" />
                  </div>
                </div>

                {/* Digital display */}
                <div className="mt-4 flex justify-center">
                  <div className="inline-flex items-center gap-2 bg-background border border-primary/20 rounded-2xl px-5 py-2.5 shadow-sm">
                    <Bell className="w-3.5 h-3.5 text-primary" />
                    <span className="text-lg font-bold font-display tracking-widest text-primary">{timeStr}</span>
                    <span className="text-[11px] text-muted-foreground">har kuni</span>
                  </div>
                </div>

                {permission === 'denied' && (
                  <p className="text-xs text-destructive text-center mt-3">
                    ⚠️ Brauzer bildirishnomalarni bloklagan. Sozlamalardan ruxsat bering.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}