// /AIzaSyBwTN8VNLAfwlJ67FNjrVixdvCFZsCHvsI
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import RoomIcon from "@mui/icons-material/Room";
import { ShoppingCart } from "@mui/icons-material";
import { FcAbout, FcOvertime } from "react-icons/fc";
import {
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  Pagination,
  Button,
  Paper,
} from "@mui/material";
import Axios from "axios";
import GoogleMapReact from "google-map-react";

const Marker = () => <RoomIcon style={{ color: "red", fontSize: 30 }} />;

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
      <Button onClick={onClose}>Close Map</Button>
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

const MySupplies = () => {
  const [supplies, setSupplies] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [selectedSupply, setSelectedSupply] = useState(null);

  const fetchData = async () => {
    try {
      const response = await Axios.get("http://localhost:4000/supplies");
      const allsupplies = response.data.suppliess.reverse();
      const suppliesPerPage = 9;
      const numSupplies = allsupplies.length;
      setMaxPages(Math.ceil(numSupplies / suppliesPerPage));
      const startIndex = (page - 1) * suppliesPerPage;
      const endIndex = startIndex + suppliesPerPage;
      const data = allsupplies.slice(startIndex, endIndex).map((supply) => ({
        ...supply,
      }));
      setSupplies(data);
    } catch (err) {
      console.log("Error fetching supplies:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleShowMap = (supply) => {
    setSelectedSupply(supply);
  };

  const handleCloseMap = () => {
    setSelectedSupply(null);
  };

  return (
    <>
      <Stack
        direction="row"
        width="100%"
        sx={{ backgroundColor: "primary.main" }}
        height="125px"
        gap="4px"
        alignItems="center"
        justifyContent="center"
      >
        <Stack
          spacing={0}
          position="relative"
          justifyContent="center"
          width="100%"
          maxWidth="1440px"
          height="125px"
          overflow="hidden"
          ml={{ xs: 3, sm: 5, md: 10 }}
        >
          <Typography
            fontSize={{ xs: "17px", sm: "21px", md: "23px" }}
            color="white"
            fontWeight="bold"
          >
            Here are all supplies that you have donated.
          </Typography>
        </Stack>
      </Stack>
      <Stack
        pt="20px"
        direction="row"
        justifyContent={"center"}
        flexWrap="wrap"
        gap="24px"
        maxWidth="1440px"
        position="relative"
      >
        {supplies.map((supply) => (
          <motion.div
            whileHover={{ scale: [null, 1.05, 1.05] }}
            transition={{ duration: 0.4 }}
            key={supply._id}
          >
            <Card
              sx={{
                width: "270px",
                height: "400px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              }}
            >
              <CardContent
                sx={{
                  borderRadius: "8px",
                  padding: "8px",
                  gap: "16px",
                }}
              >
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="row"
                  position="relative"
                  sx={{
                    backgroundColor: "#9CC0DF",
                    height: "200px",
                    borderRadius: "8px",
                  }}
                >
                  <Stack
                    sx={{
                      borderRadius: "7rem",
                    }}
                  >
                    <Avatar
                      src={supply.img}
                      sx={{
                        width: "170px",
                        height: "170px",
                      }}
                    />
                  </Stack>
                </Stack>
                <Stack p="11px" gap="11px">
                  <Typography
                    noWrap
                    gutterBottom
                    fontSize="25px"
                    component="div"
                    fontWeight={"bold"}
                    m="0"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "16px",
                    }}
                  >
                    {supply.name}
                  </Typography>
                </Stack>
                <Stack direction="row" width="100%" gap="15px">
                  <ShoppingCart sx={{ fontSize: "25px" }} />
                  <Typography noWrap fontSize="16px" color="black" width="100%">
                    {supply.amount}
                  </Typography>
                </Stack>
                <Stack
                  pb="19px"
                  pt="11px"
                  direction="row"
                  width="100%"
                  gap="15px"
                >
                  <FcOvertime fontSize="25px" />
                  <Typography ml="5px" noWrap fontSize="16px" color="black">
                    {new Date(supply.createdAt).toLocaleString()}
                  </Typography>
                </Stack>
                <Button onClick={() => handleShowMap(supply)}>Show Map</Button>
              </CardContent>
            </Card>
          </motion.div>
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
