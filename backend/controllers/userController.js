import User from "../models/UserSchema.js";
import bcrypt from "bcrypt";

// Controller to register a new user
export const registerControllers = async (req, res, next) => {
  try {
    console.log("Register Controller: Request body:", req.body);
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      console.log("Register Controller: Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Please enter all required fields",
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    console.log("Register Controller: User found:", user);
    if (user) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Register Controller: Password hashed");

    // Create the new user; role defaults to 'user' if not provided.
    let newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    console.log("Register Controller: New user created:", newUser);

    // Convert to plain object and delete password before sending response
    const userObj = newUser.toObject();
    delete userObj.password;

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user: userObj,
    });
  } catch (err) {
    console.error("Register Controller: Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Controller to login a user
export const loginControllers = async (req, res, next) => {
  try {
    console.log("Login Controller: Request body:", req.body);
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      console.log("Login Controller: Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Please enter all required fields",
      });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    console.log("Login Controller: User found:", user);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Login Controller: Password match:", isMatch);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    // Remove the password field before sending response
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}`,
      user: userObj,
    });
  } catch (err) {
    console.error("Login Controller: Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Controller to update the user avatar
export const setAvatarController = async (req, res, next) => {
  try {
    console.log("Set Avatar Controller: Params:", req.params);
    console.log("Set Avatar Controller: Request body:", req.body);
    const userId = req.params.id;
    const imageData = req.body.image;

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage: imageData,
      },
      { new: true }
    );
    console.log("Set Avatar Controller: Updated user data:", userData);

    return res.status(200).json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (err) {
    console.error("Set Avatar Controller: Error:", err);
    next(err);
  }
};

// Controller to get all users except the current user
export const allUsers = async (req, res, next) => {
  try {
    console.log("All Users Controller: Params:", req.params);
    const users = await User.find({ _id: { $ne: req.params.id } }).select(
      "name email avatarImage role _id"
    );
    console.log("All Users Controller: Users found:", users);

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    console.error("All Users Controller: Error:", err);
    next(err);
  }
};
