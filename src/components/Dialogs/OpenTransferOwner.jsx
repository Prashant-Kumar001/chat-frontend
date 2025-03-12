import React from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { setOpenTransferFile } from "../../redux/reducers/misc";
import { useSelector } from "react-redux";

const OpenTransferOwner = ({ dispatch, transferOwnerMenu }) => {
  const { openTransferFile } = useSelector((state) => state.misc);

  const closeHandler = () => {
    dispatch(setOpenTransferFile(false));
    transferOwnerMenu.current = null;
  };

  return (
    <Menu
      open={openTransferFile}
      onClose={closeHandler}
      anchorEl={transferOwnerMenu.current}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        elevation: 8,
        sx: {
          minWidth: 200,
          borderRadius: 2,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <MenuItem sx={{ "&:hover": { bgcolor: "#f5f5f5" } }}>
        <ListItemIcon>
          <ExitToAppIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText primary="Transfer Ownership" />
      </MenuItem>
    </Menu>
  );
};

export default OpenTransferOwner;