import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Calendar, Wallet, Trash2, Edit3, 
  PlusCircle, ArrowLeftRight, Cloud
} from 'lucide-react';
import { useTrip } from '../hooks/useTrip';
import { useExpenses } from '../hooks/useExpenses';
import { useWeather } from '../hooks/useWeather';
import { useCurrency } from '../hooks/useCurrency';
import { useTrips } from '../context/TripContext';
import BudgetBar from '../components/dashboard/BudgetBar';
import ExpensePieChart from '../components/dashboard/ExpensePieChart';
import ExpenseList from '../components/expense/ExpenseList';
import ExpenseForm from '../components/expense/ExpenseForm';
import TripForm from '../components/trip/TripForm';
import WeatherWidget from '../components/weather/WeatherWidget';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Button from '../components/common/Button';
import { PageLoader } from '../components/common/Loader';
import { getCurrencySymbol } from '../utils/formatCurrency';
import { formatDateRange, getDaysInfo, CURRENCIES } from '../utils/constants';
import './TripDetail.css';

export default function TripDetail() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trip, loading: tripLoading } = useTrip(tripId);
  const { expenses, total, byCategory, addExpense, updateExpense, deleteExpense } = useExpenses(tripId);
  const { updateTrip, deleteTrip } = useTrips();
  
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showEditTrip, setShowEditTrip] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Confirm dialogs
  const [showDeleteTrip, setShowDeleteTrip] = useState(false);
  const [deletingExpenseId, setDeletingExpenseId] = useState(null);
  
  // Currency converter state
  const [convertAmount, setConvertAmount] = useState(1000);
  const [convertFrom, setConvertFrom] = useState('INR');
  const [convertTo, setConvertTo] = useState('USD');
  
  // Weather & Currency hooks
  const { forecast, loading: weatherLoading, error: weatherError } = useWeather(trip?.lat, trip?.lon);
  const { convertedAmount, rate, loading: currencyLoading, error: currencyError } = useCurrency(convertAmount, convertFrom, convertTo);

  const symbol = getCurrencySymbol(trip?.currency);

  const handleAddExpense = async (data) => {
    setFormLoading(true);
    try {
      await addExpense(data);
      setShowExpenseForm(false);
    } catch (err) {
      console.error('Failed to add expense:', err);
    }
    setFormLoading(false);
  };

  const handleEditExpense = async (data) => {
    setFormLoading(true);
    try {
      await updateExpense(editingExpense.id, data);
      setEditingExpense(null);
    } catch (err) {
      console.error('Failed to update expense:', err);
    }
    setFormLoading(false);
  };

  const handleDeleteExpense = async () => {
    if (!deletingExpenseId) return;
    await deleteExpense(deletingExpenseId);
    setDeletingExpenseId(null);
  };

  const handleEditTrip = async (data) => {
    setFormLoading(true);
    try {
      await updateTrip(tripId, data);
      setShowEditTrip(false);
    } catch (err) {
      console.error('Failed to update trip:', err);
    }
    setFormLoading(false);
  };

  const handleDeleteTrip = async () => {
    await deleteTrip(tripId);
    navigate('/trips');
  };

  if (tripLoading) return <PageLoader />;

  if (!trip) {
    return (
      <div className="empty-state" style={{ minHeight: '60vh' }}>
        <h3 className="empty-state-title">Trip not found</h3>
        <Button onClick={() => navigate('/trips')} icon={ArrowLeft}>Back to trips</Button>
      </div>
    );
  }

  const daysInfo = getDaysInfo(trip.startDate, trip.endDate);

  return (
    <div className="trip-detail-page animate-fade-in">
      {/* Header */}
      <div className="trip-detail-header">
        <button className="back-btn" onClick={() => navigate('/trips')}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <div className="trip-detail-actions">
          <Button variant="secondary" icon={Edit3} size="sm" onClick={() => setShowEditTrip(true)}>
            Edit
          </Button>
          <Button variant="danger" icon={Trash2} size="sm" onClick={() => setShowDeleteTrip(true)}>
            Delete
          </Button>
        </div>
      </div>

      {/* Trip Info */}
      <div className="trip-detail-info">
        <h1 className="page-title">
          <MapPin size={28} style={{ display: 'inline', verticalAlign: 'middle' }} />
          {' '}{trip.destination}
        </h1>
        <div className="trip-detail-meta">
          <span><Calendar size={14} /> {formatDateRange(trip.startDate, trip.endDate)}</span>
          <span><Wallet size={14} /> {symbol}{trip.budget?.toLocaleString('en-IN')}</span>
          <span>{daysInfo.label}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="trip-detail-grid">
        {/* Left Column — Expenses */}
        <div className="trip-detail-left">
          {/* Budget Bar */}
          <div className="glass-card detail-card">
            <h2 className="detail-card-title">Budget Tracker</h2>
            <BudgetBar spent={total} budget={trip.budget || 0} currency={symbol} />
          </div>

          {/* Expense Breakdown */}
          {Object.keys(byCategory).length > 0 && (
            <div className="glass-card detail-card">
              <h2 className="detail-card-title">Spending Breakdown</h2>
              <ExpensePieChart byCategory={byCategory} total={total} />
            </div>
          )}

          {/* Expense List */}
          <div className="glass-card detail-card">
            <div className="detail-card-header">
              <h2 className="detail-card-title">Expenses ({expenses.length})</h2>
              <Button icon={PlusCircle} size="sm" onClick={() => setShowExpenseForm(true)}>
                Add
              </Button>
            </div>
            <ExpenseList
              expenses={expenses}
              currency={symbol}
              onEdit={(exp) => setEditingExpense(exp)}
              onDelete={(expId) => setDeletingExpenseId(expId)}
            />
          </div>
        </div>

        {/* Right Column — Weather & Currency */}
        <div className="trip-detail-right">
          {/* Weather */}
          {(trip.lat && trip.lon) && (
            <div className="glass-card detail-card">
              <h2 className="detail-card-title">
                <Cloud size={18} /> 7-Day Forecast
              </h2>
              <WeatherWidget forecast={forecast} loading={weatherLoading} error={weatherError} />
            </div>
          )}

          {/* Currency Converter */}
          <div className="glass-card detail-card">
            <h2 className="detail-card-title">
              <ArrowLeftRight size={18} /> Currency Converter
            </h2>
            <div className="converter-form">
              <div className="form-group">
                <input
                  type="number"
                  className="form-input"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(Number(e.target.value) || 0)}
                  min="0"
                  id="convert-amount"
                  placeholder="Enter amount"
                />
              </div>
              <div className="converter-row">
                <select
                  className="form-select"
                  value={convertFrom}
                  onChange={(e) => setConvertFrom(e.target.value)}
                  id="convert-from"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
                  ))}
                </select>
                <button 
                  className="swap-btn"
                  onClick={() => { setConvertFrom(convertTo); setConvertTo(convertFrom); }}
                  type="button"
                  aria-label="Swap currencies"
                >
                  <ArrowLeftRight size={16} />
                </button>
                <select
                  className="form-select"
                  value={convertTo}
                  onChange={(e) => setConvertTo(e.target.value)}
                  id="convert-to"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
                  ))}
                </select>
              </div>
              <div className="converter-result">
                {currencyLoading ? (
                  <span className="converter-loading">Converting...</span>
                ) : currencyError ? (
                  <span className="converter-loading">Conversion unavailable</span>
                ) : convertedAmount !== null ? (
                  <>
                    <span className="converter-value">
                      {convertedAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })} {convertTo}
                    </span>
                    {rate && (
                      <span className="converter-rate">
                        1 {convertFrom} = {rate.toFixed(4)} {convertTo}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="converter-loading">Enter an amount to convert</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      <Modal isOpen={showExpenseForm} onClose={() => setShowExpenseForm(false)} title="Add Expense">
        <ExpenseForm onSubmit={handleAddExpense} loading={formLoading} currency={trip.currency} />
      </Modal>

      {/* Edit Expense Modal */}
      <Modal isOpen={!!editingExpense} onClose={() => setEditingExpense(null)} title="Edit Expense">
        <ExpenseForm 
          onSubmit={handleEditExpense} 
          initialData={editingExpense} 
          loading={formLoading}
          currency={trip.currency}
        />
      </Modal>

      {/* Edit Trip Modal */}
      <Modal isOpen={showEditTrip} onClose={() => setShowEditTrip(false)} title="Edit Trip" size="md">
        <TripForm onSubmit={handleEditTrip} initialData={trip} loading={formLoading} />
      </Modal>

      {/* Delete Trip Confirm */}
      <ConfirmDialog
        isOpen={showDeleteTrip}
        onClose={() => setShowDeleteTrip(false)}
        onConfirm={handleDeleteTrip}
        title="Delete Trip?"
        message={`This will permanently delete "${trip.destination}" and all its expenses. This action cannot be undone.`}
        confirmText="Delete Trip"
        variant="danger"
      />

      {/* Delete Expense Confirm */}
      <ConfirmDialog
        isOpen={!!deletingExpenseId}
        onClose={() => setDeletingExpenseId(null)}
        onConfirm={handleDeleteExpense}
        title="Delete Expense?"
        message="This expense will be permanently removed from this trip."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
