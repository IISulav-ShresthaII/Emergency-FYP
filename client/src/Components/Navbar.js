import React, { useState, useEffect } from "react";
import { BsFillCaretDownFill } from "react-icons/bs";
import { Button, Menu, MenuItem, Stack, Drawer } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import bgSvg from "../img/favicon.png";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function Navbar() {
  const token = window.localStorage.getItem("token");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    localStorage.setItem("lastPrompt", new Date().toISOString());
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  useEffect(() => {
    const lastPrompt = localStorage.getItem("lastPrompt");
    const now = new Date();
    const last = new Date(lastPrompt || 0); // Fallback to epoch if not found
    const hoursSinceLastPrompt = Math.abs(now - last) / 36e5; // Convert diff to hours

    if (hoursSinceLastPrompt >= 24 || !lastPrompt) {
      setOpenDialog(true);
      localStorage.setItem("lastPrompt", now.toISOString()); // Save the current time
    }
  }, []);
  const buttonStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "none",
    color: "black",
    "&:hover": {
      color: "primary.main",
      backgroundColor: "transparent",
      transition: "none",
    },
    "&:focus": {
      color: "primary.main",
      backgroundColor: "transparent",
    },
  };

  const signout = () => {
    localStorage.clear();
    window.location.href = "/log-in";
  };

  return (
    <>
      {/* Desktop Navbar */}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Emergency Preparedness"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you prepared for emergencies? It's important to have a plan.
            Check our resources to ensure you're ready.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            component={Link}
            to="/GetPreparedness"
            onClick={handleCloseDialog}
            color="primary"
          >
            No, Show Me
          </Button>
          <Button
            component={Link}
            to="/"
            onClick={handleCloseDialog}
            color="primary"
            autoFocus
          >
            Yes, I am
          </Button>
        </DialogActions>
      </Dialog>
      <Stack
        width="100%"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="0 0 20px 20px"
        px={{ xs: 2, sm: 3, md: 5 }}
        py={2}
        zIndex={20}
        sx={{ backgroundColor: "#F6F8F8" }}
        mb="10px"
        display={{ xs: "none", sm: "flex" }}
      >
        <Link to="/">
          <Stack maxWidth="180px">
            <img src={bgSvg} alt="logo" width="90%" />
          </Stack>
        </Link>

        <Stack direction="row" gap={1}>
          {token ? (
            <>
              <motion.div
                whileHover={{ scale: [null, 1.05, 1.05] }}
                transition={{ duration: 0.4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button component={Link} to="/" sx={buttonStyle} disableRipple>
                  Home
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: [null, 1.05, 1.05] }}
                transition={{ duration: 0.4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  component={Link}
                  to="/postitem"
                  sx={buttonStyle}
                  disableRipple
                >
                  Report
                </Button>
              </motion.div>
              <Stack>
                <motion.div
                  whileHover={{ scale: [null, 1.05, 1.05] }}
                  transition={{ duration: 0.4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    id="basic-button"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    sx={buttonStyle}
                    endIcon={<BsFillCaretDownFill size="15px" />}
                    disableRipple
                  >
                    Reports/Rescue
                  </Button>
                </motion.div>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem
                    component={Link}
                    to="/lostItems"
                    onClick={handleClose}
                  >
                    Reports
                  </MenuItem>

                  <MenuItem
                    component={Link}
                    to="/foundItems"
                    onClick={handleClose}
                  >
                    Rescue
                  </MenuItem>
                </Menu>
              </Stack>

              <motion.div
                whileHover={{ scale: [null, 1.05, 1.05] }}
                transition={{ duration: 0.4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  component={Link}
                  to="/mylistings"
                  sx={buttonStyle}
                  disableRipple
                >
                  My Reports
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: [null, 1.05, 1.05] }}
                transition={{ duration: 0.4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  component={Link}
                  to="/supplies"
                  sx={buttonStyle}
                  disableRipple
                >
                  Donate
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: [null, 1.05, 1.05] }}
                transition={{ duration: 0.4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  component={Link}
                  to="/mySupplies"
                  sx={buttonStyle}
                  disableRipple
                >
                  View Donations
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: [null, 1.05, 1.05] }}
                transition={{ duration: 0.4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  component={Link}
                  to="/manual"
                  sx={buttonStyle}
                  disableRipple
                >
                  Post Manual
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: [null, 1.05, 1.05] }}
                transition={{ duration: 0.4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  component={Link}
                  to="/viewmanual"
                  sx={buttonStyle}
                  disableRipple
                >
                  Manuals
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: [null, 1.05, 1.05] }}
                transition={{ duration: 0.4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  component={Link}
                  to="/nearbyhospitals"
                  sx={buttonStyle}
                  disableRipple
                >
                  Nearby Hospitals
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: [null, 1.05, 1.05] }}
                transition={{ duration: 0.4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  component={Link}
                  to="/nearbystations"
                  sx={buttonStyle}
                  disableRipple
                >
                  Nearby Stations
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: [null, 1.05, 1.05] }}
                transition={{ duration: 0.4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  component={Link}
                  to="/Preparedness"
                  sx={buttonStyle}
                  disableRipple
                >
                  Preparedness
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: [null, 1.05, 1.05] }}
                transition={{ duration: 0.4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  component={Link}
                  to="/GetPreparedness"
                  sx={buttonStyle}
                  disableRipple
                >
                  Prepare
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: [null, 1.05, 1.05] }}
                transition={{ duration: 0.4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleOpenDialog}
                  sx={buttonStyle}
                  disableRipple
                >
                  Reminder
                </Button>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                whileHover={{ scale: [null, 1.05, 1.05] }}
                transition={{ duration: 0.4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button component={Link} to="/" sx={buttonStyle} disableRipple>
                  Home
                </Button>
              </motion.div>

              <Stack>
                <motion.div
                  whileHover={{ scale: [null, 1.05, 1.05] }}
                  transition={{ duration: 0.4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    id="basic-button"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    sx={buttonStyle}
                    endIcon={<BsFillCaretDownFill size="15px" />}
                    disableRipple
                  >
                    Items Browser
                  </Button>
                </motion.div>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem component={Link} to="/log-in" onClick={handleClose}>
                    Reports
                  </MenuItem>
                  <MenuItem component={Link} to="/log-in" onClick={handleClose}>
                    Rescue
                  </MenuItem>
                </Menu>
              </Stack>
            </>
          )}
        </Stack>
        <Stack direction="row">
          {token ? (
            <Button
              variant="contained"
              component={Link}
              onClick={signout}
              sx={{
                textTransform: "none",
                px: "20px",
              }}
              size="small"
              disableRipple
            >
              Logout
            </Button>
          ) : (
            <Stack direction="row" gap={1}>
              <Button
                variant="contained"
                component={Link}
                to="/log-in"
                sx={{
                  textTransform: "none",
                  px: "20px",
                }}
                size="small"
                disableRipple
              >
                Login
              </Button>
              <Button
                variant="contained"
                component={Link}
                to="/sign-up"
                sx={{
                  textTransform: "none",
                  px: "20px",
                }}
                size="small"
                disableRipple
              >
                Sign Up
              </Button>
            </Stack>
          )}
        </Stack>
      </Stack>

      {/* Mobile Drawer */}
      <Drawer anchor="top" open={drawerOpen} onClose={toggleDrawer}>
        <Stack
          width="100%"
          direction="column"
          justifyContent="center"
          alignItems="center"
          borderRadius="0 0 20px 20px"
          px={2}
          py={2}
          sx={{ backgroundColor: "#F6F8F8" }}
        >
          <Link to="/">
            <Stack maxWidth="180px">
              <img src={bgSvg} alt="logo" width="90%" />
            </Stack>
          </Link>
          {token ? (
            <>
              <Button
                component={Link}
                to="/"
                sx={buttonStyle}
                disableRipple
                onClick={toggleDrawer}
              >
                Home
              </Button>
              <Button
                component={Link}
                to="/postitem"
                sx={buttonStyle}
                disableRipple
                onClick={toggleDrawer}
              >
                Report
              </Button>
              <Button
                id="basic-button-mobile"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                sx={buttonStyle}
                endIcon={<BsFillCaretDownFill size="15px" />}
                disableRipple
              >
                Reports/Rescue
              </Button>

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button-mobile",
                }}
              >
                <MenuItem
                  component={Link}
                  to="/lostItems"
                  onClick={handleClose}
                >
                  Reports
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/foundItems"
                  onClick={handleClose}
                >
                  Helps
                </MenuItem>
              </Menu>
              <Button
                component={Link}
                to="/mylistings"
                sx={buttonStyle}
                disableRipple
                onClick={toggleDrawer}
              >
                My Reports
              </Button>
              <Button
                component={Link}
                to="/supplies"
                sx={buttonStyle}
                disableRipple
                onClick={toggleDrawer}
              >
                Donate
              </Button>
              <Button
                component={Link}
                to="/mySupplies"
                sx={buttonStyle}
                disableRipple
                onClick={toggleDrawer}
              >
                View Donations
              </Button>
              <Button
                component={Link}
                to="/viewmanual"
                sx={buttonStyle}
                disableRipple
                onClick={toggleDrawer}
              >
                Manual
              </Button>
              <Button
                component={Link}
                to="/manual"
                sx={buttonStyle}
                disableRipple
                onClick={toggleDrawer}
              >
                Add Manual
              </Button>
              <Button
                component={Link}
                to="/NearbyHospitals"
                sx={buttonStyle}
                disableRipple
                onClick={toggleDrawer}
              >
                Nearby Hospitals
              </Button>
              <Button
                component={Link}
                to="/NearbyStations"
                sx={buttonStyle}
                disableRipple
                onClick={toggleDrawer}
              >
                Nearby Stations
              </Button>
              <Button
                variant="contained"
                component={Link}
                onClick={signout}
                sx={{
                  textTransform: "none",
                  px: "20px",
                }}
                size="small"
                disableRipple
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/"
                sx={buttonStyle}
                disableRipple
                onClick={toggleDrawer}
              >
                Home
              </Button>
              <Button
                id="basic-button-mobile"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                sx={buttonStyle}
                endIcon={<BsFillCaretDownFill size="15px" />}
                disableRipple
              >
                Items Browser
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button-mobile",
                }}
              >
                <MenuItem component={Link} to="/log-in" onClick={handleClose}>
                  Reports
                </MenuItem>
                <MenuItem component={Link} to="/log-in" onClick={handleClose}>
                  Help
                </MenuItem>
              </Menu>
              <Button
                variant="contained"
                component={Link}
                to="/log-in"
                sx={{
                  textTransform: "none",
                  px: "20px",
                }}
                size="small"
                disableRipple
              >
                Login
              </Button>
              <Button
                variant="contained"
                component={Link}
                to="/sign-up"
                sx={{
                  textTransform: "none",
                  px: "20px",
                }}
                size="small"
                disableRipple
              >
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Drawer>

      {/* Mobile Navbar Toggle Button */}
      <Stack
        display={{ xs: "flex", sm: "none" }}
        justifyContent="flex-end"
        pr={2}
      >
        <img
          gap={10}
          src={bgSvg} // Assuming bgSvg is the path to your logo image
          alt="logo"
          width="200px" // Adjust the width as needed
          onClick={toggleDrawer}
          style={{ cursor: "pointer", marginBottom: "10px" }}
        />
      </Stack>
    </>
  );
}

export default Navbar;
