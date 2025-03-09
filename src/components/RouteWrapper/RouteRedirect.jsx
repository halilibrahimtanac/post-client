// RootRedirect.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RootRedirect = () => {
  const isAuthenticated = useSelector((state) => state.data.isAuthenticated);
  return isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />;
};

export default RootRedirect;
