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
} from "@mui/material";
import { Formik, Form } from "formik";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import * as Yup from "yup";
import GoogleMapReact from "google-map-react";

const Supplies = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [clickedLocation, setClickedLocation] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const usertoken = window.localStorage.getItem("token");

  const getUserId = () => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    return user ? user._id : null;
  };

  const config = { headers: { token: usertoken } };

  const schema = Yup.object().shape({
    name: Yup.string().required("Supply name is required"),
    amount: Yup.number().required("Amount is required"),
    type: Yup.string().required("Item type is required"),
    location: Yup.string().required("Location is required"),
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
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          toast.error(
            "Error getting user location. Please check browser settings.",
            { position: "bottom-right" }
          );
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      toast.error("Geolocation is not supported by this browser.", {
        position: "bottom-right",
      });
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const handleMapClick = ({ lat, lng }) => {
    setClickedLocation({ lat, lng });
    setMapCenter({ lat, lng });
  };

  const handleImageUpload = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    setImagePreview(URL.createObjectURL(selectedImage));
  };

  const handleSubmit = async (values) => {
    try {
      await schema.validate(values, { abortEarly: false });
    } catch (error) {
      const errorMessages = error.inner.map((err) => err.message);
      toast.error(errorMessages.join("\n"), { position: "bottom-right" });
      return;
    }

    if (!image) {
      toast.error("Please upload an image", { position: "bottom-right" });
      return;
    }

    if (!clickedLocation) {
      toast.error("Please select a location on the map", {
        position: "bottom-right",
      });
      return;
    }

    const imageName = `${Date.now()}_${image.name}`;
    const storageRef = ref(storage, `/images/${imageName}`);
    const fileRef = ref(storageRef, imageName);
    const uploadTask = uploadBytesResumable(fileRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.error(error);
        toast.error("Failed to upload image", { position: "bottom-right" });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((imgUrl) => {
            const newSupplies = {
              ...values,
              img: imgUrl,
              latitude: clickedLocation.lat,
              longitude: clickedLocation.lng,
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
                });
                window.location.href = "/mySupplies";
              })
              .catch((error) => {
                console.log("An error occurred:", error);
                toast.error("Oops 🙁! Something went wrong.", {
                  position: "bottom-right",
                });
              });
          })
          .catch((error) => {
            console.error(error);
            toast.error("Failed to get image URL", {
              position: "bottom-right",
            });
          });
      }
    );
  };

  return (
    <Stack pt="60px" alignItems="center">
      <Typography fontSize="30px" color="primary" fontWeight="">
        If you are having an emergency or you are helping post here!
      </Typography>
      <Stack
        width="100%"
        maxWidth="1440px"
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Formik
          initialValues={{
            name: "",
            userId: getUserId(),
            amount: "",
            location: "",
            number: "",
            type: "donation", // Set default type as "donation"
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({ values, handleChange }) => (
            <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
              <Paper variant="outlined" sx={{ my: 2, p: 2 }}>
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6">Picture</Typography>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <input
                          accept="image/*"
                          id="contained-button-file"
                          multiple
                          type="file"
                          hidden
                          onChange={handleImageUpload}
                        />
                        <label htmlFor="contained-button-file">
                          <Button
                            variant="contained"
                            component="span"
                            endIcon={<PhotoCamera />}
                          >
                            Upload
                          </Button>
                        </label>
                      </Stack>
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Selected"
                          style={{ marginTop: "10px", maxWidth: "100%" }}
                        />
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        variant="standard"
                        id="name"
                        name="name"
                        label="Supply Name"
                        size="small"
                        value={values.name}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Amount"
                        id="amount"
                        name="amount"
                        multiline
                        rows={4}
                        fullWidth
                        required
                        variant="standard"
                        value={values.amount}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6">Location</Typography>
                      <div style={{ height: "300px", width: "100%" }}>
                        {userLocation && (
                          <GoogleMapReact
                            onClick={handleMapClick}
                            bootstrapURLKeys={{
                              key: "AIzaSyBwTN8VNLAfwlJ67FNjrVixdvCFZsCHvsI",
                              libraries: [
                                "places",
                                "geometry",
                                "drawing",
                                "visualization",
                              ],
                            }}
                            defaultCenter={mapCenter}
                            defaultZoom={18}
                          >
                            {clickedLocation && (
                              <div
                                lat={clickedLocation.lat}
                                lng={clickedLocation.lng}
                                style={{
                                  color: "red",
                                  fontSize: "30px",
                                }}
                              >
                                📍
                              </div>
                            )}
                            {userLocation && !clickedLocation && (
                              <div
                                lat={userLocation.lat}
                                lng={userLocation.lng}
                                style={{
                                  color: "blue",
                                  fontSize: "30px",
                                }}
                              >
                                🚩
                              </div>
                            )}
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
                        label="How can we contact you?"
                        size="small"
                        value={values.number}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <motion.div whileTap={{ scale: 1.05 }}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{ mt: 3, mb: 2 }}
                        >
                          Create Post
                        </Button>
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

export default Supplies;
