import React, { useState, useCallback, useMemo, lazy, Suspense } from "react";
import moment from "moment";
import { Avatar, Button, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const EditProfile = lazy(() => import("../components/Dialogs/EditProfile"));
import {
  useGetMyProfileQuery,
  useUpdateUserProfileMutation,
} from "../redux/api/api";
import NewLoader from "../components/NewLoader";
import { useMutationAsyncMutation } from "../hooks/hook";

const Profile = ({ mobileView = false, onBack }) => {
  const { data, isLoading } = useGetMyProfileQuery();
  const [updateUserProfile] = useUpdateUserProfileMutation();
  const { executeMutation, loading: updating } =
    useMutationAsyncMutation(updateUserProfile);
  const user = data?.data;
  const [open, setOpen] = useState(false);

  const openDialog = useCallback(() => {
    setOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
  }, []);

  const updateProfile = useCallback(
    (profile) => {
      executeMutation({
        payload: { id: profile?.id, user: profile },
        errorMessage: "Failed to update profile",
        loadingMessage: "Updating profile",
        successMessage: "Profile updated successfully",
        onSuccess: closeDialog,
      });
    },
    [closeDialog, executeMutation]
  );

  const joinDate = useMemo(
    () => (user ? moment(user.createdAt).format("MMMM Do, YYYY") : ""),
    [user]
  );

  if (isLoading) {
    return <NewLoader />;
  }

  return (
    <>
      <Suspense fallback={<NewLoader />}>
        <EditProfile open={open} onClose={closeDialog} onSave={updateProfile} user={user} />
      </Suspense>

      {mobileView ? (
        <>
          <div className="fixed inset-0 overflow-hidden z-50 bg-gray-900 m-5 rounded-md">
            <div className="w-full  p-2">
              <div className="flex flex-col items-center">
                <Avatar
                  sx={{ width: 100, height: 100 }}
                  alt={user?.username}
                  src={user?.avatar?.secure_url}
                  className="border-4"
                />
                <h1 className="mt-3 text-2xl font-semibold text-gray-50">
                  {user?.name}
                </h1>
              </div>

              <div className="mt-6 space-y-4">
                <ProfileDetail label="Username" value={`@${user?.username}`} />
                <ProfileDetail label="Email" value={user?.email} />
                <ProfileDetail label="Bio" value={user?.bio || "No bio available"} />
                <ProfileDetail label="Joined" value={joinDate} />
              </div>

              <div className="mt-6 text-center flex gap-2 justify-center">
                <Button
                  disabled={updating}
                  onClick={openDialog}
                  variant="outlined"
                  color="primary"
                >
                  Edit Profile
                </Button>
                <IconButton
                  disabled={updating}
                  onClick={onBack}
                  variant="outlined"
                  color="secondary"
                >
                  <ArrowBackIcon />
                </IconButton>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="min-h-screen flex justify-center">
          <div className="w-full max-w-md p-2">
            <div className="flex flex-col items-center">
              <Avatar
                sx={{ width: 100, height: 100 }}
                alt={user?.username}
                src={user?.avatar?.secure_url}
                className="border-4"
              />
              <h1 className="mt-3 text-2xl font-semibold text-gray-50">
                {user?.name}
              </h1>
            </div>

            <div className="mt-6 space-y-4">
              <ProfileDetail label="Username" value={`@${user?.username}`} />
              <ProfileDetail label="Email" value={user?.email} />
              <ProfileDetail label="Bio" value={user?.bio || "No bio available"} />
              <ProfileDetail label="Joined" value={joinDate} />
            </div>

            <div className="mt-6 text-center">
              <Button
                disabled={updating}
                onClick={openDialog}
                variant="outlined"
                color="primary"
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ProfileDetail = React.memo(({ label, value }) => (
  <div className="flex flex-col border-b pb-2">
    <p className="text-gray-50 text-sm">{label}</p>
    <p className="text-gray-50 font-medium">{value}</p>
  </div>
));

export default Profile;
