import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { adminLogin, initialCall } from "../../redux/reducers/thunk/admin";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { status, initialState } = useSelector(state => state.admin)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setServerError("");
    setSuccessMessage("");
    try {
      setLoading(true);
      const action = await dispatch(adminLogin(data));
      if (adminLogin.fulfilled.match(action)) {
        setSuccessMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/admin"), 1500);
      } else {
        toast.error("only admin can login");
        setServerError("Login failed. Please try again.");
      }
    } catch (err) {
      setServerError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialState) {
      const fetchData = async () => {
        try {
          const action = await dispatch(initialCall());
          if (initialCall.fulfilled.match(action)) {
            navigate("/admin");
          } else {
            navigate("/admin-login");
          }
        } catch (error) {
          console.error("Error during API call:", error);
        }
      };
      fetchData();
    }
  }, []); 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Admin Login
        </h1>

        {serverError && (
          <p className="text-red-500 text-center mb-4">{serverError}</p>
        )}
        {successMessage && (
          <p className="text-green-500 text-center mb-4">{successMessage}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${errors.email
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-blue-400"
                }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${errors.password
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-blue-400"
                }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
