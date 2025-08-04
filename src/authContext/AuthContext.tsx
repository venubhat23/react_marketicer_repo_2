import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AxiosManager from '../utils/api';

interface User {
  id: string | number;
  token: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, role?: string, userId?: string | number) => void;
  logout: () => void;
  fetchUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user profile from API
  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await AxiosManager.get('/api/v1/user/profile');
      const profileData = response.data;
      
      if (profileData) {
        const userId = profileData.id || profileData.user_id;
        if (userId) {
          localStorage.setItem('userId', userId.toString());
          setUser(prevUser => prevUser ? { ...prevUser, id: userId } : null);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole') || 'influencer'; // Default to influencer
    const userId = localStorage.getItem('userId');
    
    if (token) {
      if (userId) {
        const newUser: User = { 
          id: userId, 
          token, 
          role: userRole 
        };
        setUser(newUser);
      } else {
        // Create user without ID initially, will fetch it later
        const newUser: User = { 
          id: '', 
          token, 
          role: userRole 
        };
        setUser(newUser);
        // Try to fetch user profile to get the ID
        setTimeout(() => {
          fetchUserProfile();
        }, 100);
      }
    }
    setLoading(false);
  }, [fetchUserProfile]);

  const login = (token: string, role: string = 'influencer', userId?: string | number) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    
    if (userId) {
      localStorage.setItem('userId', userId.toString());
      const newUser: User = { id: userId, token, role };
      setUser(newUser);
    } else {
      // If no userId provided, create user without ID and fetch it
      const newUser: User = { id: '', token, role };
      setUser(newUser);
      // Try to fetch user profile to get the ID
      setTimeout(() => {
        fetchUserProfile();
      }, 100);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    setUser(null);
  };

  if (loading) return <div>Loading...</div>

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType | null => useContext(AuthContext);
