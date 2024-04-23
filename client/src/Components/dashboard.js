import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Box, Paper, Typography } from "@mui/material";
import Charts from "./charts/Chart"; // Import Chart component
import { MapComponent } from "./charts/location";

const Dashboard = () => {
  const [totalManuals, setTotalManuals] = useState(0);
  const [totalOverall, setTotalOverall] = useState(0);
  const [totalPreparedness, setTotalPreparedness] = useState(0);
  const [totalSupplies, setTotalSupplies] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [locations, setLocations] = useState([]);
  const [totalToday, setTotalToday] = useState(0);
  const [totalYesterday, setTotalYesterday] = useState(0);
  const [totalSuppliesToday, setTotalSuppliesToday] = useState(0);
  const [totalSuppliesYesterday, setTotalSuppliesYesterday] = useState(0);
  const [totalUserToday, setTotalUserToday] = useState(0);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          manualsResponse,
          itemsResponse,
          preparednessResponse,
          suppliesResponse,
          usersResponse,
          totalItemsResponse,
          totalSuppliesResponse,
          totalUserResponse,
        ] = await Promise.all([
          Axios.get("http://localhost:4000/manual/total"),
          Axios.get("http://localhost:4000/items/total"),
          Axios.get("http://localhost:4000/Preparedness/total"),
          Axios.get("http://localhost:4000/Supplies/total"),
          Axios.get("http://localhost:4000/Users/total"),
          Axios.get("http://localhost:4000/items/total"),
          Axios.get("http://localhost:4000/supplies/total"),
          Axios.get("http://localhost:4000/users/total"),
        ]);

        setTotalManuals(manualsResponse.data.total);
        setTotalOverall(itemsResponse.data.totalOverall);
        setTotalPreparedness(preparednessResponse.data.total);
        setTotalSupplies(suppliesResponse.data.total);
        setTotalUser(usersResponse.data.total);
        setTotalToday(totalItemsResponse.data.totalToday);
        setTotalYesterday(totalItemsResponse.data.totalYesterday);
        setTotalUserToday(totalUserResponse.data.totalUserToday);
        setTotalSuppliesToday(totalSuppliesResponse.data.totalSuppliesToday);
        setTotalSuppliesYesterday(
          totalSuppliesResponse.data.totalSuppliesYesterday
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:4000/items")
      .then((response) => {
        const fetchedLocations = response.data.items.map((item) => ({
          latitude: parseFloat(item.latitude),
          longitude: parseFloat(item.longitude),
        }));
        setLocations(fetchedLocations);
      })
      .catch((error) => console.error("Error fetching locations:", error));
  }, []);
  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    if (user) {
      setUserRole(user.role);
    }
  }, []);

  // Render only if user has admin role
  if (userRole !== "admin") {
    return (
      <Typography variant="h6" color="error">
        Access restricted. Only admins are allowed to access this page.
      </Typography>
    );
  }
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Dashboard</h1>
      {/* Total counters */}
      <Box
        sx={{ display: "flex", flexDirection: "row", gap: 2, marginBottom: 4 }}
      >
        <Box
          sx={{
            backgroundColor: "#f0f0f0",
            padding: 2,
            borderRadius: 4,
            width: "300px",
            height: "100px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>Total Users: {totalUser}</Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "#f0f0f0",
            padding: 2,
            borderRadius: 4,
            width: "300px",
            height: "100px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>Total Reports: {totalOverall}</Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "#f0f0f0",
            padding: 2,
            borderRadius: 4,
            width: "300px",
            height: "100px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>Total Donations: {totalSupplies}</Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "#f0f0f0",
            padding: 2,
            borderRadius: 4,
            width: "300px",
            height: "100px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>Total Manuals Created: {totalManuals}</Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "#f0f0f0",
            padding: 2,
            borderRadius: 4,
            width: "300px",
            height: "100px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>Total Preparedness: {totalPreparedness}</Typography>
        </Box>
      </Box>
      <Box
        sx={{ display: "flex", flexDirection: "row", gap: 2, marginBottom: 4 }}
      >
        <Box
          sx={{
            backgroundColor: "#f0f0f0",
            padding: 2,
            borderRadius: 4,
            width: "300px",
            height: "100px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>Total Reports Today: {totalToday}</Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "#f0f0f0",
            padding: 2,
            borderRadius: 4,
            width: "300px",
            height: "100px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>Total Reports Yesterday: {totalYesterday}</Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "#f0f0f0",
            padding: 2,
            borderRadius: 4,
            width: "300px",
            height: "100px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>Total User Today: {totalUserToday}</Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "#f0f0f0",
            padding: 2,
            borderRadius: 4,
            width: "300px",
            height: "100px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>Total Supplies Today: {totalSuppliesToday}</Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "#f0f0f0",
            padding: 2,
            borderRadius: 4,
            width: "300px",
            height: "100px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>
            Total Supplies Yesterday: {totalSuppliesYesterday}
          </Typography>
        </Box>
      </Box>
      {/* Charts */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          marginBottom: 4,
        }}
      >
        {/* Chart 1 */}
        <Paper
          elevation={3}
          style={{
            padding: 20,
            width: "45%",
            height: "400px",
            overflow: "hidden",
          }}
        >
          <Charts />
        </Paper>
        {/* Chart 2 */}
        <Paper
          elevation={3}
          style={{
            padding: 20,
            width: "45%",
            height: "400px",
            overflow: "hidden",
          }}
        >
          <MapComponent locations={locations} />
        </Paper>
      </div>
    </div>
  );
};

export default Dashboard;
