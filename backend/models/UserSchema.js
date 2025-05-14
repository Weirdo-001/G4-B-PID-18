import mongoose from "mongoose";
import validator from "validator";

// User Schema Model - (Name, email, password, creation Date) with validation rules
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique : true,
        validate : validator.isEmail,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
       
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false,
    },

    avatarImage: {
        type: String,
        default: ""
    },

    role: {
        type: String,
        enum: ['user', 'admin', 'investor'],
        default: 'user',
      },

    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
    }],

    stocks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stock',
    }],
    
    createdAt: {
        type:Date,
        default: Date.now,
    },

    

},{ timestamps: true });

const User = mongoose.model("User", userSchema);

export default  User;