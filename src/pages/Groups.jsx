import React, { lazy, memo, Suspense, useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { MenuIcon, UserPlus, UserRoundX } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import AvatarCard from "../shared/AvatarCard";
import toast from "react-hot-toast";
import AddMemberDialog from "../components/Dialogs/AddMemberDialog.jsx";
import UserItem from "../shared/UserItem";
import Icon from "../shared/IconBtn.jsx";
import {
  useChangeGroupNameMutation,
  useChatDetailsQuery,
  useDeleteChatMutation,
  useDeleteGroupUserMutation,
  useGetMyGroupsQuery,
} from "../redux/api/api.js";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useError } from "../hooks/hook.jsx";
import { Drawer, Grid2, Skeleton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Check } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import NewLoader from "../components/NewLoader.jsx";
import { setIsAddMember } from "../redux/reducers/misc.js";
import { motion } from "framer-motion"

const DialogsModal = lazy(() => import("../components/Dialogs/ConfirmDialog"));

const Groups = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chatId = useSearchParams()[0].get("group");

  const { user } = useSelector((state) => state.auth);
  const { isAddMember } = useSelector((state) => state.misc);

  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [conformDeleteDialog, setConformDeleteDialog] = useState(false);
  const [loader, setLoader] = useState(false);

  const [GroupName, setGroupName] = useState("");
  const [newGroupName, SetEditGroupName] = useState("");

  const [members, setMembers] = useState([]);

  const {
    data: myGroups,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetMyGroupsQuery();
  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );

  const [changeGroupName] = useChangeGroupNameMutation();
  const [deleteGroupUser] = useDeleteGroupUserMutation();
  const [deleteGroup] = useDeleteChatMutation();

  const errors = [
    {
      isError,
      error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];
  useError[errors];

  useEffect(() => {
    const groupData = groupDetails.data;
    if (groupData) {
      setGroupName(groupData?.data?.name);
      SetEditGroupName(groupData?.data?.name);
      setMembers(groupDetails?.data?.data?.members);
    }

    return () => {
      setGroupName("");
      SetEditGroupName("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);

  useEffect(() => {
    return () => {
      setGroupName("");
      SetEditGroupName("");
      setIsEdit(false);
    };
  }, [chatId]);

  const handleNavigateBack = () => {
    navigate("/");
  };

  const handleOpenDrawer = () => {
    setIsOpen((prev) => !prev);
  };

  const updateGroupName = () => {
    setLoader(true);
    const toastId = toast.loading("Updating...");
    changeGroupName({ chatId: chatId, newGroupName: newGroupName })
      .unwrap()
      .then((data) => {
        toast.success("name updated");
      })
      .catch((error) => {
        toast.error(error?.data?.message);
      })
      .finally(() => {
        toast.dismiss(toastId);
        setLoader(false);
      });
    setIsEdit((prev) => !prev);
  };

  const handlerRemover = (user) => {
    const toastId = toast.loading("Removing...");
    deleteGroupUser({ chatId: chatId, userId: user._id })
      .unwrap()
      .then((data) => {
        toast.success("user removed");
      })
      .catch((error) => {
        toast.error(error?.data?.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          width: 300,
        });
      })
      .finally(() => {
        toast.dismiss(toastId);
      });
  };

  const handlerOpenDialog = () => {
    dispatch(setIsAddMember(true));
  };
  const OpenHandlerDeleteGroup = () => {
    setConformDeleteDialog(true);
  };
  const CloseHandlerDeleteUser = () => {
    setConformDeleteDialog(false);
  };
  const handleDelete = () => {
    const toastId = toast.loading("Delete Group....");
    deleteGroup(chatId)
      .unwrap()
      .then((data) => {
        toast.success("Group deleted");
        navigate("/groups");
      })
      .catch((error) => {
        toast.error(error?.data?.message, {
          style: {
            minWidth: '700px',
          },
        });
      })
      .finally(() => {
        toast.dismiss(toastId);
      });
    setConformDeleteDialog(false);
  };


  return (
    <Grid2
      container
      className="flex-1 overflow-hidden"
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "300px 1fr",
        },
      }}
    >
      {/* Sidebar for larger screens */}
      <Grid2
        sx={{
          display: { xs: "none", sm: "block" },
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid rgba(214, 212, 237,0.8)",
          height: "100vh",
          backgroundColor: "#faead4",
        }}
      >
        {isLoading ? (
          <Skeleton variant="rectangular" height={50} />
        ) : myGroups?.data?.length > 0 ? (
          <GroupList myGroups={myGroups?.data} chatId={chatId} />
        ) : (
          <div className="flex justify-center items-center h-full">
            <h2 className="text-2xl font-bold">No groups found</h2>
          </div>
        )}
      </Grid2>

      <div className={`w-full transition-all duration-300 p-1`}>
        <div className="flex justify-between items-center">
          <Icon
            icon={<ArrowBackIcon />}
            onClick={handleNavigateBack}
            text="back"
            title={"Back"}
          />
          <Icon
            icon={<MenuIcon />}
            onClick={handleOpenDrawer}
            text="back"
            title={"menu"}
            display={true}
          />
        </div>

        <div className="mb-4 flex flex-col items-center">
          <h2 className="text-2xl font-bold">Welcome to Groups</h2>
          <p className="text-gray-800 p_font text-[12px]">
            Select a group to get the details
          </p>
        </div>
        {isEdit ? (
          <div className="flex justify-center text-3xl mb-10 items-center ">
            <TextField
              value={newGroupName}
              id="standard-basic"
              label="Standard"
              variant="standard"
              onChange={(e) => SetEditGroupName(e.target.value)}
              sx={{ width: "50%" }}
            />
            <Icon
              icon={<Check />}
              onClick={updateGroupName}
              text="edit"
              title={"Edit Group"}
              disabled={loader}
            />
          </div>
        ) : (
          <>
            {GroupName && (
              <div className="flex flex-col gap-1">
                <div className="flex justify-center flex-col text-xl mb-10 items-center ">
                  <span className="font-bold"> {GroupName}</span>
                  <Icon
                    icon={<EditIcon />}
                    onClick={() => setIsEdit(true)}
                    text="edit"
                    title={"Edit Group"}
                    arrow={true}
                  />
                </div>
                <div className=" mb-2 flex w-full md:max-w-2xl max-w-[20rem] mx-auto flex-col gap-1 ">
                  <h1 className="mb-5 r_font text-center md:text-left font-medium font-sans text-xl">
                    members
                  </h1>
                  <div className=" w-full mx-auto  flex flex-col gap-5 mb-5 overflow-scroll h-[42vh] HideScrollbar">
                    {groupDetails?.isLoading ? (
                      <Skeleton
                        sx={{
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    ) : (
                      members?.map((item) => {
                        return (
                          <UserItem
                            className="shadow-xl bg-gray-100"
                            handler={() => handlerRemover(item)}
                            key={item._id}
                            user={item}
                            size="sm"
                            addIcon={<UserRoundX color="red" size={25} />}
                          />
                        );
                      })
                    )}
                  </div>
                  <div className="flex justify-center gap-4">
                    <Icon
                      icon={<PersonAddAlt1Icon />}
                      onClick={handlerOpenDialog}
                      text="add"
                      arrow={true}
                      title={"add users"}
                    />
                    <Icon
                      title={"delete group"}
                      icon={<DeleteIcon />}
                      onClick={OpenHandlerDeleteGroup}
                      text="delete group"
                      arrow={true}
                    />
                  </div>
                </div>
                {conformDeleteDialog && (
                  <Suspense fallback={<NewLoader />}>
                    <DialogsModal
                      handleClose={CloseHandlerDeleteUser}
                      handleDelete={handleDelete}
                      text={"are you sure you want to delete this group?"}
                    />
                  </Suspense>
                )}
                {isAddMember && (
                  <Suspense fallback={<NewLoader />}>
                    <AddMemberDialog
                      handleClose={() => dispatch(setIsAddMember(false))}
                      icon={<UserPlus size={25} color="green" />}
                      chatId={chatId}
                    />
                  </Suspense>
                )}
              </div>
            )}
          </>
        )}

        {!GroupName && (
          <div className="flex flex-col gap-1">
            <div className="flex justify-center flex-col text-xl mb-10 items-center ">
              <span className="text-2xl font-bold">
                {" "}
                Select a group to get the details
              </span>
            </div>
          </div>
        )}
      </div>

      <Drawer
        open={isOpen}
        disableEnforceFocus={true}
        onClose={() => setIsOpen(false)}
      >
        <GroupList myGroups={myGroups?.data} chatId={chatId} />
      </Drawer>
    </Grid2>
  );
};

const GroupList = ({ myGroups, chatId }) => {
  return (
    <div className="flex flex-col gap-1 ">
      {myGroups?.map((group, index) => (
        <GroupListItem key={group._id} Groups={group} chatId={chatId} index={index} />
      ))}
    </div>
  );
};

const GroupListItem = memo(({ Groups, chatId, index }) => {
  const { _id, avatar, name } = Groups;
  return (
    <Link
      className=""
      to={`?group=${_id}`}
      onClick={(e) => chatId === _id && e.preventDefault()}
    >
      <motion.div initial={{ opacity: 0, y: "-100%" }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1}} className="hover: rounded px-3 py-1 flex items-center gap-4 hover:bg-slate-900 hover:text-white">
        <AvatarCard avatar={avatar} name={name} size="sm" />
        <p className="text-sm font-medium">{name}</p>
      </motion.div>
    </Link>
  );
});
export default Groups;
