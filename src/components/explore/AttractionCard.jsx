import { Clock, Ticket } from 'lucide-react';

/**
 * Glassmorphism card for a tourist attraction with image, description,
 * visit duration, and entry fee.
 */
export default function AttractionCard({ attraction, index = 0 }) {
  const { name, description, visit_time, entry_fee, image, photo } = attraction;

  // Determine image source: fallback data uses `image`, AI data uses `photo`
  const imgUrl = photo?.url || photo?.urlSmall || image;
  const imgGradient = photo?.gradient;

  const imageStyle = imgUrl
    ? { backgroundImage: `url(${imgUrl})` }
    : { background: imgGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };

  return (
    <div
      className="attraction-card glass-card"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="attraction-card-image" style={imageStyle}>
        <div className="attraction-card-image-overlay" />
        {entry_fee && (
          <span className="attraction-fee-badge">
            <Ticket size={12} />
            {entry_fee}
          </span>
        )}
      </div>
      <div className="attraction-card-body">
        <h3 className="attraction-card-name">{name}</h3>
        <p className="attraction-card-desc">{description}</p>
        {visit_time && (
          <div className="attraction-card-meta">
            <Clock size={14} />
            <span>{visit_time}</span>
          </div>
        )}
      </div>
    </div>
  );
}
