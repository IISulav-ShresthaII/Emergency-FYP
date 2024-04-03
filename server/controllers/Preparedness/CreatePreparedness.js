import Preparedness from "../../models/Preparedness.js";
import User from "../../models/User.js";

const createPreparedness = async (req, res) => {
  try {
    const preparednessData = req.body;
    console.log(preparednessData);
    const newPreparedness = new Preparedness(preparednessData);
    if (req.file) {
      newPreparedness.img = req.file.path;
    }
    await newPreparedness.save();
    res.status(200).json({ ok: true, msg: "Preparedness Created" });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      ok: false,
      msg: "An error occured, contact with admin",
    });
  }
};

export default createPreparedness;
