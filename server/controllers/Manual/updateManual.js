// import Manual from "../../models/Manual.js";

// const updateManual = async (req, res) => {
//   const { id } = req.params;
//   const newData = req.body;

//   // Check if newData is empty
//   if (Object.keys(newData).length === 0) {
//     return res
//       .status(400)
//       .json({ ok: false, msg: "No data provided for update" });
//   }

//   try {
//     const manualUpdated = await Manual.findOneAndUpdate({ _id: id }, newData, {
//       new: true,
//     });

//     if (manualUpdated) {
//       return res
//         .status(200)
//         .json({ ok: true, msg: "Manual Updated!", manualUpdated });
//     } else {
//       return res.status(404).json({
//         ok: false,
//         msg: "Manual not found",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       ok: false,
//       msg: "An error occurred, please contact an administrator",
//     });
//   }
// };

// export default updateManual;
