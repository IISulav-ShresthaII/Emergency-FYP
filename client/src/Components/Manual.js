// import React, { useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import {
//   Container,
//   Paper,
//   Grid,
//   Button,
//   Typography,
//   Stack,
//   TextField,
// } from "@mui/material";
// import { Formik, Form } from "formik";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { storage } from "../firebase.js";
// import * as Yup from "yup";
// import report from "../img/report.svg";
// import PhotoCamera from "@mui/icons-material/PhotoCamera.js";

// const Manual = () => {
//   const [loading, setLoading] = useState(false);
//   const [images, setImages] = useState([]);

//   const schema = Yup.object().shape({
//     name: Yup.string().required("Manual name is required"),
//     description: Yup.string().required("Description is required"),
//   });

//   const handleImageUpload = (e) => {
//     setImages([...images, ...e.target.files]);
//   };

//   const handleSubmit = async (values) => {
//     // Your submit logic here
//   };

//   return (
//     <Stack width="100%" pt="60px" alignItems="center">
//       <Typography fontSize="30px" color="primary" fontWeight="">
//         If you are having an emergency or you are helping post here!
//       </Typography>
//       <Stack
//         width="100%"
//         maxWidth="1440px"
//         direction="row"
//         justifyContent={{ xs: "center", md: "space-evenly" }}
//         alignItems="center"
//       >
//         <Formik
//           initialValues={{
//             name: "",
//             description: "",
//           }}
//           validationSchema={schema}
//           onSubmit={(values) => {
//             handleSubmit(values);
//           }}
//         >
//           {({ values, handleChange }) => (
//             <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
//               <Paper
//                 variant="outlined"
//                 sx={{ my: { xs: 12, md: 6 }, p: { xs: 12, md: 5 } }}
//               >
//                 <Form>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12}>
//                       <TextField
//                         required
//                         fullWidth
//                         variant="standard"
//                         id="name"
//                         name="name"
//                         label="Name"
//                         size="small"
//                         value={values.name}
//                         onChange={handleChange}
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <TextField
//                         required
//                         fullWidth
//                         variant="standard"
//                         id="description"
//                         name="description"
//                         label="Description"
//                         size="small"
//                         multiline
//                         rows={4}
//                         value={values.description}
//                         onChange={handleChange}
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <Button
//                         variant="contained"
//                         component="label"
//                         endIcon={<PhotoCamera />}
//                       >
//                         Upload Image
//                         <input
//                           hidden
//                           accept="image/*"
//                           multiple
//                           type="file"
//                           id="image"
//                           label="Upload Image"
//                           name="image"
//                           onChange={handleImageUpload}
//                         />
//                       </Button>
//                     </Grid>
//                     <Grid item xs={12}>
//                       <Button
//                         type="submit"
//                         variant="contained"
//                         disabled={loading}
//                       >
//                         {loading ? "Creating..." : "Create post"}
//                       </Button>
//                     </Grid>
//                   </Grid>
//                 </Form>
//               </Paper>
//             </Container>
//           )}
//         </Formik>
//         <motion.div
//           whileHover={{ scale: [null, 1.05, 1.05] }}
//           transition={{ duration: 0.4 }}
//         >
//           <Stack
//             justifyContent="center"
//             alignItems="center"
//             width="100%"
//             maxWidth="450px"
//             sx={{ display: { xs: "none", md: "flex" } }}
//           >
//             <img width="100%" src={report} alt="Post Image" />
//           </Stack>
//         </motion.div>
//       </Stack>
//     </Stack>
//   );
// };

// export default Manual;
