import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, unit, color = 'text-primary', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass rounded-2xl p-4 flex flex-col items-center gap-1"
    >
      <div className={`w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <span className="text-xl font-bold font-display">{value}</span>
      <span className="text-[11px] text-muted-foreground">{unit ? `${label} (${unit})` : label}</span>
    </motion.div>
  );
}