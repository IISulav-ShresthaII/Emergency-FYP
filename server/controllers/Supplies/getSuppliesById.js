import Supplies from "../../models/Supplies.js";

const getTotalSupplies = async (req, res) => {
  try {
    const totalSupplies = await Supplies.countDocuments();

    if (totalSupplies > 0) {
      return res.json({ total: totalSupplies });
    } else {
      return res.status(204).json({ ok: false, msg: "No Supplies in DB" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      ok: false,
      msg: "An error occurred, contact the admin",
    });
  }
};

export default getTotalSupplies;
