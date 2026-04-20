import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import ExpenseForm from '../components/expense/ExpenseForm';
import { useExpenses } from '../hooks/useExpenses';
import './AddExpense.css';

export default function AddExpense() {
  const navigate = useNavigate();
  const { trips } = useTrips();
  const [selectedTrip, setSelectedTrip] = useState(trips[0]?.id || '');
  const { addExpense } = useExpenses(selectedTrip);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data) => {
    if (!selectedTrip) return;
    setLoading(true);
    try {
      await addExpense(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to add expense:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentTrip = trips.find(t => t.id === selectedTrip);

  return (
    <div className="add-expense-page animate-fade-in">
      <div className="trip-detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      <div className="page-header">
        <h1 className="page-title">Add Expense 💸</h1>
        <p className="page-subtitle">Track your spending in real time</p>
      </div>

      <div className="add-expense-container glass-card">
        {trips.length === 0 ? (
          <div className="empty-state">
            <h3 className="empty-state-title">No trips available</h3>
            <p className="empty-state-text">Create a trip first before adding expenses.</p>
            <button className="btn btn-primary" onClick={() => navigate('/trips')} style={{ marginTop: '1rem' }}>
              Create Trip
            </button>
          </div>
        ) : (
          <>
            {/* Trip Selector */}
            <div className="form-group" style={{ marginBottom: 'var(--space-xl)' }}>
              <label className="form-label" htmlFor="select-trip">Select Trip</label>
              <select
                id="select-trip"
                className="form-select"
                value={selectedTrip}
                onChange={(e) => setSelectedTrip(e.target.value)}
              >
                {trips.map(trip => (
                  <option key={trip.id} value={trip.id}>
                    {trip.destination} — {trip.currency} {trip.budget?.toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>

            {/* Success Message */}
            {success && (
              <div className="expense-success animate-fade-in">
                ✅ Expense added successfully!
              </div>
            )}

            <ExpenseForm 
              onSubmit={handleSubmit} 
              loading={loading} 
              currency={currentTrip?.currency || 'INR'}
            />
          </>
        )}
      </div>
    </div>
  );
}
