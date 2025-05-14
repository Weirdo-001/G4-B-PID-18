// ModelForm.js
import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { updateTransactionAPI } from "../../utils/ApiRequest";
import axios from "axios";

const ModelForm = ({ transaction, isShow, onClose, onUpdate }) => {
  // Pre-fill the form with the transaction details.
  const [values, setValues] = useState({
    title: transaction.title || "",
    amount: transaction.amount || "",
    description: transaction.description || "",
    category: transaction.category || "",
    date: transaction.date ? transaction.date.split("T")[0] : "",
    transactionType: transaction.transactionType || "",
  });

  // Update local state if transaction prop changes
  useEffect(() => {
    setValues({
      title: transaction.title || "",
      amount: transaction.amount || "",
      description: transaction.description || "",
      category: transaction.category || "",
      date: transaction.date ? transaction.date.split("T")[0] : "",
      transactionType: transaction.transactionType || "",
    });
  }, [transaction]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the update API endpoint using PUT
      const { data } = await axios.put(`${updateTransactionAPI}/${transaction._id}`, values);
      if (data.success) {
        if (onUpdate) {
          onUpdate(data.transaction); // Pass updated transaction back to parent
        }
        onClose();
      } else {
        console.error("Update failed:", data.message);
      }
    } catch (err) {
      console.error("Error updating transaction:", err);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal show={isShow} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Transaction Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              type="text"
              placeholder="Enter title"
              value={values.title}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAmount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              name="amount"
              type="number"
              placeholder="Enter amount"
              value={values.amount}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formSelect">
            <Form.Label>Category</Form.Label>
            <Form.Select name="category" value={values.category} onChange={handleChange}>
              <option value="">Choose...</option>
              <option value="Groceries">Groceries</option>
              <option value="Rent">Rent</option>
              <option value="Salary">Salary</option>
              <option value="Tip">Tip</option>
              <option value="Food">Food</option>
              <option value="Medical">Medical</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Transportation">Transportation</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              placeholder="Enter description"
              value={values.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formSelect1">
            <Form.Label>Transaction Type</Form.Label>
            <Form.Select name="transactionType" value={values.transactionType} onChange={handleChange}>
              <option value="">Choose...</option>
              <option value="credit">Credit</option>
              <option value="expense">Expense</option>
            </Form.Select>
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
            Submit
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModelForm;
