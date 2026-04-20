import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, 
  query, orderBy, onSnapshot, serverTimestamp 
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for expense CRUD with real-time Firestore updates
 * Uses useMemo for computed totals and useCallback for stable references
 */
export function useExpenses(tripId) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !tripId || !db) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const expRef = collection(db, 'users', user.uid, 'trips', tripId, 'expenses');
    const q = query(expRef, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setExpenses(data);
        setLoading(false);
      },
      (err) => {
        console.error('Expense listener error:', err.message);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, tripId]);

  // Memoized total — only recalculates when expenses array changes
  const total = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  }, [expenses]);

  // Memoized category breakdown
  const byCategory = useMemo(() => {
    return expenses.reduce((acc, exp) => {
      const cat = exp.category || 'other';
      if (!acc[cat]) acc[cat] = { total: 0, count: 0, items: [] };
      acc[cat].total += exp.amount || 0;
      acc[cat].count += 1;
      acc[cat].items.push(exp);
      return acc;
    }, {});
  }, [expenses]);

  const addExpense = useCallback(async (data) => {
    if (!user || !tripId || !db) return;
    const expRef = collection(db, 'users', user.uid, 'trips', tripId, 'expenses');
    const docRef = await addDoc(expRef, { ...data, createdAt: serverTimestamp() });
    return docRef.id;
  }, [user, tripId]);

  const updateExpense = useCallback(async (expId, data) => {
    if (!user || !tripId || !db) return;
    const expRef = doc(db, 'users', user.uid, 'trips', tripId, 'expenses', expId);
    await updateDoc(expRef, data);
  }, [user, tripId]);

  const deleteExpense = useCallback(async (expId) => {
    if (!user || !tripId || !db) return;
    const expRef = doc(db, 'users', user.uid, 'trips', tripId, 'expenses', expId);
    await deleteDoc(expRef);
  }, [user, tripId]);

  return { expenses, total, byCategory, addExpense, updateExpense, deleteExpense, loading, error };
}
