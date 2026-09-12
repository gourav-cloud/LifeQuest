import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';

interface AuthContextType {
  user: User | null;
  demoUser: { uid: string; email: string; displayName: string } | null;
  token: string | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsDemoHero: (heroName?: string) => void;
  logout: () => Promise<void>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [demoUser, setDemoUser] = useState<{ uid: string; email: string; displayName: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check saved demo user session on mount
  useEffect(() => {
    const savedDemo = localStorage.getItem('lifequest_demo_user');
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        setDemoUser(parsed);
        setToken(`demo-guest-token:${parsed.uid}:${parsed.email}`);
      } catch (e) {
        localStorage.removeItem('lifequest_demo_user');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDemoUser(null);
        localStorage.removeItem('lifequest_demo_user');
        const idToken = await currentUser.getIdToken();
        setToken(idToken);
      } else if (!savedDemo) {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const res = await signInWithPopup(auth, googleAuthProvider);
      setUser(res.user);
      setDemoUser(null);
      localStorage.removeItem('lifequest_demo_user');
      const idToken = await res.user.getIdToken();
      setToken(idToken);
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoHero = (heroName = 'Arthur the Brave') => {
    const safeUid = 'demo_hero_knight';
    const demoData = {
      uid: safeUid,
      email: 'hero@lifequest.realm',
      displayName: heroName,
    };
    setDemoUser(demoData);
    setUser(null);
    const demoToken = `demo-guest-token:${demoData.uid}:${demoData.email}`;
    setToken(demoToken);
    localStorage.setItem('lifequest_demo_user', JSON.stringify(demoData));
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (user) {
        await signOut(auth);
      }
      setUser(null);
      setDemoUser(null);
      setToken(null);
      localStorage.removeItem('lifequest_demo_user');
    } finally {
      setLoading(false);
    }
  };

  const authFetch = async (url: string, options: RequestInit = {}) => {
    let currentToken = token;

    // Refresh token if Firebase user is active
    if (user) {
      currentToken = await user.getIdToken();
      setToken(currentToken);
    }

    const headers = new Headers(options.headers || {});
    if (currentToken) {
      headers.set('Authorization', `Bearer ${currentToken}`);
    }
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    return fetch(url, {
      ...options,
      headers,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        demoUser,
        token,
        loading,
        loginWithGoogle,
        loginAsDemoHero,
        logout,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
