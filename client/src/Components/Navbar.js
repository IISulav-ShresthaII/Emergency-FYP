import React, { useState, useEffect } from "react";
import { BsFillCaretDownFill } from "react-icons/bs";
import { Button, Drawer, Menu, MenuItem, Stack, IconButton, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MenuIcon from '@mui/icons-material/Menu';
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

  // Check user role to determine which buttons to display
  const userRole = JSON.parse(localStorage.getItem("user"))?.role;

  return (
      <>
        {/* Desktop Navbar */}
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
            display={{ xs: "none", md: "flex" }}
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
                  {userRole === "admin" && (
                      <>
                        <motion.div
                            whileHover={{ scale: [null, 1.05, 1.05] }}
                            transition={{ duration: 0.4 }}
                            whileTap={{ scale: 0.98 }}
                        >
                          <Button
                              component={Link}
                              to="/adminstaffaddition"
                              sx={buttonStyle}
                              disableRipple
                          >
                            Add Staffs
                          </Button>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: [null, 1.05, 1.05] }}
                            transition={{ duration: 0.4 }}
                            whileTap={{ scale: 0.98 }}
                        >
                          <Button
                              component={Link}
                              to="/dashboard"
                              sx={buttonStyle}
                              disableRipple
                          >
                            Dashboard
                          </Button>
                        </motion.div>
                      </>
                  )}
                  {userRole === "staff" && (
                      <>
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
                              to="/Preparedness"
                              sx={buttonStyle}
                              disableRipple
                          >
                            Preparedness
                          </Button>
                        </motion.div>
                      </>
                  )}
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
                        to="/GetPreparedness"
                        sx={buttonStyle}
                        disableRipple
                    >
                      Prepare
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

        {/* Mobile Navbar */}
        <Stack
            display={{ xs: "flex", md: "none" }}
            justifyContent="space-between"
            alignItems="center"
            sx={{ backgroundColor: "white" }}
            py={2}
            px={2}
        >
          <Link to="/">
            <img src={bgSvg} alt="logo" width="150px" />
          </Link>
          <IconButton onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
        </Stack>

        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
          <List sx={{ width: 250 }}>
            {token ? (
                <>
                  <ListItem button component={Link} to="/" onClick={toggleDrawer}>
                    <ListItemText primary="Home" />
                  </ListItem>
                  {userRole === "admin" && (
                      <>
                        <ListItem button component={Link} to="/adminstaffaddition" onClick={toggleDrawer}>
                          <ListItemText primary="Add Staffs" />
                        </ListItem>
                        <ListItem button component={Link} to="/dashboard" onClick={toggleDrawer}>
                          <ListItemText primary="Dashboard" />
                        </ListItem>
                      </>
                  )}
                  {userRole === "staff" && (
                      <>
                        <ListItem button component={Link} to="/manual" onClick={toggleDrawer}>
                          <ListItemText primary="Post Manual" />
                        </ListItem>
                        <ListItem button component={Link} to="/Preparedness" onClick={toggleDrawer}>
                          <ListItemText primary="Preparedness" />
                        </ListItem>
                      </>
                  )}
                  <ListItem button component={Link} to="/postitem" onClick={toggleDrawer}>
                    <ListItemText primary="Report" />
                  </ListItem>
                  <ListItem button component={Link} to="/lostItems" onClick={toggleDrawer}>
                    <ListItemText primary="Reports" />
                  </ListItem>
                  <ListItem button component={Link} to="/foundItems" onClick={toggleDrawer}>
                    <ListItemText primary="Rescue" />
                  </ListItem>
                  <ListItem button component={Link} to="/mylistings" onClick={toggleDrawer}>
                    <ListItemText primary="My Reports" />
                  </ListItem>
                  <ListItem button component={Link} to="/supplies" onClick={toggleDrawer}>
                    <ListItemText primary="Donate" />
                  </ListItem>
                  <ListItem button component={Link} to="/mySupplies" onClick={toggleDrawer}>
                    <ListItemText primary="View Donations" />
                  </ListItem>
                  <ListItem button component={Link} to="/viewmanual" onClick={toggleDrawer}>
                    <ListItemText primary="Manuals" />
                  </ListItem>
                  <ListItem button component={Link} to="/nearbyhospitals" onClick={toggleDrawer}>
                    <ListItemText primary="Nearby Hospitals" />
                  </ListItem>
                  <ListItem button component={Link} to="/nearbystations" onClick={toggleDrawer}>
                    <ListItemText primary="Nearby Stations" />
                  </ListItem>
                  <ListItem button component={Link} to="/GetPreparedness" onClick={toggleDrawer}>
                    <ListItemText primary="Prepare" />
                  </ListItem>
                  <ListItem button onClick={signout}>
                    <ListItemText primary="Logout" />
                  </ListItem>
                </>
            ) : (
                <>
                  <ListItem button component={Link} to="/" onClick={toggleDrawer}>
                    <ListItemText primary="Home" />
                  </ListItem>
                  <ListItem button component={Link} to="/log-in" onClick={toggleDrawer}>
                    <ListItemText primary="Reports" />
                  </ListItem>
                  <ListItem button component={Link} to="/log-in" onClick={toggleDrawer}>
                    <ListItemText primary="Rescue" />
                  </ListItem>
                  <ListItem button component={Link} to="/log-in" onClick={toggleDrawer}>
                    <ListItemText primary="Login" />
                  </ListItem>
                  <ListItem button component={Link} to="/sign-up" onClick={toggleDrawer}>
                    <ListItemText primary="Sign Up" />
                  </ListItem>
                </>
            )}
          </List>
        </Drawer>
      </>
  );
}

export default Navbar;
