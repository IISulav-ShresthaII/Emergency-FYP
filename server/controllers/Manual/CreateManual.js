import Manual from "../../models/Manual.js";
import User from "../../models/User.js";

const createManual = async (req, res) => {
  try {
    const manualData = req.body;
    console.log(manualData);
    const newManual = new Manual(manualData);
    if (req.file) {
      newManual.img = req.file.path;
    }
    await newManual.save();
    res.status(200).json({ ok: true, msg: "Manual Created" });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      ok: false,
      msg: "An error occured, contact with admin",
    });
  }
};

export default createManual;
