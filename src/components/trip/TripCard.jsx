import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Wallet, Users, Sparkles } from 'lucide-react';
import { getTripStatus, formatDateRange, getDaysInfo, PACE_OPTIONS } from '../../utils/constants';
import { getCurrencySymbol } from '../../utils/formatCurrency';
import BudgetBar from '../dashboard/BudgetBar';
import './TripCard.css';

export default function TripCard({ trip, totalSpent = 0 }) {
  const navigate = useNavigate();
  const status = getTripStatus(trip.startDate, trip.endDate);
  const daysInfo = getDaysInfo(trip.startDate, trip.endDate);
  const symbol = getCurrencySymbol(trip.currency);
  const paceLabel = PACE_OPTIONS.find(p => p.id === trip.pace)?.label;
  const hasItinerary = !!trip.itinerary?.days?.length;

  const handleClick = () => {
    navigate(`/trips/${trip.id}`);
  };

  return (
    <div className="trip-card glass-card" onClick={handleClick} role="button" tabIndex={0}>
      <div className="trip-card-header">
        <div className="trip-card-title-group">
          <h3 className="trip-card-name">{trip.tripName || trip.destination}</h3>
          {trip.tripName && (
            <div className="trip-destination-line">
              <MapPin size={13} />
              <span>{trip.destination}</span>
            </div>
          )}
        </div>
        <div className="trip-card-badges">
          {hasItinerary && (
            <span className="badge badge-indigo trip-itinerary-badge">
              <Sparkles size={10} /> Itinerary
            </span>
          )}
          <span className={`badge badge-${status.variant}`}>
            {status.label}
          </span>
        </div>
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
        {trip.travelers > 0 && (
          <div className="trip-meta-item">
            <Users size={14} />
            <span>{trip.travelers}</span>
          </div>
        )}
      </div>

      {/* Interest chips (show first 3) */}
      {trip.interests?.length > 0 && (
        <div className="trip-card-interests">
          {trip.interests.slice(0, 3).map(i => (
            <span key={i} className="trip-interest-pill">{i}</span>
          ))}
          {trip.interests.length > 3 && (
            <span className="trip-interest-pill trip-interest-more">
              +{trip.interests.length - 3}
            </span>
          )}
        </div>
      )}

      <BudgetBar 
        spent={totalSpent} 
        budget={trip.budget || 0} 
        currency={symbol}
        size="sm"
        showLabels={false}
      />

      <div className="trip-card-footer">
        <span className="trip-days">{daysInfo.label}</span>
        {paceLabel && <span className="trip-pace-label">{paceLabel}</span>}
      </div>
    </div>
  );
}
