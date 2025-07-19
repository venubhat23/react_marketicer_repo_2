import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  token: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, role?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole') || 'influencer'; // Default to influencer
    if (token) {
      const newUser: User = { token, role: userRole };
      setUser(newUser);
    }
    setLoading(false);
  }, []);

  const login = (token: string, role: string = 'influencer') => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    const newUser: User = { token, role };
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

export const useAuth = (): AuthContextType | null => useContext(AuthContext);
