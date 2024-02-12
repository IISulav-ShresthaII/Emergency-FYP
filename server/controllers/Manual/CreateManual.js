// import Manual from "../../models/Manual.js";
// import User from "../../models/User.js";

// const createManual = async (req, res) => {
//   try {
//     const manualData = req.body;
//     const newManual = new Manual(manualData);

//     // Assuming you're using multer or similar middleware for file uploads
//     if (req.file) {
//       newManual.img = req.file.path;
//     }

//     await newManual.save();
//     res.status(200).json({ ok: true, msg: "Manual Created" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       ok: false,
//       msg: "An error occurred, please contact the administrator.",
//     });
//   }
// };

// export default createManual;
