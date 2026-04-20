import { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    // Safety timeout — never show loader for more than 2 seconds
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    try {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        clearTimeout(timeout);
        setUser(currentUser);
        setLoading(false);
      }, (error) => {
        clearTimeout(timeout);
        console.error('Auth error:', error);
        setLoading(false);
      });

      return () => {
        clearTimeout(timeout);
        unsubscribe();
      };
    } catch (error) {
      clearTimeout(timeout);
      console.error('Auth listener error:', error);
      setLoading(false);
    }
  }, []);

  const signup = async (email, password, displayName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(result.user, { displayName });
    }
    return result;
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export default AuthContext;
