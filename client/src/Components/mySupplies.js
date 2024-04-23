import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  Pagination,
  Paper,
  Button,
} from "@mui/material";
import Axios from "axios";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import GoogleMapReact from "google-map-react";
import RoomIcon from "@mui/icons-material/Room";

const Marker = () => <RoomIcon style={{ color: "red", fontSize: 30 }} />;

const SupplyMap = ({ latitude, longitude, onClose }) => {
  const defaultProps = {
    center: {
      lat: parseFloat(latitude),
      lng: parseFloat(longitude),
    },
    zoom: 17,
  };

  return (
    <Paper
      elevation={3}
      style={{
        position: "absolute",
        zIndex: 9999,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Button
        onClick={onClose}
        variant="contained"
        color="primary"
        sx={{ position: "absolute", top: 0, right: 0, zIndex: 9999 }}
      >
        Close Map
      </Button>
      <div style={{ height: "calc(100% - 48px)", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: "AIzaSyBwTN8VNLAfwlJ67FNjrVixdvCFZsCHvsI",
          }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          <Marker lat={defaultProps.center.lat} lng={defaultProps.center.lng} />
        </GoogleMapReact>
      </div>
    </Paper>
  );
};

const Paginationn = ({ page, setPage, max }) => {
  const handleChange = (event, page) => {
    setPage(page);
  };

  return (
    <Pagination
      sx={{ pt: "80px" }}
      count={Math.ceil(max)}
      page={page}
      onChange={handleChange}
      showLastButton
      showFirstButton
    />
  );
};

const MySupplies = () => {
  const [supplies, setSupplies] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [collectedStatus, setCollectedStatus] = useState({});
  const [user_info, setUser_info] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get("http://localhost:4000/supplies");
        const allsupplies = response.data.suppliess.reverse();
        const suppliesPerPage = 8;
        const numSupplies = allsupplies.length;
        setMaxPages(Math.ceil(numSupplies / suppliesPerPage));
        const startIndex = (page - 1) * suppliesPerPage;
        const endIndex = startIndex + suppliesPerPage;
        const data = allsupplies
          .slice(startIndex, endIndex)
          .map((supply) => ({ ...supply }));

        // Initialize collectedStatus from local storage
        const initialCollectedStatus = {};
        data.forEach((supply) => {
          const collectedValue = localStorage.getItem(
            `collected_${supply._id}`
          );
          initialCollectedStatus[supply._id] = collectedValue === "yes";
        });
        setCollectedStatus(initialCollectedStatus);

        setSupplies(data);
      } catch (err) {
        console.log("Error fetching supplies:", err);
      }
    };

    fetchData();
  }, [page]);

  const toggleCollected = async (supplyId) => {
    try {
      // Update the collected status in the database
      await Axios.put(`http://localhost:4000/supplies/update/${supplyId}`, {
        collected: collectedStatus[supplyId] ? "no" : "yes",
      });

      // Update local storage
      localStorage.setItem(
        `collected_${supplyId}`,
        collectedStatus[supplyId] ? "no" : "yes"
      );

      // Update collectedStatus state with the new value
      setCollectedStatus((prevStatus) => ({
        ...prevStatus,
        [supplyId]: !prevStatus[supplyId],
      }));
    } catch (err) {
      console.log("Error toggling collected status:", err);
    }
  };

  const handleShowMap = (supply) => {
    setSelectedSupply(supply);
  };

  const handleCloseMap = () => {
    setSelectedSupply(null);
  };

  return (
    <>
      <Paper
        sx={{
          backgroundColor: "primary.main",
          py: 3,
          textAlign: "center",
          width: "100%",
        }}
      >
        <Typography variant="h4" color="white" fontWeight="bold" gutterBottom>
          Here are all supplies that you have donated.
        </Typography>
      </Paper>

      <Stack
        pt="20px"
        direction="row"
        justifyContent={"center"}
        flexWrap="wrap"
        gap="60px"
        maxWidth="1440px"
        position="relative"
      >
        {supplies.map((supply) => (
          <Card key={supply._id} sx={{ maxWidth: 500 }}>
            <CardContent
              sx={{
                border: "2px solid",
                borderColor: (theme) => theme.palette.primary.main,
                borderRadius: "10px",
                backgroundColor: "#f0f0f0",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <Avatar
                src={supply.img}
                sx={{
                  width: "230px",
                  height: "200px",
                }}
              />
              <Typography
                variant="h6"
                color="primary.main"
                textAlign="center"
                fontWeight="bold"
              >
                {supply.name}
              </Typography>
              <Typography color="text.secondary" textAlign="center">
                {supply.amount}
              </Typography>
              <Typography color="text.secondary" textAlign="center">
                {new Date(supply.createdAt).toLocaleString()}
              </Typography>
              {user_info.role === "staff" && (
                <ToggleButtonGroup
                  value={
                    collectedStatus[supply._id] ? "collected" : "notCollected"
                  }
                  exclusive
                  onChange={() => toggleCollected(supply._id)}
                  aria-label="collected"
                  sx={{
                    border: "2px solid black", // Add border style here
                    borderRadius: "10px", // Optional: Add border radius
                  }}
                >
                  <ToggleButton
                    value="collected"
                    sx={{
                      backgroundColor: collectedStatus[supply._id]
                        ? "green"
                        : "",
                      "&.Mui-selected": {
                        backgroundColor: collectedStatus[supply._id]
                          ? "green"
                          : "",
                        borderRight: "2px solid black", // Add right border for the first button
                      },
                    }}
                  >
                    Collected
                  </ToggleButton>
                  <ToggleButton
                    value="notCollected"
                    sx={{
                      backgroundColor: collectedStatus[supply._id] ? "" : "red",
                      "&.Mui-selected": {
                        backgroundColor: collectedStatus[supply._id]
                          ? ""
                          : "red",
                        borderLeft: "2px solid black", // Add left border for the last button
                      },
                    }}
                  >
                    Not Collected
                  </ToggleButton>
                </ToggleButtonGroup>
              )}

              <Button
                onClick={() => handleShowMap(supply)}
                variant="outlined"
                color="primary"
              >
                Show Map
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>
      {selectedSupply && (
        <SupplyMap
          latitude={selectedSupply.latitude}
          longitude={selectedSupply.longitude}
          onClose={handleCloseMap}
        />
      )}
      <Paginationn page={page} setPage={setPage} max={maxPages} />
    </>
  );
};

export default MySupplies;
