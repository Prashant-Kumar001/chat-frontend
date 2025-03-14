import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { adminLogin } from "../../redux/reducers/thunk/admin";
import toast from "react-hot-toast";
import { Button, CircularProgress, TextField } from "@mui/material";
import BlackScreen from "../../components/BlackScreen";

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
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const toastId = toast.loading("logging in...");
    setServerError("");
    setSuccessMessage("");

    try {
      const action = await dispatch(adminLogin(data));
      if (adminLogin.fulfilled.match(action)) {
        toast.success("Login successful!");
        setSuccessMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/admin"), 1500);
      } else {
        setServerError("Login failed. Please try again.");
      }
    } catch (err) {
      setServerError("An unexpected error occurred. Please try again later.");
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <BlackScreen />}
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col ">
            <div>
              <TextField
                id="email"
                label="email"
                variant="outlined"
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email format",
                  },
                })}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.email
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
              <TextField
                id="password"
                label="Password"
                variant="outlined"
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.password
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

            <Button loading={loading} variant="outlined" type="submit" >
              login
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
