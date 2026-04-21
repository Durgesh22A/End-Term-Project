import { useState, useMemo } from 'react';
import { POPULAR_DESTINATIONS, CURRENCIES, INTERESTS, PACE_OPTIONS } from '../../utils/constants';
import Button from '../common/Button';
import './TripForm.css';

export default function TripForm({ onSubmit, initialData = null, loading = false }) {
  const [formData, setFormData] = useState({
    tripName: initialData?.tripName || '',
    destination: initialData?.destination || '',
    startDate: initialData?.startDate 
      ? new Date(initialData.startDate).toISOString().split('T')[0] 
      : '',
    endDate: initialData?.endDate 
      ? new Date(initialData.endDate).toISOString().split('T')[0] 
      : '',
    budget: initialData?.budget || '',
    currency: initialData?.currency || 'INR',
    interests: initialData?.interests || [],
    pace: initialData?.pace || 'balanced',
    travelers: initialData?.travelers || 1,
    notes: initialData?.notes || '',
    lat: initialData?.lat || '',
    lon: initialData?.lon || '',
  });
  const [errors, setErrors] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredDestinations = POPULAR_DESTINATIONS.filter(d =>
    d.name.toLowerCase().includes(formData.destination.toLowerCase()) &&
    formData.destination.length > 0
  );

  // Auto-compute duration from dates
  const duration = useMemo(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return diff > 0 ? diff : 0;
    }
    return 0;
  }, [formData.startDate, formData.endDate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.tripName.trim()) newErrors.tripName = 'Trip name is required';
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required';
    if (!formData.startDate) newErrors.startDate = 'Required';
    if (!formData.endDate) newErrors.endDate = 'Required';
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start';
    }
    if (!formData.budget || Number(formData.budget) <= 0) newErrors.budget = 'Enter a valid budget';
    if (!formData.travelers || Number(formData.travelers) < 1) newErrors.travelers = 'At least 1 traveler';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...formData,
      budget: Number(formData.budget),
      travelers: Number(formData.travelers),
      duration,
      lat: Number(formData.lat) || null,
      lon: Number(formData.lon) || null,
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const toggleInterest = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(i => i !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const selectDestination = (dest) => {
    setFormData(prev => ({
      ...prev,
      destination: dest.name,
      lat: dest.lat,
      lon: dest.lon,
    }));
    setShowSuggestions(false);
  };

  return (
    <form className="trip-form" onSubmit={handleSubmit}>
      {/* Trip Name */}
      <div className="form-group">
        <label className="form-label" htmlFor="trip-name">Trip Name *</label>
        <input
          id="trip-name"
          type="text"
          className={`form-input ${errors.tripName ? 'error' : ''}`}
          placeholder="e.g., Bali Summer Trip"
          value={formData.tripName}
          onChange={(e) => handleChange('tripName', e.target.value)}
        />
        {errors.tripName && <span className="form-error">{errors.tripName}</span>}
      </div>

      {/* Destination */}
      <div className="form-group destination-group">
        <label className="form-label" htmlFor="trip-dest">Destination *</label>
        <input
          id="trip-dest"
          type="text"
          className={`form-input ${errors.destination ? 'error' : ''}`}
          placeholder="Where are you going?"
          value={formData.destination}
          onChange={(e) => {
            handleChange('destination', e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          autoComplete="off"
        />
        {errors.destination && <span className="form-error">{errors.destination}</span>}
        
        {showSuggestions && filteredDestinations.length > 0 && (
          <div className="destination-suggestions">
            {filteredDestinations.map((dest) => (
              <button
                key={dest.name}
                type="button"
                className="destination-suggestion"
                onClick={() => selectDestination(dest)}
              >
                <span className="dest-name">{dest.name}</span>
                <span className="dest-country">{dest.country}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="trip-start">Start Date *</label>
          <input
            id="trip-start"
            type="date"
            className={`form-input ${errors.startDate ? 'error' : ''}`}
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
          {errors.startDate && <span className="form-error">{errors.startDate}</span>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="trip-end">End Date *</label>
          <input
            id="trip-end"
            type="date"
            className={`form-input ${errors.endDate ? 'error' : ''}`}
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
          {errors.endDate && <span className="form-error">{errors.endDate}</span>}
        </div>
      </div>

      {/* Duration display */}
      {duration > 0 && (
        <div className="trip-duration-display animate-fade-in">
          <span className="duration-badge">📅 {duration} {duration === 1 ? 'day' : 'days'} trip</span>
        </div>
      )}

      {/* Budget, Currency & Travelers */}
      <div className="form-row form-row-3">
        <div className="form-group">
          <label className="form-label" htmlFor="trip-budget">Budget *</label>
          <input
            id="trip-budget"
            type="number"
            className={`form-input ${errors.budget ? 'error' : ''}`}
            placeholder="50000"
            value={formData.budget}
            onChange={(e) => handleChange('budget', e.target.value)}
            min="0"
          />
          {errors.budget && <span className="form-error">{errors.budget}</span>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="trip-currency">Currency</label>
          <select
            id="trip-currency"
            className="form-select"
            value={formData.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="trip-travelers">Travelers *</label>
          <input
            id="trip-travelers"
            type="number"
            className={`form-input ${errors.travelers ? 'error' : ''}`}
            value={formData.travelers}
            onChange={(e) => handleChange('travelers', e.target.value)}
            min="1"
            max="50"
          />
          {errors.travelers && <span className="form-error">{errors.travelers}</span>}
        </div>
      </div>

      {/* Interests */}
      <div className="form-group">
        <label className="form-label">Interests</label>
        <div className="interest-chips">
          {INTERESTS.map((interest) => (
            <button
              key={interest.id}
              type="button"
              className={`interest-chip ${formData.interests.includes(interest.id) ? 'interest-chip-active' : ''}`}
              onClick={() => toggleInterest(interest.id)}
            >
              <span className="interest-emoji">{interest.emoji}</span>
              <span>{interest.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pace */}
      <div className="form-group">
        <label className="form-label">Trip Pace</label>
        <div className="pace-options">
          {PACE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`pace-option ${formData.pace === option.id ? 'pace-option-active' : ''}`}
              onClick={() => handleChange('pace', option.id)}
            >
              <span className="pace-emoji">{option.emoji}</span>
              <span className="pace-label">{option.label}</span>
              <span className="pace-desc">{option.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="form-group">
        <label className="form-label" htmlFor="trip-notes">Notes</label>
        <textarea
          id="trip-notes"
          className="form-input form-textarea"
          placeholder="Any special requirements, preferences, or things to remember..."
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
        />
      </div>

      <Button type="submit" loading={loading} fullWidth size="lg">
        {initialData ? 'Update Trip' : 'Create Trip'}
      </Button>
    </form>
  );
}
