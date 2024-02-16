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
import { storage } from "../firebase.js";
import * as Yup from "yup";
import GoogleMapReact from "google-map-react";

const Supplies = () => {
  const [progress, setProgress] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [clickedLocation, setClickedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const usertoken = window.localStorage.getItem("token");

  const getUserId = () => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    return user ? user._id : null;
  };

  const config = { headers: { token: usertoken } };
  const [image, setImage] = useState(null);

  const schema = Yup.object().shape({
    name: Yup.string().required("Supply name is required"),
    description: Yup.string().required("Description is required"),
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
  };

  const handleImageUpload = (e) => {
    setImage(e.target.files);
  };

  const handleSubmit = async (values) => {
    try {
      await schema.validate(values, { abortEarly: false });
    } catch (error) {
      const errorMessages = error.inner.map((err) => err.message);
      toast.error(errorMessages.join("\n"), { position: "bottom-right" });
      return;
    }

    if (!image || image.length === 0) {
      toast.error("Please upload at least one image", {
        position: "bottom-right",
      });
      return;
    }

    if (!clickedLocation) {
      toast.error("Please select a location on the map", {
        position: "bottom-right",
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
        const newSupplies = {
          ...values,
          img: urls,
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
            setLoading(false);
            window.location.href = "/mySupplies";
          })
          .catch((error) => {
            console.log("An error occurred:", error);
            toast.error("Oops 🙁! Something went wrong.", {
              position: "bottom-right",
            });
            setLoading(false);
          });
      })
      .catch((error) => {
        console.log("An error occurred:", error);
        toast.error("Oops 🙁! Something went wrong.", {
          position: "bottom-right",
        });
        setLoading(false);
      });
  };

  return (
    <Stack width="100%" pt={{ xs: "20px", md: "60px" }} alignItems="center">
      <Typography
        variant="h4"
        color="primary"
        fontWeight="bold"
        textAlign="center"
      >
        If you are having an emergency or you are helping, post here!
      </Typography>
      <Stack
        width="100%"
        maxWidth="1440px"
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={4}
        px={{ xs: 2, sm: 4 }}
      >
        <Formik
          initialValues={{
            name: "",
            userId: getUserId(),
            description: "",
            location: "",
            number: "",
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({ values, handleChange }) => (
            <Container component="main" maxWidth="md">
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6">Picture</Typography>
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
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="name"
                        name="name"
                        label="Supply Name"
                        fullWidth
                        variant="outlined"
                        value={values.name}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Description"
                        id="description"
                        name="description"
                        multiline
                        required
                        fullWidth
                        variant="outlined"
                        value={values.description}
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
                            defaultCenter={userLocation}
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
                        variant="outlined"
                        id="location"
                        name="location"
                        label="Where is it located?"
                        value={values.location}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        variant="outlined"
                        id="number"
                        name="number"
                        label="How can we contact you?"
                        value={values.number}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <motion.div whileTap={{ scale: 1.05 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          disabled={loading}
                        >
                          {loading ? "Creating post..." : "Create post"}
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
