import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to={role === 'admin' ? '/admin/login' : '/trader/login'} replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return children;
}
