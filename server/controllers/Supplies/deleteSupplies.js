import Supplies from "../../models/Supplies.js";
const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const supplies = await Supplies.findByIdAndDelete({ _id: id });

    return res.status(200).json({ supplies, ok: true, msg: "Supply deleted" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      ok: false,
      msg: "An error occurred, contact with admin",
    });
  }
};

export default deleteItem;
