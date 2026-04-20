import './StatCard.css';

export default function StatCard({ icon: Icon, label, value, subtext, variant = 'default', delay = 0 }) {
  return (
    <div 
      className={`stat-card glass-card stat-${variant}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="stat-icon-wrap">
        <Icon size={22} />
      </div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {subtext && <span className="stat-subtext">{subtext}</span>}
      </div>
    </div>
  );
}
