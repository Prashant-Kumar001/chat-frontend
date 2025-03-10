import { IconButton, Tooltip, Badge } from "@mui/material";
import React from "react";

const Icon = ({ title, icon, onClick, value, arrow, disabled, display }) => {
  return (
    <Tooltip title={title} arrow={!!arrow}>
      <IconButton
        sx={
          display
            ? {
                display: {
                  xs: "block",
                  sm: "none",
                },
              }
            : {}
        }
        color="inherit"
        size="large"
        disabled={disabled}
        onClick={onClick}
      >
        {value ? (
          <Badge badgeContent={value} color="error">
            {icon}
          </Badge>
        ) : (
          icon
        )}
      </IconButton>
    </Tooltip>
  );
};

export default Icon;
