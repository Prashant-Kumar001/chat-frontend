import React, { lazy, Suspense, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { login, setLoading } from "./redux/reducers/auth";
import { API_BASE_URL } from "./config";
import ErrorBoundary from "./components/ErrorBoundary";
import Loader from "./components/Loader";
import NewLoader from "./components/NewLoader";
import AdminLayout from "./layout/AdminLayout";
import { SocketProvider } from "./Socket";

import NotFound from "./pages/NotFound";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Register = lazy(() => import("./pages/Register"));
const Groups = lazy(() => import("./pages/Groups"));
const AdminDashboard = lazy(() => import("./pages/admin/DashBord"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Users = lazy(() => import("./pages/admin/UsersManagement"));
const ChatManagement = lazy(() => import("./pages/admin/ChatManagement"));
const MessageManagement = lazy(() => import("./pages/admin/MessageManagement"));
const AdminWelcome = lazy(() => import("./pages/admin/AdminWelcome"))

import AdminProtectedRoute from "./pages/admin/AdminProtectedRoute";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);
  if (loading) return <NewLoader />;
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const currentUser = async () => {
      try {
        dispatch(setLoading(true));
        const res = await axios.get(`${API_BASE_URL}/api/v1/auth/me`, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        dispatch(login(res?.data.data?.user));
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoading(false));
        setAuthChecked(true);
      }
    };

    currentUser();
  }, [dispatch]);

  if (!authChecked) return <NewLoader />;

  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <SocketProvider>
                    <Home />
                  </SocketProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/:_id"
              element={
                <ProtectedRoute>
                  <SocketProvider>
                    <Chat />
                  </SocketProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/groups"
              element={
                <ProtectedRoute>
                  <SocketProvider>
                    <Suspense fallback={<NewLoader />}>
                      <Groups />
                    </Suspense>
                  </SocketProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute role="admin">
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<AdminWelcome />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="messages" element={<MessageManagement />} />
              <Route path="chats" element={<ChatManagement />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
