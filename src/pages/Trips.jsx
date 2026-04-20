import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import TripCard from '../components/trip/TripCard';
import TripForm from '../components/trip/TripForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { PageLoader } from '../components/common/Loader';
import { getTripStatus } from '../utils/constants';
import './Trips.css';

export default function Trips() {
  const { trips, loading, addTrip } = useTrips();
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleCreateTrip = async (data) => {
    setFormLoading(true);
    try {
      await addTrip(data);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create trip:', error);
    }
    setFormLoading(false);
  };

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.destination?.toLowerCase().includes(searchQuery.toLowerCase());
    const status = getTripStatus(trip.startDate, trip.endDate);
    const matchesFilter = filterStatus === 'all' || status.label.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <PageLoader />;

  return (
    <div className="trips-page animate-fade-in">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title">My Trips 🗺️</h1>
          <p className="page-subtitle">{trips.length} trip{trips.length !== 1 ? 's' : ''} planned</p>
        </div>
        <Button icon={Plus} onClick={() => setShowForm(true)} size="lg">
          New Trip
        </Button>
      </div>

      {/* Filters */}
      {trips.length > 0 && (
        <div className="trips-filters">
          <div className="search-group">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input search-input"
              id="trip-search"
            />
          </div>
          <div className="filter-chips">
            {['all', 'upcoming', 'active', 'completed'].map(status => (
              <button
                key={status}
                className={`filter-chip ${filterStatus === status ? 'filter-chip-active' : ''}`}
                onClick={() => setFilterStatus(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trip Grid */}
      {filteredTrips.length > 0 ? (
        <div className="grid-auto stagger-children">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} totalSpent={0} />
          ))}
        </div>
      ) : trips.length > 0 ? (
        <div className="empty-state">
          <Filter size={48} className="empty-state-icon" />
          <h3 className="empty-state-title">No matching trips</h3>
          <p className="empty-state-text">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="empty-state">
          <div style={{ fontSize: '64px', marginBottom: '1rem' }}>🌍</div>
          <h3 className="empty-state-title">No trips yet</h3>
          <p className="empty-state-text">
            Create your first trip to start planning and budgeting your adventure.
          </p>
          <Button icon={Plus} onClick={() => setShowForm(true)} style={{ marginTop: '1rem' }}>
            Create Trip
          </Button>
        </div>
      )}

      {/* Create Trip Modal */}
      <Modal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        title="Plan a New Trip"
        size="md"
      >
        <TripForm onSubmit={handleCreateTrip} loading={formLoading} />
      </Modal>
    </div>
  );
}
