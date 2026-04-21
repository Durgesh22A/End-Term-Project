import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, 
  query, orderBy, onSnapshot, serverTimestamp 
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';

const TripContext = createContext(null);

const ACTIONS = {
  SET_TRIPS: 'SET_TRIPS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_ACTIVE_TRIP: 'SET_ACTIVE_TRIP',
};

function tripReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_TRIPS:
      return { ...state, trips: action.payload, loading: false, error: null };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTIONS.SET_ACTIVE_TRIP:
      return { ...state, activeTrip: action.payload };
    default:
      return state;
  }
}

const initialState = {
  trips: [],
  activeTrip: null,
  loading: true,
  error: null,
};

export function TripProvider({ children }) {
  const [state, dispatch] = useReducer(tripReducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      dispatch({ type: ACTIONS.SET_TRIPS, payload: [] });
      return;
    }

    if (!db) {
      dispatch({ type: ACTIONS.SET_TRIPS, payload: [] });
      return;
    }

    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    const tripsRef = collection(db, 'users', user.uid, 'trips');
    const q = query(tripsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const trips = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        dispatch({ type: ACTIONS.SET_TRIPS, payload: trips });
      },
      (error) => {
        console.error('Firestore error:', error.message);
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addTrip = useCallback(async (tripData) => {
    if (!user || !db) return;
    const tripsRef = collection(db, 'users', user.uid, 'trips');
    const docRef = await addDoc(tripsRef, {
      ...tripData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }, [user]);

  const updateTrip = useCallback(async (tripId, tripData) => {
    if (!user || !db) return;
    const tripRef = doc(db, 'users', user.uid, 'trips', tripId);
    await updateDoc(tripRef, {
      ...tripData,
      updatedAt: serverTimestamp(),
    });
  }, [user]);

  const deleteTrip = useCallback(async (tripId) => {
    if (!user || !db) return;
    const tripRef = doc(db, 'users', user.uid, 'trips', tripId);
    await deleteDoc(tripRef);
    if (state.activeTrip?.id === tripId) {
      dispatch({ type: ACTIONS.SET_ACTIVE_TRIP, payload: null });
    }
  }, [user, state.activeTrip]);

  const setActiveTrip = useCallback((trip) => {
    dispatch({ type: ACTIONS.SET_ACTIVE_TRIP, payload: trip });
  }, []);

  return (
    <TripContext.Provider value={{ ...state, addTrip, updateTrip, deleteTrip, setActiveTrip }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripContext);
  if (!context) throw new Error('useTrips must be used within a TripProvider');
  return context;
}

export default TripContext;
