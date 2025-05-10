import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminProtectedRoute = ({ children, role }) => {
  const { user, status } = useSelector((state) => state.admin);

  if (status) {
    return children;
  }

  if (!user || (role && user.role !== role))
    return <Navigate to="/admin-login" />;
  return children;
};

export default AdminProtectedRoute;
