// AdminDashboard.js
import React, { useEffect, useState } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {
  getAllUsersAPI,
  updateUserAPI,
  deleteUserAPI,
} from "../../utils/ApiRequest";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // for editing user details
  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    role: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    theme: "dark",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
  };

  // Fetch all users on mount and when refresh changes
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(getAllUsersAPI);
        if (data.success) {
          setUsers(data.users);
        } else {
          toast.error(data.message, toastOptions);
        }
      } catch (error) {
        toast.error("Error fetching users", toastOptions);
      }
      setLoading(false);
    };
    fetchUsers();
  }, [refresh]);

  // Handle deletion of a user
  const handleDelete = async (userId) => {
    try {
      const { data } = await axios.delete(`${deleteUserAPI}/${userId}`);
      if (data.success) {
        toast.success("User deleted successfully", toastOptions);
        setRefresh(!refresh);
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (error) {
      toast.error("Error deleting user", toastOptions);
    }
  };

  // Handle edit button click by setting selected user and opening the modal
  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormValues({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // Handle changes in the update form
  const handleFormChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  // Submit updated user information
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      const { data } = await axios.put(
        `${updateUserAPI}/${selectedUser._id}`,
        formValues
      );
      if (data.success) {
        toast.success("User updated successfully", toastOptions);
        setShowModal(false);
        setRefresh(!refresh);
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (error) {
      toast.error("Error updating user", toastOptions);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Admin Dashboard</h2>
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Avatar Set</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.isAvatarImageSet ? "Yes" : "No"}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No users found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Modal for updating user details */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFormSubmit}>
          <Modal.Body>
            <Form.Group controlId="formUserName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUserEmail" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUserRole" className="mt-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={formValues.role}
                onChange={handleFormChange}
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update User
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ToastContainer />
    </Container>
  );
};

export default AdminDashboard;
