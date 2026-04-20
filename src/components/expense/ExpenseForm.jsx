import { useState, useRef, useEffect } from 'react';
import { CATEGORIES } from '../../utils/categoryIcons';
import Button from '../common/Button';
import './ExpenseForm.css';

export default function ExpenseForm({ onSubmit, initialData = null, loading = false, currency = 'INR' }) {
  const [formData, setFormData] = useState({
    amount: initialData?.amount || '',
    category: initialData?.category || 'food',
    description: initialData?.description || '',
    date: initialData?.date 
      ? (initialData.date.toDate ? initialData.date.toDate().toISOString().split('T')[0] : new Date(initialData.date).toISOString().split('T')[0])
      : new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState({});
  const amountRef = useRef(null);

  useEffect(() => {
    if (amountRef.current && !initialData) {
      amountRef.current.focus();
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Enter a valid amount';
    }
    if (!formData.date) {
      newErrors.date = 'Select a date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    onSubmit({
      ...formData,
      amount: Number(formData.amount),
      date: new Date(formData.date),
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      {/* Amount */}
      <div className="form-group">
        <label className="form-label" htmlFor="expense-amount">Amount ({currency})</label>
        <input
          ref={amountRef}
          id="expense-amount"
          type="number"
          className={`form-input ${errors.amount ? 'error' : ''}`}
          placeholder="0.00"
          value={formData.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
          min="0"
          step="0.01"
        />
        {errors.amount && <span className="form-error">{errors.amount}</span>}
      </div>

      {/* Category */}
      <div className="form-group">
        <label className="form-label">Category</label>
        <div className="category-grid">
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              type="button"
              className={`category-chip ${formData.category === key ? 'category-chip-active' : ''}`}
              onClick={() => handleChange('category', key)}
              style={formData.category === key ? { borderColor: cat.color, background: `${cat.color}18` } : {}}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label" htmlFor="expense-desc">Description (optional)</label>
        <input
          id="expense-desc"
          type="text"
          className="form-input"
          placeholder="e.g., Beach shack dinner"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          maxLength={100}
        />
      </div>

      {/* Date */}
      <div className="form-group">
        <label className="form-label" htmlFor="expense-date">Date</label>
        <input
          id="expense-date"
          type="date"
          className={`form-input ${errors.date ? 'error' : ''}`}
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
        />
        {errors.date && <span className="form-error">{errors.date}</span>}
      </div>

      <Button type="submit" loading={loading} fullWidth>
        {initialData ? 'Update Expense' : 'Add Expense'}
      </Button>
    </form>
  );
}
