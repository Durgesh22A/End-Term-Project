import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, Sparkles, MapPin, ArrowLeft, AlertTriangle } from 'lucide-react';
import DestinationHero from '../components/explore/DestinationHero';
import AttractionCard from '../components/explore/AttractionCard';
import CuisineCard from '../components/explore/CuisineCard';
import TravelInfoPanel from '../components/explore/TravelInfoPanel';
import SearchSkeleton from '../components/explore/SearchSkeleton';
import { generateTravelSuggestions } from '../services/geminiApi';
import { fetchPlacePhoto, fetchPhotosForItems } from '../services/unsplashApi';
import { popularDestinations } from '../utils/fallbackDestinations';
import './Explore.css';

// Animated placeholder texts
const PLACEHOLDER_TEXTS = [
  'Try "Paris, France"...',
  'Try "Tokyo, Japan"...',
  'Try "Bali, Indonesia"...',
  'Try "New York City"...',
  'Try "Dubai"...',
  'Try "Rome, Italy"...',
  'Try "London, UK"...',
  'Try "Mumbai, India"...',
];

export default function Explore() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [heroPhoto, setHeroPhoto] = useState(null);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx(prev => (prev + 1) % PLACEHOLDER_TEXTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Search handler — Gemini AI only
  const handleSearch = useCallback(async (searchQuery) => {
    const q = (searchQuery || query).trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setHeroPhoto(null);

    try {
      // Generate content via Gemini AI
      const data = await generateTravelSuggestions(q);

      // Fetch hero image
      const heroPromise = fetchPlacePhoto(
        `${data.destination_name || q} landmark landscape`
      );

      // Fetch attraction & cuisine images from Unsplash
      const [attractionsWithPhotos, cuisineWithPhotos] = await Promise.all([
        fetchPhotosForItems(data.top_attractions || []),
        fetchPhotosForItems(data.local_cuisine || []),
      ]);

      const hero = await heroPromise;
      setHeroPhoto(hero);

      setResult({
        ...data,
        top_attractions: attractionsWithPhotos,
        local_cuisine: cuisineWithPhotos,
      });

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (err) {
      console.error('Explore search error:', err);

      if (err.message === 'GEMINI_API_KEY_MISSING') {
        setError('Gemini API key is not configured. Add VITE_GEMINI_API_KEY to your .env file.');
      } else if (err.message === 'GEMINI_RATE_LIMITED') {
        setError('API rate limit reached. Please wait a minute and try again.');
      } else if (err.message?.includes('403')) {
        setError('API key is invalid or restricted. Check your Gemini API key.');
      } else {
        setError('Failed to generate travel guide. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePopularClick = (dest) => {
    setQuery(dest.name);
    handleSearch(dest.name);
  };

  const handleBackToSearch = () => {
    setResult(null);
    setHeroPhoto(null);
    setError(null);
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="explore-page">
      {/* Search Section */}
      <div className={`explore-search-section ${result ? 'explore-search-compact' : ''}`}>
        {!result && (
          <div className="explore-intro animate-fade-in-up">
            <div className="explore-intro-icon">
              <Sparkles size={32} />
            </div>
            <h1 className="explore-title">Explore Destinations</h1>
            <p className="explore-subtitle">
              AI-powered travel guides for any place on Earth
            </p>
          </div>
        )}

        <div className={`explore-search-bar ${result ? 'explore-search-bar-compact' : ''}`}>
          {result && (
            <button
              className="explore-back-btn"
              onClick={handleBackToSearch}
              title="Back to search"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="explore-input-wrapper">
            <Search size={20} className="explore-search-icon" />
            <input
              ref={inputRef}
              type="text"
              className="explore-input"
              placeholder={PLACEHOLDER_TEXTS[placeholderIdx]}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              id="explore-search-input"
              autoComplete="off"
            />
          </div>
          <button
            className="explore-search-btn"
            onClick={() => handleSearch()}
            disabled={!query.trim() || loading}
          >
            {loading ? (
              <span className="btn-spinner" />
            ) : (
              <>
                <Sparkles size={16} />
                <span>Explore</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="explore-error glass-card animate-fade-in">
          <AlertTriangle size={24} />
          <p>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && <SearchSkeleton />}

      {/* Results */}
      {result && !loading && (
        <div className="explore-results animate-fade-in" ref={resultsRef}>
          {/* Hero */}
          <DestinationHero
            name={result.destination_name}
            country={result.country}
            tagline={result.tagline}
            imageUrl={heroPhoto?.url}
            gradient={heroPhoto?.gradient}
          />

          {/* Overview */}
          {result.overview && (
            <div className="explore-overview glass-card animate-fade-in-up">
              <p>{result.overview}</p>
              <span className="explore-ai-badge">
                <Sparkles size={12} /> Generated by AI
              </span>
            </div>
          )}

          {/* Top Attractions */}
          {result.top_attractions?.length > 0 && (
            <div className="explore-section">
              <h2 className="explore-section-title">
                <span className="explore-section-icon">🏛️</span>
                Top Attractions
              </h2>
              <div className="explore-attractions-grid stagger-children">
                {result.top_attractions.map((attr, i) => (
                  <AttractionCard key={i} attraction={attr} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Local Cuisine */}
          {result.local_cuisine?.length > 0 && (
            <div className="explore-section">
              <h2 className="explore-section-title">
                <span className="explore-section-icon">🍜</span>
                Local Cuisine
              </h2>
              <div className="explore-cuisine-grid stagger-children">
                {result.local_cuisine.map((item, i) => (
                  <CuisineCard key={i} item={item} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Travel Info Panel */}
          <TravelInfoPanel data={result} />
        </div>
      )}

      {/* Popular Destinations (shown when no result) */}
      {!result && !loading && (
        <div className="explore-popular animate-fade-in-up">
          <h2 className="explore-popular-title">
            <MapPin size={20} />
            Popular Destinations
          </h2>
          <div className="explore-popular-grid stagger-children">
            {popularDestinations.map((dest) => (
              <button
                key={dest.id}
                className="explore-popular-card"
                onClick={() => handlePopularClick(dest)}
              >
                <div
                  className="explore-popular-image"
                  style={{ backgroundImage: `url(${dest.image})` }}
                >
                  <div className="explore-popular-overlay">
                    <span className="explore-popular-emoji">{dest.emoji}</span>
                    <h3 className="explore-popular-name">{dest.name}</h3>
                    <p className="explore-popular-country">{dest.country}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
