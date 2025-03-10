import React from "react";
import { Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import { FaFileAudio, FaFileVideo, FaFileImage, FaFile } from "react-icons/fa6";
import { setLoading } from "../../redux/reducers/misc";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useSendAttachmentMutation } from "../../redux/api/api.js";

const FileMenu = ({ anchorEl, open, handleClose, chatId }) => {
    const dispatch = useDispatch();
    const { isUploadingLoader } = useSelector((state) => state.misc);
    const [useSendAttachment] = useSendAttachmentMutation();
    const handleFileChange = (event, key) => {
        const files = Array.from(event.target.files);
        if (files.length <= 0) return;
        if (files.length > 5)
            return toast.error(`You can only send 5 ${key} at a time`);

        dispatch(setLoading(true));
        const toastId = toast.loading("sending...");
        handleClose()

        const formData = new FormData();
        formData.append("chatId", chatId);
        files?.forEach(element => formData.append("files", element));
        useSendAttachment(formData)
            .then((res) => {
                if (res.data) {
                    toast.success(`${key} sent successfully`, {
                        id: toastId,
                    });
                } else {
                    toast.error(
                        `${key} failed to send😞`,
                        {
                            id: toastId,
                        }
                    );
                }
            })
            .catch((err) => {
                toast.error(
                    `${err?.data?.message} || something went wrong while uploading😞`,
                    {
                        id: toastId,
                    }
                );
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    return (
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <motion.div className="p-2 flex flex-col bg-gray-50 gap-3">
                <input
                    type="file"
                    id="image"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'image')}
                />
                <input
                    type="file"
                    id="video"
                    className="hidden"
                    accept="video/*"
                    onChange={(e) => handleFileChange(e, 'video')}
                />
                <input
                    type="file"
                    id="audio"
                    className="hidden"
                    accept="audio/*"
                    onChange={(e) => handleFileChange(e, 'audio')}
                />
                <input
                    type="file"
                    id="file"
                    className="hidden"
                    accept="*"
                    onChange={(e) => handleFileChange(e, 'file')}
                />

                <MenuList>
                    <Tooltip title="Image" placement="left">
                        <MenuItem onClick={() => document.getElementById("image").click()}>
                            <FaFileImage size={22} color="blue" />
                        </MenuItem>
                    </Tooltip>
                    <Tooltip title="Video" placement="left">
                        <MenuItem onClick={() => document.getElementById("video").click()}>
                            <FaFileVideo size={22} color="red" />
                        </MenuItem>
                    </Tooltip>
                    <Tooltip title="Audio" placement="left">
                        <MenuItem onClick={() => document.getElementById("audio").click()}>
                            <FaFileAudio size={22} color="green" />
                        </MenuItem>
                    </Tooltip>
                    <Tooltip title="File" placement="left">
                        <MenuItem onClick={() => document.getElementById("file").click()}>
                            <FaFile size={22} color="gray" />
                        </MenuItem>
                    </Tooltip>
                </MenuList>
            </motion.div>
        </Menu>
    );
};

export default FileMenu;
