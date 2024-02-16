//AIzaSyBwTN8VNLAfwlJ67FNjrVixdvCFZsCHvsI
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import React, { useState, useEffect } from "react";
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
  Select,
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
} from "@mui/material";
import { Formik, Form } from "formik";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import * as Yup from "yup";
import GoogleMapReact from "google-map-react";
import markerIcon from "../img/marker.svg";
import report from "../img/report.svg";

const Marker = ({ text }) => (
  <img
    src={markerIcon}
    alt="Marker"
    style={{ width: "40px", height: "40px" }}
  />
);

const LostItem = () => {
  const [progress, setProgress] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const usertoken = window.localStorage.getItem("token");

  const config = { headers: { token: usertoken } };
  const [image, setImage] = useState(null);

  const schema = Yup.object().shape({
    name: Yup.string().required("Item name is required"),
    description: Yup.string().required("Description is required"),
    type: Yup.string().required("Item type is required"),
    location: Yup.string().required("Location is required"),
    date: Yup.string().required("Date is required"),
    number: Yup.string().required("Phone number is required"),
  });

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          toast.error(
            "Error getting user location. Please check browser settings.",
            {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            }
          );
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      toast.error("Geolocation is not supported by this browser.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

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

    if (!image || image.length === 0) {
      toast.error("Please upload at least one image", {
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

    setLoading(true);
    const promises = [];

    for (let i = 0; i < image.length; i++) {
      const img = image[i];
      const imageName = `${Date.now()}_${img.name}`; // Add timestamp to ensure unique file names
      const storageRef = ref(storage, `/images/${imageName}`);
      const fileRef = ref(storageRef, imageName);
      const uploadTask = uploadBytesResumable(fileRef, img);
      const promise = new Promise((resolve, reject) => {
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

    Promise.all(promises)
      .then((urls) => {
        const newItem = {
          ...values,
          img: urls,
          latitude: userLocation.lat,
          longitude: userLocation.lng,
        };
        axios
          .post("http://localhost:4000/Items/newItem", newItem, config)
          .then(() => {
            toast.success("Wohoo 🤩! Item listed successfully.", {
              position: "bottom-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setLoading(false);
            window.location.href = "/mylistings";
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
            setLoading(false);
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
        setLoading(false);
      });
  };

  return (
    <Stack width="100%" pt={{ xs: 4, md: 8 }} alignItems="center">
      <Typography
        fontSize={{ xs: "22px", md: "30px" }}
        color="primary"
        fontWeight=""
      >
        If you are having an emergency or you are helping post here!
      </Typography>
      <Stack
        width="100%"
        maxWidth="1440px"
        direction={{ xs: "column-reverse", md: "row" }}
        justifyContent={{ xs: "center", md: "space-evenly" }}
        alignItems="center"
        spacing={4}
        mt={4}
      >
        <Formik
          initialValues={{
            name: "",
            description: "",
            type: "",
            location: "",
            date: "",
            number: "",
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({ values, handleChange }) => (
            <Container component="main" maxWidth="sm">
              <Paper variant="outlined" sx={{ p: 4 }}>
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
                            name="image"
                            onChange={handleImageUpload}
                          />
                        </Button>
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6">Emergency Details</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        id="name"
                        name="name"
                        label="Details"
                        fullWidth
                        variant="standard"
                        value={values.name}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Description"
                        id="date"
                        name="description"
                        multiline
                        rows={4}
                        required
                        fullWidth
                        variant="standard"
                        value={values.description}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6">Location</Typography>
                      <div style={{ height: "300px", width: "100%" }}>
                        {userLocation && (
                          <GoogleMapReact
                            bootstrapURLKeys={{
                              key: "AIzaSyBwTN8VNLAfwlJ67FNjrVixdvCFZsCHvsI",
                              libraries: "places",
                            }}
                            defaultCenter={userLocation}
                            defaultZoom={18}
                          >
                            <Marker
                              lat={userLocation.lat}
                              lng={userLocation.lng}
                            />
                          </GoogleMapReact>
                        )}
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        variant="standard"
                        id="location"
                        name="location"
                        label="Where did it happen?"
                        value={values.location}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        variant="standard"
                        id="date"
                        name="date"
                        label=" "
                        type="date"
                        value={values.date}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        variant="standard"
                        id="number"
                        name="number"
                        label="How can we contact you?"
                        value={values.number}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl variant="standard" fullWidth>
                        <InputLabel id="type-label">State</InputLabel>
                        <Select
                          labelId="type-label"
                          id="type"
                          name="type"
                          value={values.type}
                          onChange={handleChange}
                        >
                          <MenuItem value="Report">Reporting</MenuItem>
                          <MenuItem value="Help">Helping</MenuItem>
                        </Select>
                        <FormHelperText>
                          Please select the type of item
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Button type="submit" variant="contained" fullWidth>
                        {loading ? "Creating..." : "Create post"}
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              </Paper>
            </Container>
          )}
        </Formik>
        <motion.div
          whileHover={{ scale: [null, 1.05, 1.05] }}
          transition={{ duration: 0.4 }}
        >
          <Stack
            justifyContent="center"
            alignItems="center"
            width="100%"
            maxWidth="450px"
          >
            <img width="100%" src={report} alt="Post Image" />
          </Stack>
        </motion.div>
      </Stack>
    </Stack>
  );
};

export default LostItem;
