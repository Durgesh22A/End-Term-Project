import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import './NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-content animate-scale-in">
        <div className="not-found-icon">🧭</div>
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Lost in transit</h2>
        <p className="not-found-text">
          Looks like this page doesn't exist. Let's get you back on track.
        </p>
        <div className="not-found-actions">
          <Button icon={ArrowLeft} variant="secondary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button icon={Home} onClick={() => navigate('/')}>
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
