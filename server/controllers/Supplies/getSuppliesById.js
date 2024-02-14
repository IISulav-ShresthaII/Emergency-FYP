import Supplies from "../../models/Supplies.js";

const getSuppliesById = async (req, res) => {
  const { id } = req.params;
  try {
    const supplies = await Supplies.findOne({
      $and: [{ _id: id }],
    }).populate({
      path: "userId",
      select: "_id nickname fullname img email",
    });

    if (supplies) {
      return res
        .status(200)
        .json({ supplies, ok: true, msg: "Supplies found" });
    } else {
      return res.status(204).json({ ok: false, msg: "Supplies not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      ok: false,
      msg: "An error occured, contact with admin",
    });
  }
};
export default getSuppliesById;
