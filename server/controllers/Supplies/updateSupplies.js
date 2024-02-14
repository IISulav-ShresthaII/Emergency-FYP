import Supplies from "../../models/Supplies.js";

const updateSupplies = async (req, res) => {
  const { id } = req.params;
  const newData = req.body;

  try {
    const suppliesUpdated = await Supplies.findOneAndUpdate(
      { _id: id },
      newData,
      {
        new: true,
      }
    );

    if (suppliesUpdated) {
      return res
        .status(201)
        .json({ ok: true, msg: "Supplies Updated!", suppliesUpdated });
    } else {
      return res.status(404).json({
        msg: "Supplies doesn't exist",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      ok: false,
      msg: "An error occured, contact an administrator",
    });
  }
};

export default updateSupplies;
