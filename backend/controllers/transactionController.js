import Transaction from "../models/TransactionModel.js";
import User from "../models/UserSchema.js";
import moment from "moment";

export const addTransactionController = async (req, res) => {
  try {
    console.log("addTransactionController called with body:", req.body);

    const {
      title,
      amount,
      description,
      date,
      category,
      userId,
      transactionType,
    } = req.body;

    if (
      !title ||
      !amount ||
      !description ||
      !date ||
      !category ||
      !transactionType
    ) {
      console.log("Validation failed: Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found with ID:", userId);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newTransaction = await Transaction.create({
      title,
      amount,
      category,
      description,
      date,
      user: userId,
      transactionType,
    });

    console.log("New transaction created:", newTransaction);

    if (!user.transactions) {
      user.transactions = [];
    }
    user.transactions.push(newTransaction._id);
    await user.save();

    console.log("User transactions updated:", user.transactions);

    return res.status(200).json({
      success: true,
      message: "Transaction added successfully",
      transaction: newTransaction,
    });
  } catch (err) {
    console.error("Error in addTransactionController:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllTransactionController = async (req, res) => {
  try {
    console.log("getAllTransactionController called with body:", req.body);

    const { userId, type, frequency, startDate, endDate } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found with ID:", userId);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create the query object
    const query = {
      user: userId,
    };

    if (type !== "all") {
      query.transactionType = type;
    }

    // Date filtering based on frequency or custom range
    if (frequency !== "custom") {
      query.date = {
        $gt: moment().subtract(Number(frequency), "days").toDate(),
      };
    } else if (startDate && endDate) {
      query.date = {
        $gte: moment(startDate).toDate(),
        $lte: moment(endDate).toDate(),
      };
    }

    console.log("Query for transactions:", query);

    const transactions = await Transaction.find(query);
    console.log("Transactions fetched:", transactions);

    return res.status(200).json({
      success: true,
      transactions,
    });
  } catch (err) {
    console.error("Error in getAllTransactionController:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteTransactionController = async (req, res) => {
  try {
    console.log("deleteTransactionController called with params:", req.params, "and body:", req.body);

    const transactionId = req.params.id;
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found with ID:", userId);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const transactionElement = await Transaction.findByIdAndDelete(transactionId);
    if (!transactionElement) {
      console.log("Transaction not found with ID:", transactionId);
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    console.log("Transaction deleted:", transactionElement);

    // Remove the transaction from the user's transactions array
    user.transactions = user.transactions.filter(
      (id) => id.toString() !== transactionId.toString()
    );
    await user.save();

    console.log("User transactions updated after deletion:", user.transactions);

    return res.status(200).json({
      success: true,
      message: "Transaction successfully deleted",
    });
  } catch (err) {
    console.error("Error in deleteTransactionController:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateTransactionController = async (req, res) => {
  try {
    console.log("updateTransactionController called with params:", req.params, "and body:", req.body);

    const transactionId = req.params.id;
    const { title, amount, description, date, category, transactionType } = req.body;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      console.log("Transaction not found with ID:", transactionId);
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Update only provided fields
    if (title !== undefined) transaction.title = title;
    if (amount !== undefined) transaction.amount = amount;
    if (description !== undefined) transaction.description = description;
    if (date !== undefined) transaction.date = date;
    if (category !== undefined) transaction.category = category;
    if (transactionType !== undefined) transaction.transactionType = transactionType;

    await transaction.save();

    console.log("Transaction updated:", transaction);

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (err) {
    console.error("Error in updateTransactionController:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
