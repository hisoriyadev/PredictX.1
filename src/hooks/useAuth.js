import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

/**
 * Custom hook for accessing auth state and actions.
 * Must be used within <AuthProvider>.
 */
export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
