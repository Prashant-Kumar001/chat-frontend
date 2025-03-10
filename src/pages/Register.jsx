import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import schema from "../utils/validationSchema";
import Api from "../utils/frontendApi";
import { Button, CircularProgress } from "@mui/material";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


function Register() {
  const [isLoading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setValue("image", file);
    }
  };

  const navigate = useNavigate();

  const onSubmit = (data) => {
    setLoading(true);
    const toastId = toast.loading("registering...");
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("bio", data.bio);
    formData.append("password", data.password);
    if (data.image) {
      formData.append("image", data.image);
    }

    Api.registerUser(formData)
      .then((response) => {
        if (response.success) {
          toast.success("Registration successful!");
          reset();
          setImagePreview(null);
          setValue("image", null);
          navigate("/login");
        } else {
          toast.error("Registration failed");
        }
      })
      .finally(() => {
        setLoading(false);
        toast.dismiss(toastId);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-2 bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow-lg border border-gray-300 items-center flex gap-4">
        <div className="flex flex-col items-center w-1/3">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-full border border-gray-300 shadow-md"
            />
          ) : (
            <div className="w-40 h-40 flex items-center justify-center rounded-full bg-gray-200 border border-gray-300">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            id="image"
            className="hidden"
            onChange={handleImageChange}
          />
          <Button
            component="label"
            onClick={() => document.getElementById("image").click()}
          >
            <CloudUploadIcon />
          </Button>

          <p className="text-red-500 text-sm mt-2">{errors.image?.message}</p>
        </div>

        {/* Input Fields Section */}
        <div className="flex flex-col w-2/3 ">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {[
              { label: "Username", name: "username", type: "text", placeholder: "Enter your username" },
              { label: "Name", name: "name", type: "text", placeholder: "Enter your name" },
              { label: "Email", name: "email", type: "email", placeholder: "Enter your email" },
              { label: "Bio", name: "bio", type: "text", placeholder: "Enter your bio" },
              { label: "Password", name: "password", type: "password", placeholder: "Enter your password" },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label htmlFor={name} className="block font-medium text-gray-700">{label}</label>
                <input
                  type={type}
                  id={name}
                  {...register(name)}
                  className="w-full p-3 outline outline-1 outline-blue-400 rounded-md focus:ring-1 focus:ring-blue-500"
                  placeholder={placeholder}
                />
                <p className="text-red-500 text-sm">{errors[name]?.message}</p>
              </div>
            ))}
            <Button type="submit" variant="outlined" color="primary" fullWidth disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : "Register"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
