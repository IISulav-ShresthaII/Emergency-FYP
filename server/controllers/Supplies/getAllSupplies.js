import Supplies from "../../models/Supplies.js";

const getAllSuppliess = async (req, res) => {
  try {
    const suppliess = await Supplies.find();

    if (suppliess.length > 0) {
      return res.json({ suppliess });
    } else {
      return res.status(204).json({ ok: false, msg: "No suppliess in DB" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      ok: false,
      msg: "An error occured, contact with admin",
    });
  }
};

export default getAllSuppliess;
