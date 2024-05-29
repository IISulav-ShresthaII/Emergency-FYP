import PhotoCamera from "@mui/icons-material/PhotoCamera.js";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from "react-loader-spinner"; // Import the loader spinner

import {
  Container,
  Paper,
  Grid,
  Button,
  Typography,
  Stack,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Formik, Form } from "formik";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase.js";
import * as Yup from "yup";

// Import local SVG
import CheckCircleIcon from "../img/donate.svg";

const Supplies = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [defaultCenter, setDefaultCenter] = useState({ lat: 0, lng: 0 });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState([]); // State to track upload progress

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDefaultCenter({
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

  const usertoken = window.localStorage.getItem("token");
  const getUserId = () => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    return user ? user._id : null;
  };

  const config = { headers: { token: usertoken } };

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

  const handleMapClick = (event) => {
    setSelectedLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handleSubmit = async (values) => {
    // Validation schema
    const schema = Yup.object().shape({
      name: Yup.string().required("Supply name is required"),
      amount: Yup.string().required("Amount is required"),
      location: Yup.string().required("Location is required"),
      number: Yup.string()
        .required("Phone number is required")
        .min(10, "At least 10 characters")
        .max(10, "t least 10 characters")
        .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    });

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

    if (!selectedLocation) {
      toast.error("Please select a location on the map", {
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
      const imageName = `${Date.now()}_${img.name}`;
      const storageRef = ref(storage, `/images/${imageName}`);
      const fileRef = ref(storageRef, imageName);
      const uploadTask = uploadBytesResumable(fileRef, img);
      const promise = new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Update upload progress
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress((prev) => {
              const newProgress = [...prev];
              newProgress[i] = progress;
              return newProgress;
            });
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
        const newSupplies = {
          ...values,
          img: urls,
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
        };
        axios
          .post(
            "http://localhost:4000/Supplies/newSupplies",
            newSupplies,
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
            setLoading(false);
            window.location.href = "/mySupplies";
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
    <Stack width="100%" pt="60px" alignItems="center">
      <Typography fontSize="30px" color="primary" fontWeight="">
        Make an impact today. Donate here!"
      </Typography>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent={{ xs: "center", md: "space-between" }}
        alignItems="center"
        spacing={2}
      >
        <Formik
          initialValues={{
            name: "",
            userId: getUserId(),
            amount: "",
            location: "",
            number: "",
          }}
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
                      <TextField
                        required
                        id="name"
                        name="name"
                        label="Supply Name"
                        size="small"
                        fullWidth
                        variant="standard"
                        value={values.name}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Amount"
                        id="amount"
                        name="amount"
                        multiline={true}
                        size="small"
                        required
                        fullWidth
                        variant="standard"
                        value={values.amount}
                        onChange={(e) => {
                          const formattedValue = e.target.value.replace(
                            /\D/g,
                            ""
                          ); // Remove non-numeric characters
                          handleChange({
                            target: {
                              name: "amount",
                              value: formattedValue,
                            },
                          });
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h6">Location</Typography>
                      <div style={{ height: "300px", width: "100%" }}>
                        <LoadScript
                          googleMapsApiKey="AIzaSyBwTN8VNLAfwlJ67FNjrVixdvCFZsCHvsI"
                          libraries={["places"]}
                        >
                          <GoogleMap
                            mapContainerStyle={{
                              width: "100%",
                              height: "300px",
                            }}
                            center={defaultCenter}
                            zoom={14}
                            onClick={handleMapClick}
                          >
                            {selectedLocation && (
                              <Marker
                                position={{
                                  lat: selectedLocation.lat,
                                  lng: selectedLocation.lng,
                                }}
                              />
                            )}
                          </GoogleMap>
                        </LoadScript>
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        variant="standard"
                        id="location"
                        name="location"
                        label="Where is it located?"
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
                      <motion.div whileTap={{ scale: 1.05 }}>
                        <Stack spacing={2} direction="row">
                          <Button type="submit" variant="contained">
                            Donate
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
        <motion.img
          src={CheckCircleIcon}
          alt="Check Circle Icon"
          whileTap={{ scale: 0.5 }}
          width={500}
          height={500}
        />
      </Stack>
    </Stack>
  );
};

export default Supplies;
