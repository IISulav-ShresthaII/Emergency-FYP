import Manual from "../../models/Manual.js";
const deleteManual = async (req, res) => {
  const { id } = req.params;

  try {
    const manual = await Manual.findByIdAndDelete({ _id: id });

    return res.status(200).json({ manual, ok: true, msg: "Manual deleted" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      ok: false,
      msg: "An error occurred, contact with admin",
    });
  }
};

export default deleteManual;
