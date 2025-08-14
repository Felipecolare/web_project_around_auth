import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, isLoggedIn }) {
  return isLoggedIn ? children : <Navigate to="/signin" />;
}