import User from "../../models/User.js";
import bcrypt from "bcryptjs";

export const createStaff = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use." });
    }

    // Encrypt password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "staff", // Set the role to 'staff'
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      role: savedUser.role,
    });
  } catch (error) {
    console.error("Error creating staff:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
