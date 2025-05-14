import React, { useEffect, useState } from "react";
import { Button, Container, Form, Modal, Table } from "react-bootstrap";
import moment from "moment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./home.css";
import { updateTransactionAPI, deleteTransactionAPI } from "../../utils/ApiRequest";
import axios from "axios";

const GUEST_KEY = "guestTransactions";

export default function TableData({ data, user, refresh }) {
  const [show, setShow] = useState(false);
  const [values, setValues] = useState({});
  const [currId, setCurrId] = useState(null);

  // open edit modal
  const handleEditClick = (tx) => {
    setCurrId(tx.id || tx._id);
    setValues({
      title: tx.title,
      amount: tx.amount,
      description: tx.description,
      category: tx.category,
      date: tx.date ? tx.date.split("T")[0] : tx.date,
      transactionType: tx.transactionType,
    });
    setShow(true);
  };

  // delete
  const handleDeleteClick = async (tx) => {
    if (user.isGuest) {
      const list = JSON.parse(localStorage.getItem(GUEST_KEY)) || [];
      const updated = list.filter((t) => t.id !== tx.id);
      localStorage.setItem(GUEST_KEY, JSON.stringify(updated));
      window.location.reload();
      return;
    }
    try {
      await axios.post(`${deleteTransactionAPI}/${tx._id}`, { userId: user._id });
      refresh();
    } catch {
      console.error("Delete failed");
    }
  };

  // submit edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (user.isGuest) {
      const list = JSON.parse(localStorage.getItem(GUEST_KEY)) || [];
      const updated = list.map((t) =>
        t.id === currId ? { ...t, ...values, id: currId } : t
      );
      localStorage.setItem(GUEST_KEY, JSON.stringify(updated));
      window.location.reload();
      return;
    }
    try {
      await axios.put(`${updateTransactionAPI}/${currId}`, values);
      refresh();
    } catch {
      console.error("Update failed");
    }
    setShow(false);
  };

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });
  const handleClose = () => setShow(false);

  return (
    <>
      <Container>
        <Table responsive="md" className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {data.map((tx) => (
              <tr key={tx.id || tx._id}>
                <td>{moment(tx.date).format("YYYY-MM-DD")}</td>
                <td>{tx.title}</td>
                <td>{tx.amount}</td>
                <td>{tx.transactionType}</td>
                <td>{tx.category}</td>
                <td>
                  <EditNoteIcon
                    sx={{ cursor: "pointer", marginRight: 8 }}
                    onClick={() => handleEditClick(tx)}
                  />
                  <DeleteForeverIcon
                    sx={{ cursor: "pointer", color: "red" }}
                    onClick={() => handleDeleteClick(tx)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                type="text"
                value={values.title || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formAmount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                name="amount"
                type="number"
                value={values.amount || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                name="category"
                type="text"
                value={values.category || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                type="text"
                value={values.description || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formType">
              <Form.Label>Type</Form.Label>
              <Form.Select
                name="transactionType"
                value={values.transactionType || ""}
                onChange={handleChange}
              >
                <option value="credit">Credit</option>
                <option value="expense">Expense</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                name="date"
                type="date"
                value={values.date || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
