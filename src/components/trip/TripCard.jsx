import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Wallet } from 'lucide-react';
import { getTripStatus, formatDateRange, getDaysInfo } from '../../utils/constants';
import { getCurrencySymbol } from '../../utils/formatCurrency';
import BudgetBar from '../dashboard/BudgetBar';
import './TripCard.css';

export default function TripCard({ trip, totalSpent = 0 }) {
  const navigate = useNavigate();
  const status = getTripStatus(trip.startDate, trip.endDate);
  const daysInfo = getDaysInfo(trip.startDate, trip.endDate);
  const symbol = getCurrencySymbol(trip.currency);

  const handleClick = () => {
    navigate(`/trips/${trip.id}`);
  };

  return (
    <div className="trip-card glass-card" onClick={handleClick} role="button" tabIndex={0}>
      <div className="trip-card-header">
        <div className="trip-destination">
          <MapPin size={16} />
          <h3>{trip.destination}</h3>
        </div>
        <span className={`badge badge-${status.variant}`}>
          {status.label}
        </span>
      </div>

      <div className="trip-card-meta">
        <div className="trip-meta-item">
          <Calendar size={14} />
          <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
        </div>
        <div className="trip-meta-item">
          <Wallet size={14} />
          <span>{symbol}{trip.budget?.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <BudgetBar 
        spent={totalSpent} 
        budget={trip.budget || 0} 
        currency={symbol}
        size="sm"
        showLabels={false}
      />

      <div className="trip-card-footer">
        <span className="trip-days">{daysInfo.label}</span>
        <span className="trip-spent">
          {symbol}{totalSpent.toLocaleString('en-IN')} spent
        </span>
      </div>
    </div>
  );
}
