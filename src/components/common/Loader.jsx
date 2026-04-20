import './Loader.css';

export default function Loader({ size = 'md', text = '' }) {
  return (
    <div className={`loader-container loader-${size}`}>
      <div className="loader-spinner">
        <div className="loader-ring" />
        <div className="loader-ring" />
        <div className="loader-ring" />
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="page-loader">
      <div className="loader-spinner">
        <div className="loader-ring" />
        <div className="loader-ring" />
        <div className="loader-ring" />
      </div>
      <p className="loader-text">Loading...</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line skeleton-wide" />
      <div className="skeleton-line skeleton-medium" />
      <div className="skeleton-line skeleton-narrow" />
    </div>
  );
}
