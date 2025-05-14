// src/Pages/Home/Analytics.js

import React from "react";
import { Container, Row } from "react-bootstrap";
import CircularProgressBar from "../../components/CircularProgressBar";
import LineProgressBar from "../../components/LineProgressBar";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';


const Analytics = ({ transactions }) => {
  const TotalTransactions = transactions.length;

  const incomeTxns = transactions.filter(t => t.transactionType === "credit");
  const expenseTxns = transactions.filter(t => t.transactionType === "expense");

  const incomeCount = incomeTxns.length;
  const expenseCount = expenseTxns.length;

  // percent of txn count
  const incomeCountPct = TotalTransactions
    ? (incomeCount / TotalTransactions) * 100
    : 0;
  const expenseCountPct = TotalTransactions
    ? (expenseCount / TotalTransactions) * 100
    : 0;

  // helper to convert amount to number
  const amt = (t) => Number(t.amount);

  // total turnover
  const totalTurnover = transactions.reduce(
    (sum, t) => sum + amt(t),
    0
  );
  const turnoverIncome = incomeTxns.reduce((sum, t) => sum + amt(t), 0);
  const turnoverExpense = expenseTxns.reduce((sum, t) => sum + amt(t), 0);

  const turnoverIncomePct = totalTurnover
    ? (turnoverIncome / totalTurnover) * 100
    : 0;
  const turnoverExpensePct = totalTurnover
    ? (turnoverExpense / totalTurnover) * 100
    : 0;

  const categories = [
    "Groceries",
    "Rent",
    "Salary",
    "Tip",
    "Food",
    "Medical",
    "Utilities",
    "Entertainment",
    "Transportation",
    "Other",
  ];

  const colors = {
    Groceries: '#FF6384',
    Rent: '#36A2EB',
    Salary: '#FFCE56',
    Tip: '#4BC0C0',
    Food: '#9966FF',
    Medical: '#FF9F40',
    Utilities: '#8AC926',
    Entertainment: '#6A4C93',
    Transportation: '#1982C4',
    Other: '#F45B69',
  };

  return (
    <Container className="mt-5">
      <Row>
        {/* Transaction Counts */}
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-black text-white">
              <strong>Total Transactions:</strong> {TotalTransactions}
            </div>
            <div className="card-body">
              <h5 className="card-title text-success">
                Income: <ArrowDropUpIcon /> {incomeCount}
              </h5>
              <h5 className="card-title text-danger">
                Expense: <ArrowDropDownIcon /> {expenseCount}
              </h5>
              <div className="d-flex justify-content-center mt-3">
                <CircularProgressBar
                  percentage={incomeCountPct.toFixed(0)}
                  color="green"
                />
              </div>
              <div className="d-flex justify-content-center mt-4 mb-2">
                <CircularProgressBar
                  percentage={expenseCountPct.toFixed(0)}
                  color="red"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Turnover */}
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-black text-white">
              <strong>Total Turnover:</strong> {totalTurnover}
            </div>
            <div className="card-body">
              <h5 className="card-title text-success">
                Income: <ArrowDropUpIcon /> {turnoverIncome} <CurrencyRupeeIcon />
              </h5>
              <h5 className="card-title text-danger">
                Expense: <ArrowDropDownIcon /> {turnoverExpense} <CurrencyRupeeIcon />
              </h5>
              <div className="d-flex justify-content-center mt-3">
                <CircularProgressBar
                  percentage={turnoverIncomePct.toFixed(0)}
                  color="green"
                />
              </div>
              <div className="d-flex justify-content-center mt-4 mb-4">
                <CircularProgressBar
                  percentage={turnoverExpensePct.toFixed(0)}
                  color="red"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category-wise Income */}
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-black text-white">
              <strong>Categorywise Income</strong>
            </div>
            <div className="card-body">
              {categories.map((cat, idx) => {
                const catIncome = incomeTxns
                  .filter(t => t.category === cat)
                  .reduce((sum, t) => sum + amt(t), 0);
                const pct = totalTurnover
                  ? (catIncome / totalTurnover) * 100
                  : 0;
                return (
                  catIncome > 0 && (
                    <LineProgressBar
                      key={`inc-${idx}`}
                      label={cat}
                      percentage={pct.toFixed(0)}
                      lineColor={colors[cat]}
                    />
                  )
                );
              })}
            </div>
          </div>
        </div>

        {/* Category-wise Expense */}
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-black text-white">
              <strong>Categorywise Expense</strong>
            </div>
            <div className="card-body">
              {categories.map((cat, idx) => {
                const catExp = expenseTxns
                  .filter(t => t.category === cat)
                  .reduce((sum, t) => sum + amt(t), 0);
                const pct = totalTurnover
                  ? (catExp / totalTurnover) * 100
                  : 0;
                return (
                  catExp > 0 && (
                    <LineProgressBar
                      key={`exp-${idx}`}
                      label={cat}
                      percentage={pct.toFixed(0)}
                      lineColor={colors[cat]}
                    />
                  )
                );
              })}
            </div>
          </div>
        </div>
      </Row>
    </Container>
  );
};

export default Analytics;
