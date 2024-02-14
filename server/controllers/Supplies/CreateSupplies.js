import Supplies from "../../models/Supplies.js";
import User from "../../models/User.js";

const createSupplies = async (req, res) => {
  try {
    const suppliesData = req.body;
    console.log(suppliesData);
    const newSupplies = new Supplies(suppliesData);
    if (req.file) {
      newSupplies.img = req.file.path;
    }
    await newSupplies.save();
    res.status(200).json({ ok: true, msg: "Item Created" });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      ok: false,
      msg: "An error occured, contact with admin",
    });
  }
};

export default createSupplies;
