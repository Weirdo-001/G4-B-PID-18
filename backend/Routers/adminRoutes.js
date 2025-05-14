import express from 'express';
import { 
  getAllUsersController, 
  deleteUserController, 
  updateUserController 
} from '../controllers/adminController.js';

const router = express.Router();

// Example: Admin can fetch all users.
router.route("/getUsers").get(getAllUsersController);

// Admin can delete a user (if needed).
router.route("/deleteUser/:id").delete(deleteUserController);

// Admin can update user details.
router.route("/updateUser/:id").put(updateUserController);

export default router;
