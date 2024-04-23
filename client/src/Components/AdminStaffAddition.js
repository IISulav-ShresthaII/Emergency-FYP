import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Stack, TextField, Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // Assuming you are using react-router v6

function AdminStaffAddition() {
  const [nickname, setNickname] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate(); // For navigation after actions

  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    if (user) {
      setUserRole(user.role);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nickname,
      fullname,
      email,
      password,
      role: "staff",
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/users/create",
        payload
      );
      if (response.status === 201) {
        // Check if the response status is 201 Created
        toast.success("New staff added!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          onClose: () => navigate("/home"), // Redirect on toast close
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        throw new Error("Failed to add staff."); // Throws error if status is not 201
      }
    } catch (error) {
      console.error("Email already exist", error);
      toast.error(
        "Failed to add staff. " +
          (error.response?.data?.error || "Please try again."),
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    }
  };

  if (userRole !== "admin") {
    return (
      <Typography variant="h6" color="error">
        Access restricted. Only admins are allowed to access this page.
        <Button
          component={Link}
          to="/log-in"
          variant="contained"
          color="primary"
        >
          Log In
        </Button>
      </Typography>
    );
  }

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      width="100%"
      gap="20px"
      pt="10px"
    >
      <ToastContainer />
      <Typography variant="h5">Add Staff</Typography>
      <form onSubmit={handleSubmit}>
        <Stack alignItems="center" gap={2} width="300px">
          <TextField
            type="text"
            label="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
          <TextField
            type="text"
            label="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
          />
          <TextField
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Add Staff
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}

export default AdminStaffAddition;
