/**
 * Full-width hero banner for a destination with an image and overlay text.
 */
export default function DestinationHero({ name, country, tagline, imageUrl, gradient }) {
  const bgStyle = imageUrl
    ? { backgroundImage: `url(${imageUrl})` }
    : { background: gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };

  return (
    <div className="destination-hero" style={bgStyle}>
      <div className="destination-hero-overlay">
        <div className="destination-hero-content animate-fade-in-up">
          <span className="destination-hero-badge">
            ✨ AI Curated Guide
          </span>
          <h1 className="destination-hero-name">{name}</h1>
          {country && (
            <p className="destination-hero-country">{country}</p>
          )}
          {tagline && (
            <p className="destination-hero-tagline">{tagline}</p>
          )}
        </div>
      </div>
    </div>
  );
}
