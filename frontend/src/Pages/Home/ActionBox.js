// ActionBox.js
import React from "react";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./home.css";
import { updateTransactionAPI, deleteTransactionAPI } from "../../utils/ApiRequest";
import axios from "axios";

const ActionBox = ({ transaction, onEdit, onDelete }) => {
  // Handles edit click by calling a passed-in callback (e.g., to open an update modal)
  const handleEditClick = (e) => {
    e.preventDefault();
    if (onEdit) {
      onEdit(transaction._id);
    }
  };

  // Handles delete click by calling the delete API endpoint and then invoking the onDelete callback
  const handleDeleteClick = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user._id) {
        throw new Error("User not found in local storage");
      }
      // The endpoint expects a POST request with the userId in the body and transaction id in the URL.
      await axios.post(`${deleteTransactionAPI}/${transaction._id}`, { userId: user._id });
      if (onDelete) {
        onDelete(transaction._id);
      }
    } catch (err) {
      console.error("Delete transaction error:", err);
    }
  };

  return (
    <div className="icons-handle">
      <EditNoteIcon sx={{ cursor: "pointer" }} onClick={handleEditClick} />
      <DeleteForeverIcon sx={{ color: "red", cursor: "pointer" }} onClick={handleDeleteClick} />
    </div>
  );
};

export default ActionBox;
