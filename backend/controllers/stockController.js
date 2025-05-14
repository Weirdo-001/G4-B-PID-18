import Stock from "../models/StockModel.js";
import User from "../models/UserSchema.js";

export const addStockController = async (req, res) => {
  try {
    const { amount, company, description, date, userId } = req.body;

    if (!amount || !company || !userId) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields (amount, company, userId)",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const newStock = await Stock.create({
      amount,
      company,
      description,
      date,
      user: userId,
    });

    user.stocks.push(newStock._id);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Stock added successfully",
      stock: newStock,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Corrected backend controller
export const getAllStockController = async (req, res) => {
  try {
    const { userId } = req.params; // Fetch userId from URL params, not body

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Fetch the stocks related to the user
    const stocks = await Stock.find({ user: userId });

    return res.status(200).json({
      success: true,
      stocks,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



export const deleteStockController = async (req, res) => {
  try {
    const stockId = req.params.id;
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const stock = await Stock.findByIdAndDelete(stockId);
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }

    // Remove the stock from the user's stocks array
    user.stocks = user.stocks.filter(
      (id) => id.toString() !== stockId.toString()
    );
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Stock successfully deleted",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateStockController = async (req, res) => {
  try {
    const stockId = req.params.id;
    const { amount, company, description, date } = req.body;

    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }

    // Update fields if provided
    if (amount !== undefined) stock.amount = amount;
    if (company !== undefined) stock.company = company;
    if (description !== undefined) stock.description = description;
    if (date !== undefined) stock.date = date;

    await stock.save();

    return res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      stock,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
