import User from "../../models/User.js";
import Item from "../../models/Item.js";

const Reportno = async (req, res) => {
  try {
    // Get user ID from request (assuming it's attached by the validateJWT middleware)
    const userId = req.userId;

    // Fetch user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ ok: false, msg: "User not found" });
    }

    // Fetch number of reports made by the user
    const reportCount = await Item.countDocuments({
      userId: userId,
      type: "Report",
    });

    // Return user data and report count
    res.status(200).json({ ok: true, user: user, reportCount: reportCount });
  } catch (error) {
    console.error("Error fetching user data and report count:", error);
    res.status(500).json({ ok: false, msg: "Internal server error" });
  }
};

export default Reportno;
