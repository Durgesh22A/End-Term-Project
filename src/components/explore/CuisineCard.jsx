/**
 * Compact card for local cuisine / food recommendations.
 */
export default function CuisineCard({ item, index = 0 }) {
  const { name, description, price_range, image, photo } = item;

  const imgUrl = photo?.url || photo?.urlSmall || image;
  const imgGradient = photo?.gradient;

  const imageStyle = imgUrl
    ? { backgroundImage: `url(${imgUrl})` }
    : { background: imgGradient || 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' };

  return (
    <div
      className="cuisine-card glass-card"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="cuisine-card-image" style={imageStyle} />
      <div className="cuisine-card-body">
        <h4 className="cuisine-card-name">{name}</h4>
        <p className="cuisine-card-desc">{description}</p>
        {price_range && (
          <span className="cuisine-card-price">{price_range}</span>
        )}
      </div>
    </div>
  );
}
