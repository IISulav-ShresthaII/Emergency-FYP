import PhotoCamera from "@mui/icons-material/PhotoCamera.js";
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Container,
  Paper,
  Grid,
  Button,
  Typography,
  Stack,
  TextField,
} from "@mui/material";
import { Formik, Form } from "formik";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase.js";
import * as Yup from "yup";

const Preparedness = () => {
  const [loading, setLoading] = useState(false);

  const usertoken = window.localStorage.getItem("token");
  const getUserId = () => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    return user ? user._id : null;
  };

  const config = { headers: { token: usertoken } };
  const [image, setImage] = useState(null);

  const schema = Yup.object().shape({
    title: Yup.string().required("Supply name is required"),
    description: Yup.string().required("Amount is required"),
  });

  const handleImageUpload = (e) => {
    setImage(e.target.files);
  };

  const handleSubmit = async (values) => {
    try {
      await schema.validate(values, { abortEarly: false });
    } catch (error) {
      const errorMessages = error.inner.map((err) => err.message);
      toast.error(errorMessages.join("\n"), {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    const promises = [];

    if (image && image.length > 0) {
      for (let i = 0; i < image.length; i++) {
        const img = image[i];
        const imageName = `${Date.now()}_${img.name}`;
        const storageRef = ref(storage, `/images/${imageName}`);
        const fileRef = ref(storageRef, imageName);
        const uploadTask = uploadBytesResumable(fileRef, img);
        const promise = new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (error) => {
              console.log(error);
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref)
                .then((imgUrl) => {
                  resolve(imgUrl);
                })
                .catch((error) => {
                  console.log(error);
                  reject(error);
                });
            }
          );
        });
        promises.push(promise);
      }
    }

    Promise.all(promises)
      .then((urls) => {
        const newPreparedness = {
          ...values,
          img: urls,
        };
        axios
          .post(
            "http://localhost:4000/Preparedness/newPreparedness",
            newPreparedness,
            config
          )
          .then(() => {
            toast.success("Supply listed successfully.", {
              position: "bottom-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            window.location.href = "/GetPreparedness";
          })
          .catch((error) => {
            console.log("An error occurred:", error);
            toast.error("Oops 🙁! Something went wrong.", {
              position: "bottom-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          });
      })
      .catch((error) => {
        console.log("An error occurred:", error);
        toast.error("Oops 🙁! Something went wrong.", {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  // Check user role to restrict access
  const userRole = JSON.parse(localStorage.getItem("user"))?.role;
  if (userRole !== "staff") {
    return (
      <Typography variant="h6" color="error">
        Access restricted. Only staff members are allowed to access this page.
      </Typography>
    );
  }

  return (
    <Stack width="100%" pt="60px" alignItems="center">
      <Typography fontSize="30px" color="primary" fontWeight="">
        First Aid Preparedness
      </Typography>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent={{ xs: "center", md: "space-between" }}
        alignItems="center"
        spacing={2}
      >
        <Formik
          initialValues={{
            title: "",
            description: "",
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({ values, handleChange }) => (
            <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
              <Paper
                variant="outlined"
                sx={{ my: { xs: 12, md: 6 }, p: { xs: 12, md: 5 } }}
              >
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6">Picture</Typography>
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
                            multiple
                            type="file"
                            id="image"
                            label="Upload Image"
                            name="image"
                            onChange={handleImageUpload}
                          />
                        </Button>
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        id="name"
                        name="title"
                        label="Title"
                        size="small"
                        fullWidth
                        variant="standard"
                        value={values.title}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Description"
                        id="Description"
                        name="description"
                        multiline={true}
                        size="small"
                        required
                        fullWidth
                        variant="standard"
                        value={values.description}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <motion.div whileTap={{ scale: 1.05 }}>
                        <Stack spacing={2} direction="row">
                          <Button type="submit" variant="contained">
                            Submit
                          </Button>
                        </Stack>
                      </motion.div>
                    </Grid>
                  </Grid>
                </Form>
              </Paper>
            </Container>
          )}
        </Formik>
      </Stack>
    </Stack>
  );
};

export default Preparedness;
