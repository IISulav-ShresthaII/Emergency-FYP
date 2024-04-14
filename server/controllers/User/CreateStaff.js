import User from "../../models/User.js";
export const createStaff = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({
      username,
      email,
      password,
      role: "staff", // Set the role to 'staff'
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error creating staff:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
