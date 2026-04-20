import ExpenseCard from './ExpenseCard';
import { Receipt } from 'lucide-react';
import './ExpenseList.css';

export default function ExpenseList({ expenses, currency, onEdit, onDelete }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <Receipt size={48} />
        </div>
        <h3 className="empty-state-title">No expenses yet</h3>
        <p className="empty-state-text">
          Start tracking your spending by adding your first expense.
        </p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          currency={currency}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
