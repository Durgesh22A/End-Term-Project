import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook to fetch a single trip with real-time updates
 * Supports both Firebase and demo mode
 */
export function useTrip(tripId) {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, demoMode } = useAuth();

  useEffect(() => {
    if (!user || !tripId) {
      setLoading(false);
      return;
    }

    // --- DEMO MODE ---
    if (demoMode) {
      try {
        const trips = JSON.parse(localStorage.getItem('triledger_trips') || '[]');
        const found = trips.find(t => t.id === tripId);
        setTrip(found || null);
        if (!found) setError('Trip not found');
      } catch {
        setError('Failed to load trip');
      }
      setLoading(false);
      return;
    }

    // --- FIREBASE MODE ---
    if (!db) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const tripRef = doc(db, 'users', user.uid, 'trips', tripId);

    const unsubscribe = onSnapshot(tripRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setTrip({ id: docSnap.id, ...docSnap.data() });
        } else {
          setTrip(null);
          setError('Trip not found');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching trip:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, tripId, demoMode]);

  return { trip, loading, error };
}
