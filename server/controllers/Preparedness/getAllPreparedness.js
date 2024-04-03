import Preparedness from "../../models/Preparedness.js";

const getAllPreparednesss = async (req, res) => {
  try {
    const preparednesss = await Preparedness.find();

    if (preparednesss.length > 0) {
      return res.json({ preparednesss });
    } else {
      return res
        .status(204)
        .json({ ok: false, msg: "No Preparedness data in DB" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      ok: false,
      msg: "An error occured, contact with admin",
    });
  }
};

export default getAllPreparednesss;
