import React, { useState } from "react";
import { Field, Formik, Form } from "formik";
import PhotoCamera from "@mui/icons-material/PhotoCamera.js";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase.js";
import {
  Typography,
  Button,
  Stack,
  Divider,
  TextField,
  Avatar,
} from "@mui/material";
import * as Yup from "yup";

const SignupSchema = Yup.object().shape({
  nickname: Yup.string()
    .min(2, "Nickname is too short!")
    .max(50, "Nickname is too long!")
    .required("Nickname is required"),
  fullname: Yup.string()
    .min(2, "Full name is too short!")
    .max(100, "Full name is too long!")
    .required("Full name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
});

function Signup() {
  const [info, setInfo] = useState("");
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5242880) {
        // 5 MB in bytes
        toast.error("File size exceeds 5 MB. Please select a smaller file.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        setImage(file);
      }
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
              await axios
                .post("http://localhost:4000/users/create", payload)
                .then((response) => {
                  setInfo(response.data);
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
                    toast.error("Email already exists!", {
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
                })
                .catch(() => {
                  console.log("Error occurred");
                });
            });
          }
        );
      } else {
        // No image was selected
        const payload = { nickname, fullname, email, password };
        await axios
          .post("http://localhost:4000/users/create", payload)
          .then((response) => {
            setInfo(response.data);
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
              toast.error("Email already exists!", {
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
          })
          .catch(() => {
            console.log("Error occurred");
          });
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
          <Typography fontSize="20px" color="white">
            Sign Up
          </Typography>

          <Typography variant="h5" color="white" fontWeight="bold">
            Welcome On Board!
          </Typography>
        </Stack>
      </Stack>

      <Stack
        alignItems="center"
        justifyContent="space-between"
        mt={3}
        direction="row"
      >
        <Stack width="50%" display={{ xs: "none", md: "flex" }}>
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
            validationSchema={SignupSchema}
            onSubmit={(values) => {
              handleSubmit(values);
            }}
          >
            {({ values, handleChange, errors, touched }) => (
              <Form>
                <Stack
                  alignItems="start"
                  gap="10px"
                  margin={{ xs: "0 1rem", md: "auto" }}
                >
                  <Typography fontSize="20px" variant="h5">
                    <b>Sign Up</b>
                  </Typography>
                  <Typography fontSize="14px" color="primary.main">
                    Please, fill your information below
                  </Typography>

                  <Stack justifyContent="flex-start" width="100%">
                    <Stack alignItems="center" width="100%" gap={2}>
                      <Avatar
                        src={image && URL.createObjectURL(image)}
                        sx={{
                          width: "6rem",
                          height: "6rem",
                        }}
                      />
                    </Stack>

                    <Stack
                      px="5px"
                      sx={{
                        width: {
                          xs: "auto",
                          md: "50%",
                        },
                      }}
                    >
                      <Typography fontSize="12px" mt="5px">
                        Choose your profile picture
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Button
                        variant="contained"
                        component="label"
                        endIcon={<PhotoCamera />}
                      >
                        Upload
                        <input
                          hidden
                          accept="image/*"
                          type="file"
                          id="image"
                          label="Upload Image"
                          name="image"
                          onChange={handleImageUpload}
                        />
                      </Button>
                    </Stack>

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
                      error={touched.nickname && !!errors.nickname}
                      helperText={touched.nickname && errors.nickname}
                    />
                  </Stack>
                  <Stack justifyContent="flex-start" width="100%">
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
                      error={touched.fullname && !!errors.fullname}
                      helperText={touched.fullname && errors.fullname}
                    />
                  </Stack>
                  <Stack justifyContent="flex-start" width="100%">
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
                      error={touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                    />
                  </Stack>
                  <Stack justifyContent="flex-start" width="100%">
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
                      error={touched.password && !!errors.password}
                      helperText={touched.password && errors.password}
                    />
                  </Stack>

                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{
                      color: "white",
                      textTransform: "none",
                      width: "100px",
                      fontSize: "16px",
                      alignSelf: "end",
                      margin: "1rem",
                      mr: "0",
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
