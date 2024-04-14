import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

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

const Manual = () => {
  const [userRole, setUserRole] = useState(""); // State to store user role
  const [image, setImage] = useState(null);

  useEffect(() => {
    // Fetch user role from local storage or server when component mounts
    const user = JSON.parse(window.localStorage.getItem("user"));
    if (user) {
      setUserRole(user.role);
    } else {
      // Handle case where user is not logged in or user data is unavailable
    }
  }, []);

  const schema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
  });

  const handleImageUpload = (e) => {
    setImage(e.target.files);
  };

  const handleSubmit = async (values) => {
    // Handle form submission
  };

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
        First Aid Manual
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
                        id="title"
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
                        id="description"
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

export default Manual;
