import { Trash2, Edit3 } from 'lucide-react';
import { getCategoryInfo } from '../../utils/categoryIcons';
import './ExpenseCard.css';

export default function ExpenseCard({ expense, currency = '₹', onEdit, onDelete }) {
  const category = getCategoryInfo(expense.category);
  const date = expense.date?.toDate ? expense.date.toDate() : new Date(expense.date);
  const formattedDate = date.toLocaleDateString('en-IN', { 
    month: 'short', day: 'numeric' 
  });

  return (
    <div className="expense-card">
      <div className="expense-category-icon" style={{ background: `${category.color}18`, color: category.color }}>
        <span>{category.emoji}</span>
      </div>
      <div className="expense-info">
        <span className="expense-desc">{expense.description || category.label}</span>
        <span className="expense-meta">{category.label} • {formattedDate}</span>
      </div>
      <div className="expense-amount">
        <span className="expense-value">{currency}{expense.amount?.toLocaleString('en-IN')}</span>
      </div>
      <div className="expense-actions">
        {onEdit && (
          <button className="expense-action-btn" onClick={() => onEdit(expense)} title="Edit">
            <Edit3 size={14} />
          </button>
        )}
        {onDelete && (
          <button className="expense-action-btn expense-delete-btn" onClick={() => onDelete(expense.id)} title="Delete">
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
