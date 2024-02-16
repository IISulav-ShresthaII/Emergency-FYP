import React, { useState } from "react";
import { Formik, Form } from "formik";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import {
  Typography,
  Button,
  Stack,
  Divider,
  TextField,
  Avatar,
} from "@mui/material";

function Signup() {
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (values) => {
    const { nickname, fullname, email, password } = values;

    const uploadImage = async () => {
      if (image) {
        const storageRef = ref(storage, `/images/${image.name}`);
        const fileRef = ref(storageRef, image.name);
        const uploadTask = uploadBytesResumable(fileRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const uploaded = Math.floor(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(uploaded);
          },
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (imgUrl) => {
              const payload = {
                nickname,
                fullname,
                email,
                password,
                img: imgUrl,
              };
              try {
                const response = await axios.post(
                  "http://localhost:4000/users/create",
                  payload
                );
                if (response.data === "Done") {
                  toast.success("You are now successfully Signed up!", {
                    position: "bottom-right",
                    autoClose: 800,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                  window.location.href = "/log-in";
                } else {
                  toast.error("Something is missing!", {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                }
              } catch (error) {
                console.error("Error occurred:", error);
              }
            });
          }
        );
      } else {
        const payload = { nickname, fullname, email, password };
        try {
          const response = await axios.post(
            "http://localhost:4000/users/create",
            payload
          );
          if (response.data === "Done") {
            toast.success("You are now successfully Signed up!", {
              position: "bottom-right",
              autoClose: 800,
              hideProgressBar: false,
              closeOnClick: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            window.location.href = "/log-in";
          } else {
            toast.error("Something is missing!", {
              position: "bottom-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
        } catch (error) {
          console.error("Error occurred:", error);
        }
      }
    };
    uploadImage();
  };

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      width="100%"
      gap="20px"
      pt="10px"
    >
      <Stack
        direction="row"
        width="100%"
        sx={{ backgroundColor: "primary.main" }}
        height="125px"
        gap="4px"
        alignItems="center"
        justifyContent="center"
      >
        <Stack
          spacing={0}
          position="relative"
          justifyContent="center"
          width="100%"
          maxWidth="1440px"
          height="125px"
          overflow="hidden"
          ml={10}
        >
          <Typography fontSize="20px" color="white" fontWeight="">
            Sign Up
          </Typography>

          <Typography variant="h5" color="white" fontWeight="bold">
            Welcome On Board!
          </Typography>
        </Stack>
      </Stack>

      <Stack
        alignItems="center"
        justifyContent="center"
        mt={3}
        direction={{ xs: "column", md: "row" }}
      >
        <Stack
          width={{ xs: "100%", md: "50%" }}
          display={{ xs: "none", md: "flex" }}
        >
          <img
            width="100%"
            src="https://i.ibb.co/G2k63ys/login-1.png"
            alt="img"
          />
        </Stack>
        <Stack width={{ xs: "100%", md: "400px" }} margin="0 auto">
          <Formik
            initialValues={{
              nickname: "",
              fullname: "",
              email: "",
              password: "",
            }}
            onSubmit={(values) => {
              handleSubmit(values);
            }}
          >
            {({ values, handleChange }) => (
              <Form>
                <Stack
                  alignItems="center"
                  gap="20px"
                  margin={{ xs: "0 1rem", md: "auto" }}
                >
                  <Avatar
                    src={image && URL.createObjectURL(image)}
                    sx={{
                      width: "120px",
                      height: "120px",
                    }}
                  />
                  <Button
                    variant="contained"
                    component="label"
                    endIcon={<PhotoCamera />}
                  >
                    Upload Profile Picture
                    <input
                      hidden
                      accept="image/*"
                      multiple
                      type="file"
                      id="image"
                      label="Upload Image"
                      name="image"
                      onChange={handleImageUpload}
                    />
                  </Button>
                  <TextField
                    sx={{ width: "100%" }}
                    type="text"
                    name="nickname"
                    margin="dense"
                    label="Nickname"
                    size="small"
                    id="nickname"
                    required
                    onChange={handleChange}
                    value={values.nickname}
                  />
                  <TextField
                    sx={{ width: "100%" }}
                    type="text"
                    name="fullname"
                    margin="dense"
                    label="Full Name"
                    size="small"
                    required
                    onChange={handleChange}
                    value={values.fullname}
                  />
                  <TextField
                    sx={{ width: "100%" }}
                    required
                    type="email"
                    name="email"
                    id="email"
                    margin="dense"
                    label="Email"
                    placeholder="email@example.com"
                    size="small"
                    onChange={handleChange}
                    value={values.email}
                  />
                  <TextField
                    sx={{ width: "100%" }}
                    required
                    type="password"
                    name="password"
                    margin="dense"
                    label="Password"
                    id="password"
                    size="small"
                    onChange={handleChange}
                    value={values.password}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{
                      color: "white",
                      textTransform: "none",
                      width: "120px",
                      fontSize: "16px",
                      alignSelf: "end",
                    }}
                    size="small"
                  >
                    Sign Up
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
          <Divider sx={{ width: "100%", margin: "1rem 0" }} />
          <Stack
            justifyContent="center"
            direction="row"
            gap="10px"
            margin="1rem 0"
          >
            <Typography fontSize="16px">Already have an account?</Typography>
            <Typography component={Link} to="/log-in" fontSize="16px">
              Login
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Signup;

// import React, { useState } from "react";
// import { Formik, Form } from "formik";
// import PhotoCamera from "@mui/icons-material/PhotoCamera";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { storage } from "../firebase";
// import {
//   Typography,
//   Button,
//   Stack,
//   Divider,
//   TextField,
//   Avatar,
// } from "@mui/material";

// function Signup() {
//   const [progress, setProgress] = useState(0);
//   const [image, setImage] = useState(null);

//   const handleImageUpload = (e) => {
//     if (e.target.files[0]) {
//       setImage(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async (values) => {
//     const { nickname, fullname, email, password } = values;

//     const uploadImage = async () => {
//       if (image) {
//         const storageRef = ref(storage, `/images/${image.name}`);
//         const fileRef = ref(storageRef, image.name);
//         const uploadTask = uploadBytesResumable(fileRef, image);
//         uploadTask.on(
//           "state_changed",
//           (snapshot) => {
//             const uploaded = Math.floor(
//               (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//             );
//             setProgress(uploaded);
//           },
//           (error) => {
//             console.log(error);
//           },
//           () => {
//             getDownloadURL(uploadTask.snapshot.ref).then(async (imgUrl) => {
//               const payload = {
//                 nickname,
//                 fullname,
//                 email,
//                 password,
//                 img: imgUrl,
//               };
//               try {
//                 const response = await axios.post(
//                   "http://localhost:4000/users/create",
//                   payload
//                 );
//                 if (response.data === "Done") {
//                   toast.success("You are now successfully Signed up!", {
//                     position: "bottom-right",
//                     autoClose: 800,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     draggable: true,
//                     progress: undefined,
//                     theme: "light",
//                   });
//                   window.location.href = "/log-in";
//                 } else {
//                   toast.error("Something is missing!", {
//                     position: "bottom-right",
//                     autoClose: 1000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                     progress: undefined,
//                     theme: "light",
//                   });
//                 }
//               } catch (error) {
//                 console.error("Error occurred:", error);
//               }
//             });
//           }
//         );
//       } else {
//         const payload = { nickname, fullname, email, password };
//         try {
//           const response = await axios.post(
//             "http://localhost:4000/users/create",
//             payload
//           );
//           if (response.data === "Done") {
//             toast.success("You are now successfully Signed up!", {
//               position: "bottom-right",
//               autoClose: 800,
//               hideProgressBar: false,
//               closeOnClick: true,
//               draggable: true,
//               progress: undefined,
//               theme: "light",
//             });
//             window.location.href = "/log-in";
//           } else {
//             toast.error("Something is missing!", {
//               position: "bottom-right",
//               autoClose: 1000,
//               hideProgressBar: false,
//               closeOnClick: true,
//               pauseOnHover: true,
//               draggable: true,
//               progress: undefined,
//               theme: "light",
//             });
//           }
//         } catch (error) {
//           console.error("Error occurred:", error);
//         }
//       }
//     };
//     uploadImage();
//   };

//   return (
//     <Stack
//       justifyContent="center"
//       alignItems="center"
//       width="100%"
//       gap="20px"
//       pt="10px"
//     >
//       <Stack
//         direction="row"
//         width="100%"
//         sx={{ backgroundColor: "primary.main" }}
//         height="125px"
//         gap="4px"
//         alignItems="center"
//         justifyContent="center"
//       >
//         <Stack
//           spacing={0}
//           position="relative"
//           justifyContent="center"
//           width="100%"
//           maxWidth="1440px"
//           height="125px"
//           overflow="hidden"
//           ml={10}
//         >
//           <Typography fontSize="20px" color="white" fontWeight="">
//             Sign Up
//           </Typography>

//           <Typography variant="h5" color="white" fontWeight="bold">
//             Welcome On Board!
//           </Typography>
//         </Stack>
//       </Stack>

//       <Stack
//         alignItems="center"
//         justifyContent="center"
//         mt={3}
//         direction="column"
//       >
//         <Stack width="100%" margin="0 auto">
//           <Formik
//             initialValues={{
//               nickname: "",
//               fullname: "",
//               email: "",
//               password: "",
//             }}
//             onSubmit={(values) => {
//               handleSubmit(values);
//             }}
//           >
//             {({ values, handleChange }) => (
//               <Form>
//                 <Stack
//                   alignItems="center"
//                   gap="20px"
//                   margin={{ xs: "0 1rem", md: "auto" }}
//                 >
//                   <Avatar
//                     src={image && URL.createObjectURL(image)}
//                     sx={{
//                       width: "120px",
//                       height: "120px",
//                     }}
//                   />
//                   <Button
//                     variant="contained"
//                     component="label"
//                     endIcon={<PhotoCamera />}
//                   >
//                     Upload Profile Picture
//                     <input
//                       hidden
//                       accept="image/*"
//                       multiple
//                       type="file"
//                       id="image"
//                       label="Upload Image"
//                       name="image"
//                       onChange={handleImageUpload}
//                     />
//                   </Button>
//                   <TextField
//                     sx={{ width: "100%" }}
//                     type="text"
//                     name="nickname"
//                     margin="dense"
//                     label="Nickname"
//                     size="small"
//                     id="nickname"
//                     required
//                     onChange={handleChange}
//                     value={values.nickname}
//                   />
//                   <TextField
//                     sx={{ width: "100%" }}
//                     type="text"
//                     name="fullname"
//                     margin="dense"
//                     label="Full Name"
//                     size="small"
//                     required
//                     onChange={handleChange}
//                     value={values.fullname}
//                   />
//                   <TextField
//                     sx={{ width: "100%" }}
//                     required
//                     type="email"
//                     name="email"
//                     id="email"
//                     margin="dense"
//                     label="Email"
//                     placeholder="email@example.com"
//                     size="small"
//                     onChange={handleChange}
//                     value={values.email}
//                   />
//                   <TextField
//                     sx={{ width: "100%" }}
//                     required
//                     type="password"
//                     name="password"
//                     margin="dense"
//                     label="Password"
//                     id="password"
//                     size="small"
//                     onChange={handleChange}
//                     value={values.password}
//                   />
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     type="submit"
//                     sx={{
//                       color: "white",
//                       textTransform: "none",
//                       width: "120px",
//                       fontSize: "16px",
//                       alignSelf: "end",
//                     }}
//                     size="small"
//                   >
//                     Sign Up
//                   </Button>
//                 </Stack>
//               </Form>
//             )}
//           </Formik>
//           <Divider sx={{ width: "100%", margin: "1rem 0" }} />
//           <Stack
//             justifyContent="center"
//             direction="row"
//             gap="10px"
//             margin="1rem 0"
//           >
//             <Typography fontSize="16px">Already have an account?</Typography>
//             <Typography component={Link} to="/log-in" fontSize="16px">
//               Login
//             </Typography>
//           </Stack>
//         </Stack>
//       </Stack>
//     </Stack>
//   );
// }

// export default Signup;
