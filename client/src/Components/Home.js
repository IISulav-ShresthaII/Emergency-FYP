import React from "react";
import { Stack, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import bgSvg from "../img/earth.svg";
import bgSvg2 from "../img/line.png";
const Home = () => {
  const isLoggedIn = JSON.parse(window.localStorage.getItem("user"));
  const handleButtonClick = () => {
    if (isLoggedIn) {
      // If the user is logged in, go to /feed
      window.location.href = "/postitem";
    } else {
      // If the user is not logged in, go to /log-in
      window.location.href = "/log-in";
    }
  };
  const handleButtonClickLost = () => {
    if (isLoggedIn) {
      // If the user is logged in, go to /feed
      window.location.href = "/lostItems";
    } else {
      // If the user is not logged in, go to /log-in
      window.location.href = "/log-in";
    }
  };
  const handleButtonClickFound = () => {
    if (isLoggedIn) {
      // If the user is logged in, go to /feed
      window.location.href = "/founditems";
    } else {
      // If the user is not logged in, go to /log-in
      window.location.href = "/log-in";
    }
  };
  // const handleButtonClickManual = () => {
  //   if (isLoggedIn) {
  //     // If the user is logged in, go to /feed
  //     window.location.href = "/Manual";
  //   } else {
  //     // If the user is not logged in, go to /log-in
  //     window.location.href = "/log-in";
  //   }
  // };
  return (
    <Stack width="100%" gap="100px" alignItems="center" pt="100px">
      <Stack
        width="100%"
        alignItems="center"
        position="relative"
        justifyContent="flex-end"
        height={{ xs: "auto", md: "400px" }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="flex-end"
          gap={10}
          maxWidth="1440px"
          py="20px"
        >
          <Stack
            width="100%"
            gap={3}
            px={{ xs: "40px", md: "0" }}
            pl={{ md: "40px" }}
          >
            <Typography
              variant="h1"
              fontWeight="bold"
              color="red"
              fontSize="4rem"
            >
              Emergency Nearby?
            </Typography>
            <img src={bgSvg2} alt="Earth" width="60%" />

            <Typography variant="subtitle1" color="#194067">
              We know how hard it is to decide what to do during an
              emergency.emergency.
              <br />
              We want to help you find the right solution.
            </Typography>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleButtonClick}
                variant="contained"
                color="primary"
                sx={{
                  alignSelf: { xs: "center", md: "auto" },
                  width: { xs: "200px", md: "auto" },
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "regular",
                  backgroundColor: "red", // Default background color
                  "&:hover": {
                    backgroundColor: "white", // Background color on hover
                    color: "red", // Text color on hover
                  },
                }}
              >
                Report
              </Button>
            </motion.div>
          </Stack>
          <Stack width="100%" display={{ xs: "none", md: "flex" }}>
            <img src={bgSvg} alt="Line" width="80%" />
          </Stack>
        </Stack>
      </Stack>

      <Stack
        direction="row"
        width="100%"
        justifyContent="center"
        sx={{ backgroundColor: "#357ABD" }}
        height={{ xs: "auto", md: "400px" }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          height="100%"
          width="100%"
          maxWidth="1440px"
          justifyContent="space-between"
          gap="30px"
        >
          <Stack
            pl="40px"
            py={{ xs: "20px", md: "0px" }}
            width={{ sx: "100%", md: "55%" }}
            sx={{
              alignSelf: "center",
              justifySelf: "end",
              maxWidth: "600px",
              gap: "30px",
            }}
          >
            <Typography color="#FEF0E9" variant="h2">
              About Us
            </Typography>
            <Typography color="#FEF0E9">
              We want to be a platform trough which our users can find those
              items that are so important to them.
              <br />
              We want users to be able to publish their lost item or if they
              find one, help them find their owner!
            </Typography>
            <Stack
              sx={{
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <motion.div
                whileHover={{ scale: [null, 1.1, 1.1] }}
                transition={{ duration: 0.3 }}
                whileTap={{ scale: 0.8 }}
              >
                <Button
                  onClick={handleButtonClickLost}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    color: "#FEF0E9",
                    fontWeight: "700",
                    textTransform: "none",
                  }}
                >
                  <img
                    src="https://i.ibb.co/5rKZCdX/Main-Logo-2.png"
                    alt="Logo 1"
                  />
                  Reported Emergencies
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: [null, 1.1, 1.1] }}
                transition={{ duration: 0.3 }}
                whileTap={{ scale: 0.8 }}
              >
                <Button
                  onClick={handleButtonClickFound}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    color: "#FEF0E9",
                    fontWeight: "700",
                    textTransform: "none",
                  }}
                >
                  <img
                    src="https://i.ibb.co/5rKZCdX/Main-Logo-2.png"
                    alt="Logo 2"
                  />
                  Help-On-The-Way
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: [null, 1.1, 1.1] }}
                transition={{ duration: 0.3 }}
                whileTap={{ scale: 0.8 }}
              >
                <Button
                  onClick={handleButtonClick}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    color: "#FEF0E9",
                    fontWeight: "700",
                    textTransform: "none",
                  }}
                >
                  <img
                    src="https://i.ibb.co/5rKZCdX/Main-Logo-2.png"
                    alt="Logo 3"
                  />
                  Post an emergency
                </Button>
              </motion.div>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Home;
