import PhotoCamera from "@mui/icons-material/PhotoCamera.js";
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
  CircularProgress,
} from "@mui/material";
import { Formik, Form } from "formik";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase.js";
import * as Yup from "yup";
import report from "../img/report.svg";
import GoogleMapReact from "google-map-react";
import markerIcon from "../img/marker.svg";
import { ThreeDots } from "react-loader-spinner";

const Marker = ({ text }) => (
  <img
    src={markerIcon}
    alt="Marker"
    style={{ width: "40px", height: "40px" }}
  />
);

const LostItem = () => {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setloading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const usertoken = window.localStorage.getItem("token");
  const getUserId = () => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    return user ? user._id : null;
  };
  const config = { headers: { token: usertoken } };
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState([]);

  const schema = Yup.object().shape({
    name: Yup.string().required("Item name is required"),
    description: Yup.string().required("Description is required"),
    type: Yup.string().required("Item type is required"),
    location: Yup.string().required("Location is required"),
    date: Yup.string().required("Date is required"),
    number: Yup.string()
      .required("Phone number is required")
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
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
  const MAX_FILE_SIZE_MB = 5; // Maximum file size in MB

  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];

    // Check if file size exceeds the limit
    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      // File size exceeds the limit, show error message
      toast.error(`File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      // Clear the file input
      e.target.value = null;
      // Reset image preview
      setImagePreview(null);
      return;
    }

    // File size within the limit, set image and image preview
    setImage(selectedFile);
    setImagePreview(URL.createObjectURL(selectedFile)); // Set image preview
    setUploadProgress(Array(1).fill(0)); // Initialize upload progress array
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

    setloading(true);
    const promises = [];

    for (let i = 0; i < image.length; i++) {
      const img = image[i];
      const imageName = `${Date.now()}_${img.name}`; // to ensure unique file names
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
            setloading(false);
            setShow(false);
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
            setloading(false);
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
        setloading(false);
      });
  };

  return (
    <Stack width="100%" pt="60px" alignItems="center">
      <Typography fontSize="30px" color="primary" fontWeight="">
        If you are having an emergency or you are helping post here!
      </Typography>
      <Stack
        width="100%"
        maxWidth="1440px"
        direction={{ xs: "column", md: "row" }}
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Formik
          initialValues={{
            name: "",
            userId: getUserId(),
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
            <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
              <Paper
                variant="outlined"
                sx={{ my: { xs: 2, md: 0 }, p: { xs: 2, md: 5 } }}
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
                            type="file"
                            id="image"
                            label="Upload Image"
                            name="image"
                            onChange={handleImageUpload}
                          />
                        </Button>
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Selected"
                            width="100"
                            height="100"
                          />
                        )}{" "}
                        {/* Display image preview */}
                        {/* Show loader if images are being uploaded */}
                        {loading && (
                          <ThreeDots
                            height="80"
                            width="80"
                            radius="9"
                            color="#4fa94d"
                            ariaLabel="three-dots-loading"
                            visible={true}
                          />
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h6">Emergency Details</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="name"
                        name="name"
                        label="Details"
                        size="small"
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
                        size="small"
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
                        label="Date"
                        size="small"
                        type="date"
                        value={values.date}
                        onChange={handleChange}
                        inputProps={{
                          min: new Date().toISOString().slice(0, 10), // Set min attribute to today's date
                        }}
                        InputLabelProps={{
                          shrink: true, // Disable dd/mm/yyyy placeholder
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        variant="standard"
                        id="number"
                        name="number"
                        label="Phone Number(10 Digits)"
                        size="small"
                        value={values.number}
                        onChange={(e) => {
                          const formattedValue = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                          handleChange({
                            target: {
                              name: "number",
                              value: formattedValue,
                            },
                          });
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl variant="standard" fullWidth sx={{ mt: 1 }}>
                        <InputLabel id="demo-simple-select-standard-label">
                          State
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          name="type"
                          value={values.type}
                          onChange={handleChange}
                        >
                          <MenuItem value="Report">Reporting</MenuItem>
                          <MenuItem value="Help">Rescuing</MenuItem>
                        </Select>
                        <FormHelperText>
                          Please select the type of item
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <motion.div whileTap={{ scale: 1.05 }}>
                        <Stack spacing={2} direction="row">
                          <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                          >
                            {loading ? (
                              <CircularProgress size={24} />
                            ) : (
                              "Create post"
                            )}
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
        <motion.div
          whileHover={{ scale: [null, 1.05, 1.05] }}
          transition={{ duration: 0.4 }}
          sx={{ display: { xs: "none", md: "block" } }}
        >
          <Stack justifyContent="center" alignItems="center" width="100%">
            <img width="100%" src={report} alt="Post photoimage" />
          </Stack>
        </motion.div>
      </Stack>
    </Stack>
  );
};

export default LostItem;
