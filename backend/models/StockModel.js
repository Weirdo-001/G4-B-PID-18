import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
   
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,//mongodb object id
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const Stock = mongoose.model('Stock', stockSchema);
export default Stock;
