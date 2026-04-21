import {
  Wallet,
  Calendar,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';

/**
 * Consolidated panel showing budget, best time, culture tips, and safety notes.
 */
export default function TravelInfoPanel({ data }) {
  const { budget_estimate, best_time, culture_tips, safety_notes } = data;

  const panels = [
    {
      icon: Wallet,
      title: 'Budget Estimate',
      color: 'var(--accent-primary)',
      bgColor: 'var(--accent-primary-light)',
      content: (
        <div className="info-budget-grid">
          <div className="info-budget-item">
            <span className="info-budget-label">💰 Budget</span>
            <span className="info-budget-value">{budget_estimate?.budget || 'N/A'}</span>
          </div>
          <div className="info-budget-item">
            <span className="info-budget-label">🏨 Moderate</span>
            <span className="info-budget-value">{budget_estimate?.moderate || 'N/A'}</span>
          </div>
          <div className="info-budget-item">
            <span className="info-budget-label">✨ Luxury</span>
            <span className="info-budget-value">{budget_estimate?.luxury || 'N/A'}</span>
          </div>
        </div>
      ),
    },
    {
      icon: Calendar,
      title: 'Best Time to Visit',
      color: 'var(--accent-secondary)',
      bgColor: 'var(--accent-secondary-light)',
      content: (
        <p className="info-text">{best_time || 'Information not available.'}</p>
      ),
    },
    {
      icon: BookOpen,
      title: 'Culture Tips',
      color: 'var(--accent-warning)',
      bgColor: 'var(--accent-warning-light)',
      content: (
        <ul className="info-tips-list">
          {(culture_tips || []).map((tip, i) => (
            <li key={i} className="info-tip-item">
              <span className="info-tip-bullet">→</span>
              {tip}
            </li>
          ))}
        </ul>
      ),
    },
    {
      icon: ShieldCheck,
      title: 'Safety Notes',
      color: 'var(--accent-success)',
      bgColor: 'var(--accent-success-light)',
      content: (
        <p className="info-text">{safety_notes || 'Exercise normal precautions.'}</p>
      ),
    },
  ];

  return (
    <div className="travel-info-panel">
      <h2 className="explore-section-title">
        <span className="explore-section-icon">🧳</span>
        Travel Essentials
      </h2>
      <div className="info-cards-grid">
        {panels.map((panel, i) => (
          <div
            key={i}
            className="info-card glass-card"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="info-card-header">
              <div
                className="info-card-icon"
                style={{ background: panel.bgColor, color: panel.color }}
              >
                <panel.icon size={20} />
              </div>
              <h3 className="info-card-title">{panel.title}</h3>
            </div>
            <div className="info-card-content">
              {panel.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
