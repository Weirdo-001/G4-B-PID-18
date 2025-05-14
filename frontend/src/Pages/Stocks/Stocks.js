// Stocks.js
import React, { useEffect, useState } from "react";
import { Container, Button, Modal, Form, Table } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  addStockAPI,
  getStocksAPI,
  updateStockAPI,
  deleteStockAPI,
} from "../../utils/ApiRequest";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/Header";

const Stocks = () => {
  const [cUser, setCUser] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [values, setValues] = useState({
    amount: "",
    company: "",
    description: "",
    date: "",
  });
  const [editStockId, setEditStockId] = useState(null);
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  // Check if a user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : { isGuest: true };
    if (user.isGuest) {
      toast.info('Please login to view or add stocks', toastOptions);
      navigate('/login');
    }
  }, []);
  
  // Check if a user is logged in
useEffect(() => {
  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : { isGuest: true };

  if (user.isGuest) {
    toast.info('Please login to view or add stocks', toastOptions);
    navigate('/login');
  } else {
    // Set the user state here
    setCUser(user);
  }
}, []);

// Fetch stocks on initial render
useEffect(() => {
  if (cUser && cUser._id) {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${getStocksAPI}/${cUser._id}`);
        if (data.success) {
          setStocks(data.stocks);
        } else {
          toast.error(data.message, toastOptions);
        }
      } catch (error) {
        toast.error("Error fetching stocks", toastOptions);
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }
}, [cUser]);

  // Handle input changes in the form
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // Open the modal, optionally for editing
  const handleModalShow = () => {
    setShowModal(true);
  };

  // Close the modal and reset edit state
  const handleModalClose = () => {
    setShowModal(false);
    setEditStockId(null);
    setValues({
      amount: "",
      company: "",
      description: "",
      date: "",
    });
  };

  // Handle form submission for adding/updating a stock
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.amount || !values.company || !values.date) {
      toast.error("Please fill required fields (Amount, Company, Date)", toastOptions);
      return;
    }
    try {
      setLoading(true);
      if (editStockId) {
        // Update existing stock
        const { data } = await axios.put(`${updateStockAPI}/${editStockId}`, values);
        if (data.success) {
          toast.success("Stock updated successfully", toastOptions);
          handleModalClose();
          setStocks((prevStocks) =>
            prevStocks.map((stock) =>
              stock._id === editStockId ? data.stock : stock
            )
          );
        } else {
          toast.error(data.message, toastOptions);
        }
      } else {
        // Add new stock
        const { data } = await axios.post(addStockAPI, { ...values, userId: cUser._id });
        if (data.success) {
          toast.success("Stock added successfully", toastOptions);
          handleModalClose();
          setStocks([...stocks, data.stock]);
        } else {
          toast.error(data.message, toastOptions);
        }
      }
    } catch (error) {
      toast.error("Error submitting stock", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  // Open the modal with the selected stock details for editing
  const handleEdit = (stock) => {
    setEditStockId(stock._id);
    setValues({
      amount: stock.amount,
      company: stock.company,
      description: stock.description || "",
      date: stock.date ? stock.date.split("T")[0] : "",
    });
    handleModalShow();
  };

  // Handle deletion of a stock
  const handleDelete = async (stockId) => {
  try {
    setLoading(true);
    const { data } = await axios.delete(`${deleteStockAPI}/${stockId}`, {
      data: { userId: cUser._id },  // Send userId in the request body as `data`
    });
    if (data.success) {
      toast.success("Stock deleted successfully", toastOptions);
      setStocks(stocks.filter((stock) => stock._id !== stockId));
    } else {
      toast.error(data.message, toastOptions);
    }
  } catch (error) {
    toast.error("Error deleting stock", toastOptions);
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <Header />
      <Container className="mt-3" style={{ position: 'relative', zIndex: 10 }}>
        <div>
          <h2 style={{ color: 'white' }}>My Stock Portfolio</h2>
          <Button variant="primary" onClick={handleModalShow} className="mb-3">
            Add New Stock
          </Button>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Table responsive="md" className="table table-dark">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Company</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr key={stock._id}>
                    <td>{new Date(stock.date).toLocaleDateString()}</td>
                    <td>{stock.company}</td>
                    <td>{stock.amount}</td>
                    <td>{stock.description}</td>
                    <td>
                      <Button variant="warning" size="sm" onClick={() => handleEdit(stock)}>
                        Edit
                      </Button>{" "}
                      <Button variant="danger" size="sm" onClick={() => handleDelete(stock._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          <Modal show={showModal} onHide={handleModalClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>{editStockId ? "Edit Stock" : "Add New Stock"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formAmount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    placeholder="Enter Amount"
                    value={values.amount}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formCompany">
                  <Form.Label>Company</Form.Label>
                  <Form.Control
                    type="text"
                    name="company"
                    placeholder="Enter Company Name"
                    value={values.company}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    placeholder="Enter Description (optional)"
                    value={values.description}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={values.date}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  {editStockId ? "Update Stock" : "Add Stock"}
                </Button>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <ToastContainer />
      </Container>
    </>
  );
};

export default Stocks;
