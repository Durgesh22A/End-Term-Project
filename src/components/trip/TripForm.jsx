import { useState } from 'react';
import { POPULAR_DESTINATIONS, CURRENCIES } from '../../utils/constants';
import Button from '../common/Button';
import './TripForm.css';

export default function TripForm({ onSubmit, initialData = null, loading = false }) {
  const [formData, setFormData] = useState({
    destination: initialData?.destination || '',
    startDate: initialData?.startDate 
      ? new Date(initialData.startDate).toISOString().split('T')[0] 
      : '',
    endDate: initialData?.endDate 
      ? new Date(initialData.endDate).toISOString().split('T')[0] 
      : '',
    budget: initialData?.budget || '',
    currency: initialData?.currency || 'INR',
    lat: initialData?.lat || '',
    lon: initialData?.lon || '',
  });
  const [errors, setErrors] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredDestinations = POPULAR_DESTINATIONS.filter(d =>
    d.name.toLowerCase().includes(formData.destination.toLowerCase()) &&
    formData.destination.length > 0
  );

  const validate = () => {
    const newErrors = {};
    if (!formData.destination.trim()) newErrors.destination = 'Required';
    if (!formData.startDate) newErrors.startDate = 'Required';
    if (!formData.endDate) newErrors.endDate = 'Required';
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start';
    }
    if (!formData.budget || Number(formData.budget) <= 0) newErrors.budget = 'Enter a valid budget';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...formData,
      budget: Number(formData.budget),
      lat: Number(formData.lat) || null,
      lon: Number(formData.lon) || null,
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
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
      {/* Destination */}
      <div className="form-group destination-group">
        <label className="form-label" htmlFor="trip-dest">Destination</label>
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
          <label className="form-label" htmlFor="trip-start">Start Date</label>
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
          <label className="form-label" htmlFor="trip-end">End Date</label>
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

      {/* Budget & Currency */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="trip-budget">Budget</label>
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
                {c.symbol} {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button type="submit" loading={loading} fullWidth size="lg">
        {initialData ? 'Update Trip' : 'Create Trip'}
      </Button>
    </form>
  );
}
