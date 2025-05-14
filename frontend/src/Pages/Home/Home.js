import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Container } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BarChartIcon from "@mui/icons-material/BarChart";
import Spinner from "../../components/Spinner";
import TableData from "./TableData";
import Analytics from "./Analytics";
import { addTransactionAPI, getTransactionsAPI } from "../../utils/ApiRequest";
import "./home.css";

const GUEST_KEY = "guestTransactions";

export default function Home() {
  const navigate = useNavigate();
  const [cUser, setcUser] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [view, setView] = useState("table");
  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    theme: "dark",
  };

  // Helpers to load/save guest transactions
  const loadGuest = () => {
    try {
      return JSON.parse(localStorage.getItem(GUEST_KEY)) || [];
    } catch {
      return [];
    }
  };
  const saveGuest = (arr) => {
    localStorage.setItem(GUEST_KEY, JSON.stringify(arr));
  };

  // on mount: load user or treat as guest
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setcUser(JSON.parse(stored));
    } else {
      setcUser({ isGuest: true });
      if (!localStorage.getItem(GUEST_KEY)) saveGuest([]);
    }
  }, []);

  // load transactions (API for logged-in, localStorage for guest)
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      if (cUser?.isGuest) {
        setTransactions(loadGuest());
      } else {
        try {
          const { data } = await axios.post(getTransactionsAPI, {
            userId: cUser._id,
            frequency,
            startDate,
            endDate,
            type,
          });
          setTransactions(data.transactions);
        } catch {
          toast.error("Failed to load transactions", toastOptions);
        }
      }
      setLoading(false);
    };
    if (cUser) fetch();
  }, [cUser, frequency, startDate, endDate, type, refresh]);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  // Add new transaction (guest: localStorage, user: API)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, amount, description, category, date, transactionType } = values;
    if (!title || !amount || !description || !category || !date || !transactionType) {
      toast.error("Please enter all the fields", toastOptions);
      return;
    }
    setLoading(true);

    if (cUser.isGuest) {
      const list = loadGuest();
      const newTx = { ...values, id: Date.now() };
      const updated = [newTx, ...list];
      saveGuest(updated);
      setTransactions(updated);
      toast.success("Transaction added", toastOptions);
      setValues({ title: "", amount: "", description: "", category: "", date: "", transactionType: "" });
      setShow(false);
      setLoading(false);
      return;
    }

    // logged-in user:
    try {
      const { data } = await axios.post(addTransactionAPI, {
        ...values,
        userId: cUser._id,
      });
      if (data.success) {
        toast.success(data.message, toastOptions);
        setShow(false);
        setRefresh((p) => !p);
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch {
      toast.error("An error occurred. Please try again.", toastOptions);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setType("all");
    setStartDate(null);
    setEndDate(null);
    setFrequency("7");
  };
  const handleTableClick = () => setView("table");
  const handleChartClick = () => setView("chart");

  const handleStocksClick = () => {
    if (cUser?.isGuest) {
      toast.info("Please login to view stocks", toastOptions);
      return navigate("/login");
    }
    navigate("/stocks");
  };

  const onChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });
  const onFreqChange = (e) => setFrequency(e.target.value);
  const onTypeChange = (e) => setType(e.target.value);

  return (
    <>
      <Header />
      {loading ? (
        <Spinner />
      ) : (
        <Container className="mt-3" style={{ position: "relative", zIndex: 2 }}>
          <div className="filterRow">
            {/* Frequency */}
            <div className="text-white">
              <Form.Group className="mb-3" controlId="formSelectFrequency">
                <Form.Label>Select Frequency</Form.Label>
                <Form.Select name="frequency" value={frequency} onChange={onFreqChange}>
                  <option value="7">Last Week</option>
                  <option value="30">Last Month</option>
                  <option value="365">Last Year</option>
                  <option value="custom">Custom</option>
                </Form.Select>
              </Form.Group>
            </div>
            {/* Type */}
            <div className="text-white type">
              <Form.Group className="mb-3" controlId="formSelectType">
                <Form.Label>Type</Form.Label>
                <Form.Select name="type" value={type} onChange={onTypeChange}>
                  <option value="all">All</option>
                  <option value="expense">Expense</option>
                  <option value="credit">Earned</option>
                </Form.Select>
              </Form.Group>
            </div>
            {/* View toggle */}
            <div className="text-white iconBtnBox">
              <FormatListBulletedIcon
                sx={{ cursor: "pointer" }}
                onClick={handleTableClick}
                className={view === "table" ? "iconActive" : "iconDeactive"}
              />
              <BarChartIcon
                sx={{ cursor: "pointer" }}
                onClick={handleChartClick}
                className={view === "chart" ? "iconActive" : "iconDeactive"}
              />
            </div>
            {/* Actions */}
            <div className="actionButtons">
              <Button onClick={handleShow} className="addNew">
                Add New
              </Button>
              <Button onClick={handleStocksClick} className="ml-2 stocksBtn">
                Go to Stocks
              </Button>
              <Button onClick={handleShow} className="mobileBtn">
                +
              </Button>
              <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Add Transaction</Modal.Title>
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
                        onChange={onChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formAmount">
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        name="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={values.amount}
                        onChange={onChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formSelect">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        name="category"
                        value={values.category}
                        onChange={onChange}
                      >
                        <option value="">Choose...</option>
                        <option>Groceries</option>
                        <option>Rent</option>
                        <option>Salary</option>
                        <option>Tip</option>
                        <option>Food</option>
                        <option>Medical</option>
                        <option>Utilities</option>
                        <option>Entertainment</option>
                        <option>Transportation</option>
                        <option>Other</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formDescription">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        name="description"
                        type="text"
                        placeholder="Enter description"
                        value={values.description}
                        onChange={onChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formSelect1">
                      <Form.Label>Transaction Type</Form.Label>
                      <Form.Select
                        name="transactionType"
                        value={values.transactionType}
                        onChange={onChange}
                      >
                        <option value="">Choose...</option>
                        <option value="credit">Credit</option>
                        <option value="expense">Expense</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formDate">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        name="date"
                        type="date"
                        value={values.date}
                        onChange={onChange}
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={loading}>
                      Submit
                    </Button>
                  </Form>
                </Modal.Body>
              </Modal>
            </div>
          </div>

          {frequency === "custom" && (
            <div className="date">
              <div className="form-group">
                <label className="text-white">Start Date:</label>
                <DatePicker
                  selected={startDate}
                  onChange={setStartDate}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
              <div className="form-group">
                <label className="text-white">End Date:</label>
                <DatePicker
                  selected={endDate}
                  onChange={setEndDate}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                />
              </div>
            </div>
          )}

          <div className="containerBtn">
            <Button variant="primary" onClick={handleReset}>
              Reset Filter
            </Button>
          </div>

          {view === "table" ? (
            <TableData
              data={transactions}
              user={cUser}
              refresh={() => setRefresh((p) => !p)}
            />
          ) : (
            <Analytics transactions={transactions} user={cUser} />
          )}
          <ToastContainer />
        </Container>
      )}
    </>
  );
}
