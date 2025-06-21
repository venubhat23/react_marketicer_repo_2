import { Navigate } from 'react-router-dom';
import { useAuth } from '../authContext/AuthContext'; // adjust the path if needed

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // ✅ use AuthContext

  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
