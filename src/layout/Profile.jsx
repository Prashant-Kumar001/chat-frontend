import React, { useState } from "react";
import moment from "moment";
import { Avatar, Button } from "@mui/material";
import EditProfile from "../components/Dialogs/EditProfile";

const Profile = ({ user }) => {
  const [open, setOpen] = useState(false)
  const OpenDialog = () => {
    setOpen(true)
  }
  const CloseDialog = () => {
    setOpen(false)
  }

  const updateProfile = (profile) => {

  }


  return (
    <>
      <EditProfile open={open} onClose={CloseDialog} onSave={updateProfile} userData={user} />
      <div className="min-h-screen flex justify-center">
        <div className="w-full max-w-md  p-2">
          <div className="flex flex-col items-center">
            <Avatar
              sx={{ width: 100, height: 100 }}
              alt={user?.username}
              src={user?.avatar?.secure_url}
              className="border-4 "
            />
            <h1 className="mt-3 text-2xl font-semibold text-gray-50">
              {user?.name}
            </h1>
          </div>

          <div className="mt-6 space-y-4">
            <ProfileDetail label="Username" value={`@${user?.username}`} />
            <ProfileDetail label="Email" value={user.email} />
            <ProfileDetail label="Bio" value={user?.bio || "No bio available"} />
            <ProfileDetail
              label="Joined"
              value={moment(user?.createdAt).format("MMMM Do, YYYY")}
            />
          </div>

          <div className="mt-6 text-center">
            <Button onClick={OpenDialog} variant="outlined" color="gray" >
              edit Profile
            </Button>
          </div>
        </div>
      </div>
    </>

  );
};

const ProfileDetail = ({ label, value }) => {
  return (
    <div className="flex justify-between items-center flex-col border-b pb-2">
      <p className="text-gray-50 text-sm">{label}</p>
      <p className="text-gray-50 font-medium">{value}</p>
    </div>
  );
};

export default Profile;
