import Preparedness from "../../models/Preparedness.js";

const getTotalPreparedness = async (req, res) => {
  try {
    const totalPreparedness = await Preparedness.countDocuments();

    if (totalPreparedness > 0) {
      return res.json({ total: totalPreparedness });
    } else {
      return res.status(204).json({ ok: false, msg: "No Preparedness in DB" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      ok: false,
      msg: "An error occurred, contact the admin",
    });
  }
};

export default getTotalPreparedness;
