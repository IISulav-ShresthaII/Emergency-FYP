import React, { useState, useEffect } from "react";
import {
    Stack,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@mui/material";
import { motion } from "framer-motion";
import bgSvg from "../img/earth.svg";
import bgSvg2 from "../img/line.png";

const Home = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [redirectTo, setRedirectTo] = useState(null);
    const [openReminderDialog, setOpenReminderDialog] = useState(false);
    const [reminderTime, setReminderTime] = useState("");
    const [reminderSet, setReminderSet] = useState(false);

    const isLoggedIn = JSON.parse(window.localStorage.getItem("user"));

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleButtonClick = () => {
        if (isLoggedIn) {
            setRedirectTo("/postitem");
        } else {
            setRedirectTo("/log-in");
        }
    };

    const handleOpenReminderDialog = () => {
        setOpenReminderDialog(true);
    };

    const handleCloseReminderDialog = () => {
        setOpenReminderDialog(false);
    };

    const handleReminderTimeChange = (event) => {
        setReminderTime(event.target.value);
    };

    const handleSetReminder = () => {
        localStorage.setItem("reminderTime", reminderTime);
        setReminderSet(true);
        handleCloseReminderDialog();
    };

    useEffect(() => {
        const reminderTime = localStorage.getItem("reminderTime");
        const currentTime = new Date().getTime();

        if (reminderTime && currentTime >= new Date(reminderTime).getTime()) {
            setOpenDialog(true);
            setReminderSet(false);
            localStorage.removeItem("reminderTime"); // Clear reminder time after it's displayed
        }
    }, []);

    useEffect(() => {
        if (redirectTo) {
            window.location.href = redirectTo;
        }
    }, [redirectTo]);

    return (
        <Stack width="100%" gap="100px" alignItems="center" pt="1px">
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
                    py="0px"
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
                            emergency.
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
                        {!reminderSet && (
                            <motion.div whileTap={{ scale: 0.98 }}>
                                <Button
                                    onClick={handleOpenReminderDialog}
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        marginTop: '10px',
                                        alignSelf: { xs: "center", md: "auto" },
                                        width: { xs: "200px", md: "auto" },
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontWeight: "regular",
                                    }}
                                >
                                    Remind Me
                                </Button>
                            </motion.div>
                        )}
                    </Stack>
                    <Stack width="100%" display={{ xs: "none", md: "flex" }}>
                        <img src={bgSvg} alt="Line" width="80%" />
                    </Stack>
                </Stack>
            </Stack>

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
                    <Button  onClick={() => {
                        setOpenDialog(false);
                        window.location.href = "/GetPreparedness";
                    }}
                             color="primary"
                             autoFocus
                    >
                        No, Show Me
                    </Button>
                    <Button onClick={handleCloseDialog} color="primary">

                        Yes, I am
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Reminder dialog */}
            <Dialog
                open={openReminderDialog}
                onClose={handleCloseReminderDialog}
                aria-labelledby="reminder-dialog-title"
                aria-describedby="reminder-dialog-description"
            >
                <DialogTitle id="reminder-dialog-title">Set Reminder</DialogTitle>
                <DialogContent>
                    <DialogContentText id="reminder-dialog-description">
                        Select the time for the reminder:
                    </DialogContentText>
                    <TextField
                        id="reminder-time"
                        label="Reminder Time"
                        type="datetime-local"
                        value={reminderTime}
                        onChange={handleReminderTimeChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            min: new Date().toISOString().slice(0, 16) // Set min attribute to present date
                        }}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseReminderDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSetReminder} color="primary">
                        Set Reminder
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};

export default Home;
