import User from "../../models/User.js";

const getTotalUser = async (req, res) => {
  try {
    const totalUser = await User.countDocuments();

    if (totalUser > 0) {
      return res.json({ total: totalUser });
    } else {
      return res.status(204).json({ ok: false, msg: "No User in DB" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      ok: false,
      msg: "An error occurred, contact the admin",
    });
  }
};

export default getTotalUser;
