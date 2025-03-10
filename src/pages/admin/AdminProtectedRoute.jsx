import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminProtectedRoute = ({ children, role }) => {
    const { user } = useSelector((state) => state.admin);
  if (!user || (role && user.role !== role)) return <Navigate to="/admin-login" />;
  return children;
};

export default AdminProtectedRoute;
