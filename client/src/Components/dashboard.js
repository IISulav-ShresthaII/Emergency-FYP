import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Box } from "@mui/material";
import Charts from "./charts/Chart"; // Import ItemChart component

const Dashboard = () => {
  const [totalManuals, setTotalManuals] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPreparedness, setTotalPreparedness] = useState(0);
  const [totalSupplies, setTotalSupplies] = useState(0);
  const [totalUser, setTotalUser] = useState(0);

  const boxStyles = {
    backgroundColor: "#f0f0f0",
    padding: 2,
    borderRadius: 4,
    width: "300px",
    height: "100px",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const chartContainerStyles = {
    backgroundColor: "#f0f0f0",
    padding: 0,
    borderRadius: 15,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          manualsResponse,
          itemsResponse,
          preparednessResponse,
          suppliesResponse,
          usersResponse,
        ] = await Promise.all([
          Axios.get("http://localhost:4000/manual/total"),
          Axios.get("http://localhost:4000/items/total"),
          Axios.get("http://localhost:4000/Preparedness/total"),
          Axios.get("http://localhost:4000/Supplies/total"),
          Axios.get("http://localhost:4000/Users/total"),
        ]);

        setTotalManuals(manualsResponse.data.total);
        setTotalItems(itemsResponse.data.total);
        setTotalPreparedness(preparednessResponse.data.total);
        setTotalSupplies(suppliesResponse.data.total);
        setTotalUser(usersResponse.data.total);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Dashboard</h1>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Box sx={boxStyles}>
          <p>Total Users: {totalUser}</p>
        </Box>
        <Box sx={boxStyles}>
          <p>Total Reports: {totalItems}</p>
        </Box>
        <Box sx={boxStyles}>
          <p>Total Donations: {totalSupplies}</p>
        </Box>
        <Box sx={boxStyles}>
          <p>Total Manuals Created: {totalManuals}</p>
        </Box>
        <Box sx={boxStyles}>
          <p>Total Preparedness: {totalPreparedness}</p>
        </Box>
      </Box>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "10px",
          ...chartContainerStyles, // Apply styles to the chart container
        }}
      >
        <div style={{ marginRight: "10px" }}>{/* <SuppliesChart /> */}</div>
        <div>
          <Charts />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
