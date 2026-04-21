import { useMemo } from 'react';
import { Map, Wallet, Sparkles, CalendarClock } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/dashboard/StatCard';
import BudgetBar from '../components/dashboard/BudgetBar';
import TripCard from '../components/trip/TripCard';
import { PageLoader } from '../components/common/Loader';
import { getCurrencySymbol } from '../utils/formatCurrency';
import { getTripStatus } from '../utils/constants';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { trips, loading } = useTrips();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const activeTrip = useMemo(() => {
    return trips.find(t => getTripStatus(t.startDate, t.endDate).label === 'Active') || trips[0] || null;
  }, [trips]);

  const stats = useMemo(() => {
    const totalTrips = trips.length;
    const upcomingCount = trips.filter(t => getTripStatus(t.startDate, t.endDate).label === 'Upcoming').length;
    const totalBudget = trips.reduce((sum, t) => sum + (t.budget || 0), 0);
    const itinerariesGenerated = trips.filter(t => t.itinerary?.days?.length > 0).length;
    return { totalTrips, upcomingCount, totalBudget, itinerariesGenerated };
  }, [trips]);

  if (loading) return <PageLoader />;

  const displayName = user?.displayName?.split(' ')[0] || 'Traveler';

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{greeting}, {displayName} ✈️</h1>
        <p className="page-subtitle">Here's your travel planning overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid-4 stagger-children dashboard-stats">
        <StatCard
          icon={Map}
          label="Total Trips"
          value={stats.totalTrips}
          subtext={stats.totalTrips > 0 ? `${stats.totalTrips} planned` : 'None yet'}
          variant="default"
        />
        <StatCard
          icon={Wallet}
          label="Total Budget"
          value={`₹${stats.totalBudget.toLocaleString('en-IN')}`}
          subtext="Across all trips"
          variant="indigo"
        />
        <StatCard
          icon={Sparkles}
          label="AI Itineraries"
          value={stats.itinerariesGenerated}
          subtext={stats.itinerariesGenerated > 0 ? 'Generated' : 'Generate one!'}
          variant="success"
        />
        <StatCard
          icon={CalendarClock}
          label="Upcoming"
          value={stats.upcomingCount}
          subtext="Trips planned"
          variant="warning"
        />
      </div>

      {/* Main Content */}
      {trips.length === 0 ? (
        <div className="dashboard-empty glass-card animate-fade-in-up">
          <div className="dashboard-empty-icon">✈️</div>
          <h2>Start Your Journey</h2>
          <p>Plan your first trip and let AI create a personalized itinerary for your adventure.</p>
          <a href="/trips" className="btn btn-primary btn-lg" style={{ marginTop: '1rem' }}>
            Create Your First Trip
          </a>
        </div>
      ) : (
        <div className="dashboard-grid">
          <div className="dashboard-section">
            <h2 className="section-title">Recent Trips</h2>
            <div className="dashboard-trips stagger-children">
              {trips.slice(0, 3).map((trip) => (
                <TripCard key={trip.id} trip={trip} totalSpent={0} />
              ))}
            </div>
          </div>

          <div className="dashboard-section">
            <h2 className="section-title">Budget Overview</h2>
            {activeTrip ? (
              <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                <h3 style={{ marginBottom: 'var(--space-md)', fontSize: 'var(--font-size-lg)' }}>
                  {activeTrip.tripName || activeTrip.destination}
                </h3>
                <BudgetBar
                  spent={0}
                  budget={activeTrip.budget || 0}
                  currency={getCurrencySymbol(activeTrip.currency)}
                />
              </div>
            ) : (
              <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                  No active trip budget to display
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
