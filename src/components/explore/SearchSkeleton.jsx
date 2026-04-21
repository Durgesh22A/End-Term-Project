import './SearchSkeleton.css';

/**
 * Beautiful shimmer loading skeleton shown while AI generates content.
 * Mimics the final layout structure for a smooth transition.
 */
export default function SearchSkeleton() {
  return (
    <div className="search-skeleton animate-fade-in">
      {/* Hero skeleton */}
      <div className="skeleton-hero shimmer-bg">
        <div className="skeleton-hero-overlay">
          <div className="skeleton-line skeleton-line-lg" />
          <div className="skeleton-line skeleton-line-md" />
        </div>
      </div>

      {/* AI generating indicator */}
      <div className="skeleton-ai-indicator">
        <div className="ai-pulse-ring" />
        <span>AI is exploring this destination...</span>
      </div>

      {/* Attractions skeleton */}
      <div className="skeleton-section">
        <div className="skeleton-line skeleton-section-title" />
        <div className="skeleton-cards-grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton-card glass-card" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="skeleton-card-image shimmer-bg" />
              <div className="skeleton-card-body">
                <div className="skeleton-line skeleton-line-md" />
                <div className="skeleton-line skeleton-line-full" />
                <div className="skeleton-line skeleton-line-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cuisine skeleton */}
      <div className="skeleton-section">
        <div className="skeleton-line skeleton-section-title" />
        <div className="skeleton-cuisine-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton-cuisine glass-card" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="skeleton-cuisine-image shimmer-bg" />
              <div className="skeleton-line skeleton-line-md" />
              <div className="skeleton-line skeleton-line-sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Info panel skeleton */}
      <div className="skeleton-section">
        <div className="skeleton-info-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton-info-card glass-card">
              <div className="skeleton-circle" />
              <div className="skeleton-line skeleton-line-md" />
              <div className="skeleton-line skeleton-line-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
