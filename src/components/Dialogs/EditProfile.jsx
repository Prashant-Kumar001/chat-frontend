import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Avatar,
  IconButton,
} from "@mui/material";
import { Cancel as CancelIcon, Update, PhotoCamera } from "@mui/icons-material";
import toast from "react-hot-toast";

const EditProfile = ({ open, onClose, onSave, user }) => {
  const initialData = {
    username: user?.username || "",
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    avatar: user?.avatar?.secure_url || "",
  };

  const [formData, setFormData] = useState(initialData);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    setFormData(initialData);
    setImageFile(null);
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData({ ...formData, avatar: URL.createObjectURL(file) });
    }
  };

  const handleSave = () => {
    let modifiedFields = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== initialData[key]) {
        modifiedFields[key] = formData[key];
      }
    });

    if (imageFile) {
      modifiedFields.avatarFile = imageFile;
    }

    if (Object.keys(modifiedFields).length > 0) {
      onSave({ ...modifiedFields, id: user?._id });
    } else {
      toast.error("Couldn't save, please modify at least once field", {
        style: {
          minWidth: "400px", 
          maxWidth: "500px", 
          whiteSpace: "nowrap", 
          overflow: "hidden", 
          textOverflow: "ellipsis", 
          textAlign: "center",
        },
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          mt={1}
          alignItems="center"
        >
          <Box position="relative">
            <Avatar
              src={formData.avatar}
              alt="Profile Picture"
              sx={{ width: 100, height: 100 }}
            />
            <input
              accept="image/*"
              id="avatar-upload"
              type="file"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <label htmlFor="avatar-upload">
              <IconButton
                color="primary"
                component="span"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "white",
                }}
              >
                <PhotoCamera />
              </IconButton>
            </label>
          </Box>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<CancelIcon />}
          onClick={onClose}
          color="error"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          startIcon={<Update />}
          onClick={handleSave}
          color="primary"
          variant="contained"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfile;
