import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Stack, TextField, Button } from "@mui/material";

function AdminStaffAddition() {
  const [nickname, setNickname] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState(""); // State to store user role

  useEffect(() => {
    // Fetch user role from local storage or server when component mounts
    const user = JSON.parse(window.localStorage.getItem("user"));
    if (user) {
      setUserRole(user.role);
    } else {
      // Handle case where user is not logged in or user data is unavailable
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
      console.log(response.data); // Handle success response
    } catch (error) {
      console.error("Error creating staff:", error); // Handle error
    }
  };

  if (userRole !== "admin") {
    return (
      <Typography variant="h6" color="error">
        Access restricted. Only admins are allowed to access this page.
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
