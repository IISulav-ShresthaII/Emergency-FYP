import Manual from "../../models/Manual.js";

const getTotalManuals = async (req, res) => {
  try {
    const totalManuals = await Manual.countDocuments();

    if (totalManuals > 0) {
      return res.json({ total: totalManuals });
    } else {
      return res.status(204).json({ ok: false, msg: "No manuals in DB" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      ok: false,
      msg: "An error occurred, contact the admin",
    });
  }
};

export default getTotalManuals;
