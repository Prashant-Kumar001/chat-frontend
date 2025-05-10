import React from "react";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { Cancel, CheckBox } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

const ConfirmDialog = ({ handleClose, handleDelete, text = "are you sure you want delete" }) => {
  return (
    <motion.div className="fixed inset-0  flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm p-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center"
      >
        <XCircle className="text-red-500 w-12 h-12 mx-auto" />
        <h2 className="text-xl text-left font-semibold text-gray-900 mt-4">
          confirm delete
        </h2>
        <p className="text-gray-600 mt-2 text-left">
          {text}
        </p>
        <div className="flex justify-between mt-6">
          <Tooltip title="Delete" >
            <button className="btn btn-success btn-outline btn-sm " onClick={handleDelete}>
              <CheckBox color="success" />
            </button>
          </Tooltip>
          <Tooltip title="Cancel" >
            <button
              className="btn btn-outline btn-error btn-sm "
              onClick={handleClose}
            >
              <Cancel color="error" />
            </button>
          </Tooltip>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmDialog;
