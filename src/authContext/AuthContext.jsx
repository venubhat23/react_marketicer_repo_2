import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole') || 'influencer'; // Default to influencer
    if (token) {
      const newUser = { token, role: userRole };
      setUser(newUser);
    }
    setLoading(false);
  }, []);

  const login = (token, role = 'influencer') => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    const newUser = { token, role };
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setUser(null);
  };

  if (loading) return <div>Loading...</div>

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
