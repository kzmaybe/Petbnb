import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import API from '../services/api.js';

export const AuthContext = createContext({});

const getStoredUser = () => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [initializing, setInitializing] = useState(() => {
    const token = localStorage.getItem('token');
    return Boolean(token && !getStoredUser());
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setInitializing(false);
      return;
    }

    if (user) {
      setInitializing(false);
      return;
    }

    API.get('/auth/me')
      .then((response) => setUser(response.data))
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      })
      .finally(() => setInitializing(false));
  }, [user]);

  const login = useCallback((userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      initializing,
      isAuthenticated: Boolean(user)
    }),
    [initializing, login, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
