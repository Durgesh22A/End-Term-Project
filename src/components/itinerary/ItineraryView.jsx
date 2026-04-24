import { Sun, CloudSun, Moon, MapPin, Clock, Lightbulb, Wallet, Backpack, Bus } from 'lucide-react';
import './ItineraryView.css';

/**
 * Time-of-day configuration for visual styling
 */
const TIME_CONFIG = {
  morning: { 
    icon: Sun, 
    label: 'Morning', 
    colorClass: 'time-morning',
    emoji: '🌅'
  },
  afternoon: { 
    icon: CloudSun, 
    label: 'Afternoon', 
    colorClass: 'time-afternoon',
    emoji: '☀️'
  },
  evening: { 
    icon: Moon, 
    label: 'Evening', 
    colorClass: 'time-evening',
    emoji: '🌙'
  },
};

/**
 * Renders a single time slot (morning/afternoon/evening)
 */
function TimeSlot({ slot, timeKey }) {
  if (!slot) return null;
  const config = TIME_CONFIG[timeKey];
  const Icon = config.icon;
  const photoUrl = slot.photo?.url || slot.photo?.urlSmall;

  return (
    <div className={`itinerary-slot ${config.colorClass} ${photoUrl ? 'has-image' : ''}`}>
      {photoUrl && (
        <div className="slot-image" style={{ backgroundImage: `url(${photoUrl})` }}>
          <div className="slot-image-overlay" />
        </div>
      )}
      <div className="slot-time-badge">
        <Icon size={14} />
        <span>{config.label}</span>
      </div>
      <div className="slot-content">
        <h4 className="slot-activity">{slot.activity}</h4>
        {slot.location && (
          <div className="slot-meta">
            <MapPin size={13} />
            <span>{slot.location}</span>
          </div>
        )}
        <div className="slot-details">
          {slot.duration && (
            <span className="slot-detail">
              <Clock size={12} /> {slot.duration}
            </span>
          )}
          {slot.estimated_cost && (
            <span className="slot-detail">
              <Wallet size={12} /> {slot.estimated_cost}
            </span>
          )}
        </div>
        {slot.tip && (
          <div className="slot-tip">
            <Lightbulb size={12} />
            <span>{slot.tip}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Beautiful day-wise itinerary display component.
 * Shows the AI-generated plan with morning/afternoon/evening cards,
 * budget summary, packing tips, and transport info.
 */
export default function ItineraryView({ itinerary }) {
  if (!itinerary || !itinerary.days || itinerary.days.length === 0) {
    return null;
  }

  const { days, budget_summary, packing_tips, local_transport, generatedAt } = itinerary;

  return (
    <div className="itinerary-view">
      {/* Header */}
      <div className="itinerary-header">
        <div className="itinerary-header-text">
          <h2 className="itinerary-title">✨ Your AI Itinerary</h2>
          <p className="itinerary-subtitle">
            {days.length}-day personalized plan
            {generatedAt && (
              <span className="itinerary-generated">
                 • Generated {new Date(generatedAt).toLocaleDateString('en-IN', { 
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                })}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Day Cards */}
      <div className="itinerary-days stagger-children">
        {days.map((day, idx) => (
          <div 
            key={idx} 
            className="itinerary-day glass-card"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            {/* Day Header */}
            <div className="day-header">
              <div className="day-number-badge">
                <span className="day-number">Day {day.day || idx + 1}</span>
              </div>
              <div className="day-info">
                <h3 className="day-title">{day.title || `Day ${day.day || idx + 1}`}</h3>
                {day.date && (
                  <span className="day-date">
                    {new Date(day.date).toLocaleDateString('en-IN', { 
                      weekday: 'short', month: 'short', day: 'numeric' 
                    })}
                  </span>
                )}
              </div>
            </div>

            {/* Time Slots */}
            <div className="day-slots">
              <TimeSlot slot={day.morning} timeKey="morning" />
              <TimeSlot slot={day.afternoon} timeKey="afternoon" />
              <TimeSlot slot={day.evening} timeKey="evening" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Info Panels */}
      <div className="itinerary-info-grid">
        {/* Budget Summary */}
        {budget_summary && (
          <div className="itinerary-info-card glass-card">
            <div className="info-card-icon-wrap info-budget-icon">
              <Wallet size={20} />
            </div>
            <h3>Budget Summary</h3>
            {budget_summary.estimated_daily_spend && (
              <p className="info-line">
                <strong>Daily:</strong> {budget_summary.estimated_daily_spend}
              </p>
            )}
            {budget_summary.total_estimated && (
              <p className="info-line">
                <strong>Total:</strong> {budget_summary.total_estimated}
              </p>
            )}
            {budget_summary.saving_tips?.length > 0 && (
              <ul className="info-tip-list">
                {budget_summary.saving_tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Packing Tips */}
        {packing_tips?.length > 0 && (
          <div className="itinerary-info-card glass-card">
            <div className="info-card-icon-wrap info-packing-icon">
              <Backpack size={20} />
            </div>
            <h3>Packing Essentials</h3>
            <ul className="packing-list">
              {packing_tips.map((item, i) => (
                <li key={i} className="packing-item">
                  <span className="packing-check">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Transport */}
        {local_transport && (
          <div className="itinerary-info-card glass-card">
            <div className="info-card-icon-wrap info-transport-icon">
              <Bus size={20} />
            </div>
            <h3>Getting Around</h3>
            <p className="info-text">{local_transport}</p>
          </div>
        )}
      </div>
    </div>
  );
}
