import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Compass,
  PlusCircle, 
  LogOut, 
  Plane,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import './Navbar.css';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/trips', icon: Map, label: 'My Trips' },
  { path: '/explore', icon: Compass, label: 'Explore' },
  { path: '/add-expense', icon: PlusCircle, label: 'Add Expense' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button 
        className="mobile-menu-btn" 
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div className="nav-overlay" onClick={closeMobile} />
      )}

      <nav className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Plane size={24} />
          </div>
          <div className="brand-text">
            <h1 className="brand-name">TripLedger</h1>
            <span className="brand-tagline">AI Travel Planner</span>
          </div>
          <button className="mobile-close-btn" onClick={closeMobile}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `nav-item ${isActive ? 'nav-item-active' : ''}`
              }
              onClick={closeMobile}
              end={item.path === '/'}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* User section */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.displayName || 'Traveler'}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="bottom-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `bottom-nav-item ${isActive ? 'bottom-nav-active' : ''}`
            }
            end={item.path === '/'}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </>
  );
}
