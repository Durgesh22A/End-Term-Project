import { useMemo } from 'react';
import './BudgetBar.css';

export default function BudgetBar({ spent, budget, currency = '₹', showLabels = true, size = 'md' }) {
  const { percentage, status, statusLabel } = useMemo(() => {
    if (!budget || budget <= 0) return { percentage: 0, status: 'default', statusLabel: 'No budget set' };
    
    const pct = Math.min((spent / budget) * 100, 100);
    let status = 'safe';
    let statusLabel = 'Under budget';
    
    if (pct >= 100) {
      status = 'danger';
      statusLabel = 'Over budget!';
    } else if (pct >= 80) {
      status = 'warning';
      statusLabel = 'Almost there';
    } else if (pct >= 50) {
      status = 'moderate';
      statusLabel = 'Halfway';
    }
    
    return { percentage: pct, status, statusLabel };
  }, [spent, budget]);

  const overBudget = spent > budget;

  return (
    <div className={`budget-bar-container budget-bar-${size}`}>
      {showLabels && (
        <div className="budget-bar-header">
          <span className="budget-spent">
            {currency}{spent.toLocaleString('en-IN')}
            <span className="budget-of"> of {currency}{budget.toLocaleString('en-IN')}</span>
          </span>
          <span className={`budget-status budget-status-${status}`}>
            {statusLabel}
          </span>
        </div>
      )}
      <div className="budget-bar-track">
        <div 
          className={`budget-bar-fill budget-fill-${status}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {showLabels && (
        <div className="budget-bar-footer">
          <span className="budget-percentage">{percentage.toFixed(0)}% used</span>
          {overBudget ? (
            <span className="budget-over">
              {currency}{(spent - budget).toLocaleString('en-IN')} over
            </span>
          ) : (
            <span className="budget-remaining">
              {currency}{(budget - spent).toLocaleString('en-IN')} remaining
            </span>
          )}
        </div>
      )}
    </div>
  );
}
