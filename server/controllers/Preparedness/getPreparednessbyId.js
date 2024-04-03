import Manual from "../../models/Manual.js";

const getManualById = async (req, res) => {
  const { id } = req.params;
  try {
    const manual = await Manual.findOne({
      $and: [{ _id: id }],
    }).populate({
      path: "userId",
      select: "_id nickname fullname img email",
    });

    if (manual) {
      return res.status(200).json({ manual, ok: true, msg: "Manual found" });
    } else {
      return res.status(204).json({ ok: false, msg: "Manual not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      ok: false,
      msg: "An error occured, contact with admin",
    });
  }
};
export default getManualById;
