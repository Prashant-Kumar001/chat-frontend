import React from "react";
import {
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
    Tooltip,
} from "@mui/material";
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
        if (files.length > 5) return toast.error(`You can only send 5 ${key} at a time`);
        
        dispatch(setLoading(true));
        const toastId = toast.loading("Sending...");
        handleClose();
        
        const formData = new FormData();
        formData.append("chatId", chatId);
        files.forEach((element) => formData.append("files", element));
        
        useSendAttachment(formData)
            .then((res) => {
                if (res.data) {
                    toast.success(`${key} sent successfully`, { id: toastId });
                } else {
                    toast.error(`${key} failed to send 😞`, { id: toastId });
                }
            })
            .catch((err) => {
                toast.error(`${err?.data?.message} || Something went wrong 😞`, { id: toastId });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    return (
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose} PaperProps={{ sx: { bgcolor: "#121212", color: "white", borderRadius: 2, boxShadow: 3 } }}>
            <motion.div className="p-3 flex flex-col gap-3">
                {['image', 'video', 'audio', 'file'].map((type, index) => (
                    <React.Fragment key={type}>
                        <input
                            type="file"
                            id={type}
                            className="hidden"
                            accept={type === 'file' ? '*' : `${type}/*`}
                            onChange={(e) => handleFileChange(e, type)}
                        />
                        <Tooltip title={type.charAt(0).toUpperCase() + type.slice(1)} placement="left">
                            <MenuItem onClick={() => document.getElementById(type).click()} sx={{ '&:hover': { bgcolor: "#333" } }}>
                                <ListItemIcon>
                                    {type === 'image' && <FaFileImage size={22} color="lightblue" />}
                                    {type === 'video' && <FaFileVideo size={22} color="red" />}
                                    {type === 'audio' && <FaFileAudio size={22} color="green" />}
                                    {type === 'file' && <FaFile size={22} color="gray" />}
                                </ListItemIcon>
                                <ListItemText primary={type} />
                            </MenuItem>
                        </Tooltip>
                    </React.Fragment>
                ))}
            </motion.div>
        </Menu>
    );
};

export default FileMenu;
