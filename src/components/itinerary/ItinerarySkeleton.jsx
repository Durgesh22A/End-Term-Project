/**
 * Shimmer loading skeleton for the itinerary generation process.
 * Mimics the day-wise layout for a smooth transition.
 */
export default function ItinerarySkeleton() {
  return (
    <div className="itinerary-skeleton animate-fade-in">
      {/* AI Generating Indicator */}
      <div className="skeleton-ai-indicator">
        <div className="ai-pulse-ring" />
        <span>AI is crafting your personalized itinerary...</span>
      </div>

      {/* Skeleton Day Cards */}
      {[1, 2, 3].map(i => (
        <div 
          key={i} 
          className="itinerary-day glass-card" 
          style={{ 
            animationDelay: `${i * 120}ms`,
            animation: 'fadeInUp var(--transition-slow) ease-out both',
          }}
        >
          {/* Day Header Skeleton */}
          <div className="day-header">
            <div 
              className="day-number-badge" 
              style={{ opacity: 0.3, background: 'var(--bg-input)' }}
            >
              <span className="day-number" style={{ color: 'var(--text-muted)' }}>
                Day {i}
              </span>
            </div>
            <div className="day-info">
              <div 
                className="skeleton-line" 
                style={{ width: '180px', height: '18px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)' }} 
              />
              <div 
                className="skeleton-line" 
                style={{ width: '100px', height: '12px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', marginTop: '6px' }} 
              />
            </div>
          </div>

          {/* Slot skeletons */}
          <div className="day-slots">
            {['morning', 'afternoon', 'evening'].map(time => (
              <div 
                key={time} 
                className={`itinerary-slot time-${time}`} 
                style={{ opacity: 0.5 }}
              >
                <div className="slot-time-badge" style={{ opacity: 0.6 }}>
                  <span>{time.charAt(0).toUpperCase() + time.slice(1)}</span>
                </div>
                <div className="slot-content">
                  <div 
                    style={{ width: '70%', height: '14px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)' }} 
                  />
                  <div 
                    style={{ width: '50%', height: '12px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', marginTop: '4px' }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
