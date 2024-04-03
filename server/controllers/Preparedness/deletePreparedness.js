import Preparedness from "../../models/Preparedness.js";
const deletePreparedness = async (req, res) => {
  const { id } = req.params;

  try {
    const preparedness = await Preparedness.findByIdAndDelete({ _id: id });

    return res
      .status(200)
      .json({ preparedness, ok: true, msg: "Preparedness deleted" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      ok: false,
      msg: "An error occurred, contact with admin",
    });
  }
};

export default deletePreparedness;
