import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const dayNames = ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya'];

export default function WeeklyChart({ data }) {
  const chartData = dayNames.map((day, i) => ({
    name: day,
    km: data?.[i] || 0,
  }));

  return (
    <div className="glass rounded-2xl p-4">
      <h3 className="text-sm font-semibold mb-3">Haftalik faollik</h3>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap="30%">
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                fontSize: '12px',
              }}
              formatter={(val) => [`${val} km`, 'Masofa']}
            />
            <Bar
              dataKey="km"
              fill="hsl(var(--primary))"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}