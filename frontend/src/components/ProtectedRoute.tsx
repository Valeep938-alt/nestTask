import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Role } from '../api/types';
import { useAuth } from '../context/AuthContext';
import { homePathFor } from '../utils/routes';

export default function ProtectedRoute({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="container page muted">Cargando…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to={homePathFor(user.role)} replace />;

  return <>{children}</>;
}
