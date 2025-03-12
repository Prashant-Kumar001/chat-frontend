import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { Save as SaveIcon, Cancel as CancelIcon, Update } from "@mui/icons-material";

const EditProfile = ({ open, onClose, onSave, userData }) => {
  const [formData, setFormData] = useState({
    username: userData?.username || "",
    name: userData?.name || "",
    email: userData?.email || "",
    bio: userData?.bio || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
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
          onClick={() => onSave(formData)}
          color="primary"
          variant="contained"
        >
          update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfile;
