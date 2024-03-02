import Manual from "../../models/Manual.js";

const updateManual = async (req, res) => {
  const { id } = req.params;
  const newData = req.body;

  try {
    const manualUpdated = await Manual.findOneAndUpdate({ _id: id }, newData, {
      new: true,
    });

    if (manualUpdated) {
      return res
        .status(201)
        .json({ ok: true, msg: "Manual Updated!", manualUpdated });
    } else {
      return res.status(404).json({
        msg: "Manual doesn't exist",
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

export default updateManual;
