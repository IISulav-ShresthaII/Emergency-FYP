import Preparedness from "../../models/Preparedness.js";

const updatePreparedness = async (req, res) => {
  const { id } = req.params;
  const newData = req.body;

  try {
    const preparednessUpdated = await Preparedness.findOneAndUpdate(
      { _id: id },
      newData,
      {
        new: true,
      }
    );

    if (preparednessUpdated) {
      return res
        .status(201)
        .json({ ok: true, msg: "Preparedness Updated!", preparednessUpdated });
    } else {
      return res.status(404).json({
        msg: "Preparedness doesn't exist",
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

export default updatePreparedness;
