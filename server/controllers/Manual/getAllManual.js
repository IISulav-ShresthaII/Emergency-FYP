import Manual from "../../models/Manual.js";

const getAllManuals = async (req, res) => {
  try {
    const manuals = await Manual.find();

    if (manuals.length > 0) {
      return res.json({ manuals });
    } else {
      return res.status(204).json({ ok: false, msg: "No manuals in DB" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      ok: false,
      msg: "An error occured, contact with admin",
    });
  }
};

export default getAllManuals;
