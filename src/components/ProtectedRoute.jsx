import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

/**
 * Wraps a route to require authentication.
 * Redirects to /login if not logged in.
 * Shows a loading state while checking auth.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" style={{ width: 48, height: 48 }} />
          <p className="text-slate-500 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
