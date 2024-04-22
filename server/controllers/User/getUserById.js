import User from "../../models/User.js";

const getTotalUser = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalUserToday = await User.countDocuments({
      createdAt: { $gte: today },
    });

    const totalUser = await User.countDocuments();
    return res.json({
      total: totalUser,
      totalUserToday: totalUserToday,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "An error occurred, contact the admin",
    });
  }
};

export default getTotalUser;
