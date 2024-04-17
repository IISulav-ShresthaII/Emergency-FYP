import Manual from "../../models/Manual.js";

const updateManual = async (req, res) => {
  const { id } = req.params;
  const newData = req.body;

  try {
    const manualUpdated = await Manual.findOneAndUpdate({ _id: id }, newData, {
      new: true,
      runValidators: true,
    });

    if (manualUpdated) {
      return res.status(200).json({
        ok: true,
        msg: "Manual updated successfully!",
        data: manualUpdated,
      });
    } else {
      return res.status(404).json({ msg: "Manual not found" });
    }
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ ok: false, msg: "Validation error", errors: error.errors });
    }
    return res.status(500).json({
      ok: false,
      msg: "An error occurred, please contact the administrator",
    });
  }
};

export default updateManual;
