import Items from "../../models/Item.js";

const getTotalItems = async (req, res) => {
  try {
    const totalItems = await Items.countDocuments();

    if (totalItems > 0) {
      return res.json({ total: totalItems });
    } else {
      return res.status(204).json({ ok: false, msg: "No items in DB" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      ok: false,
      msg: "An error occurred, contact the admin",
    });
  }
};

export default getTotalItems;
