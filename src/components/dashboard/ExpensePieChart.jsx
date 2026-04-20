import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getCategoryInfo } from '../../utils/categoryIcons';
import './ExpensePieChart.css';

const COLORS = ['#f97316', '#8b5cf6', '#3b82f6', '#14b8a6', '#ec4899', '#6b7280'];

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="pie-tooltip glass-card">
        <span className="pie-tooltip-label">{data.emoji} {data.name}</span>
        <span className="pie-tooltip-value">₹{data.value.toLocaleString('en-IN')}</span>
        <span className="pie-tooltip-pct">{data.percentage.toFixed(1)}%</span>
      </div>
    );
  }
  return null;
}

export default function ExpensePieChart({ byCategory, total }) {
  const chartData = useMemo(() => {
    return Object.entries(byCategory).map(([key, data]) => {
      const info = getCategoryInfo(key);
      return {
        name: info.label,
        emoji: info.emoji,
        value: data.total,
        color: info.color,
        percentage: total > 0 ? (data.total / total) * 100 : 0,
      };
    }).sort((a, b) => b.value - a.value);
  }, [byCategory, total]);

  if (chartData.length === 0) {
    return (
      <div className="pie-empty">
        <p>No expenses yet</p>
      </div>
    );
  }

  return (
    <div className="pie-chart-container">
      <div className="pie-chart-wrapper">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="pie-legend">
        {chartData.map((item, index) => (
          <div key={index} className="pie-legend-item">
            <span className="pie-legend-dot" style={{ background: item.color }} />
            <span className="pie-legend-label">{item.emoji} {item.name}</span>
            <span className="pie-legend-value">₹{item.value.toLocaleString('en-IN')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
