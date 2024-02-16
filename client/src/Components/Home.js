import React from "react";
import { Stack, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import bgSvg from "../img/earth.svg";
import bgSvg2 from "../img/line.png";

const Home = () => {
  const isLoggedIn = JSON.parse(window.localStorage.getItem("user"));

  const handleButtonClick = (path) => {
    if (isLoggedIn) {
      window.location.href = path;
    } else {
      window.location.href = "/log-in";
    }
  };

  return (
    <Stack
      width="100%"
      gap="10px"
      alignItems="center"
      pt={{ xs: "0px", md: "100px" }}
    >
      <Stack
        width="100%"
        alignItems="center"
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
            px={{ xs: "20px", md: "40px" }}
            textAlign={{ xs: "center", md: "left" }}
          >
            <Typography
              variant="h1"
              fontWeight="bold"
              color="red"
              fontSize={{ xs: "3rem", md: "4rem" }}
            >
              Emergency Nearby?
            </Typography>
            <img src={bgSvg2} alt="Earth" width="80%" />
            <Typography variant="subtitle1" color="#194067" textAlign="center">
              We know how hard it is to decide what to do during an emergency.
              We want to help you find the right solution.
            </Typography>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => handleButtonClick("/postitem")}
                variant="contained"
                color="primary"
                sx={{
                  width: { xs: "80%", md: "auto" },
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "regular",
                  backgroundColor: "red",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "red",
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
        direction={{ xs: "column", md: "row" }}
        width="100%"
        justifyContent="center"
        sx={{ backgroundColor: "#357ABD" }}
        py={{ xs: "30px", md: "40px" }}
      >
        <Stack
          px={{ xs: "20px", md: "40px" }}
          width="100%"
          textAlign={{ xs: "center", md: "left" }}
          gap="30px"
          sx={{
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <Typography color="#FEF0E9" variant="h2">
            About Us
          </Typography>
          <Typography color="#FEF0E9">
            We want to be a platform through which our users can find those
            items that are so important to them. We want users to be able to
            publish their lost item or if they find one, help them find their
            owner!
          </Typography>
        </Stack>
        <Stack
          justifyContent="center"
          alignItems="center"
          width="100%"
          gap={2}
          py={2}
        >
          <motion.div
            whileHover={{ scale: [null, 1.1, 1.1] }}
            transition={{ duration: 0.3 }}
            whileTap={{ scale: 0.8 }}
          >
            <Button
              onClick={() => handleButtonClick("/lostItems")}
              variant="contained"
              color="primary"
              sx={{
                color: "#FEF0E9",
                fontWeight: "700",
                textTransform: "none",
              }}
            >
              <img
                src="https://i.ibb.co/5rKZCdX/Main-Logo-2.png"
                alt="Logo 1"
                style={{ marginRight: "10px" }}
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
              onClick={() => handleButtonClick("/founditems")}
              variant="contained"
              color="primary"
              sx={{
                color: "#FEF0E9",
                fontWeight: "700",
                textTransform: "none",
              }}
            >
              <img
                src="https://i.ibb.co/5rKZCdX/Main-Logo-2.png"
                alt="Logo 2"
                style={{ marginRight: "10px" }}
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
              onClick={() => handleButtonClick("/postitem")}
              variant="contained"
              color="primary"
              sx={{
                color: "#FEF0E9",
                fontWeight: "700",
                textTransform: "none",
              }}
            >
              <img
                src="https://i.ibb.co/5rKZCdX/Main-Logo-2.png"
                alt="Logo 3"
                style={{ marginRight: "10px" }}
              />
              Post an emergency
            </Button>
          </motion.div>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Home;
