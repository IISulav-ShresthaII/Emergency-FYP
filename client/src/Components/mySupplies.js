//responsive
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FcAbout } from "react-icons/fc";
import { FcOvertime } from "react-icons/fc";
import { Link } from "react-router-dom";
import { setConstraint } from "../constraints";
import {
  Button,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  Pagination,
} from "@mui/material";
import Axios from "axios";

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

export default function Feed() {
  const getUserId = () => {
    const user = JSON.parse(window.localStorage.get("user")); // eslint-disable-next-line
    return user ? user : null;
  };
  const user_info = getUserId();
  setConstraint(true); // eslint-disable-next-line

  const [supplies, setsupplies] = useState("");
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);

  const fetchData = async () => {
    try {
      const response = await Axios.get("http://localhost:4000/suppliess"); // eslint-disable-next-line
      const allsuppliess = response.data.suppliess.reverse();
      const suppliessPerPage = 9;
      const numSuppliess = allsuppliess.length;
      setMaxPages(Math.ceil(numSuppliess / suppliessPerPage));
      const startIndex = (page - 1) * suppliessPerPage;
      const endIndex = startIndex + suppliessPerPage;
      const data = allsuppliess.slice(startIndex, endIndex);
      let suppliess = [];
      data.forEach((supplies) => {
        let created_date = new Date(supplies.createdAt);
        let createdAt =
          created_date.getHours() + ":" + created_date.getMinutes();
        if (supplies.userId === getUserId()._id) {
          suppliess.push(
            <motion.div
              whileHover={{ scale: [null, 1.05, 1.05] }}
              transition={{ duration: 0.4 }}
              key={supplies.name}
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
                        src={supplies.img}
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
                      {supplies.name}
                    </Typography>
                  </Stack>
                  <Stack direction="row" width="100%" gap="15px">
                    <FcAbout fontSize="25px" />
                    <Typography
                      noWrap
                      fontSize="16px"
                      color="black"
                      width="100%"
                    >
                      {supplies.description.toString().slice(0, 30)} ...
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
                      {createdAt}
                    </Typography>
                  </Stack>
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Button
                      component={Link}
                      to={`/${supplies.name}?cid=${supplies._id}&type=${supplies.type}/true`}
                      variant={"contained"}
                      color="primary"
                      sx={{
                        textTransform: "none",
                        width: "140px",
                        borderRadius: "8px",
                      }}
                    >
                      More Details
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          );
        }
      });
      setsupplies(suppliess);
    } catch (err) {
      console.log("Error :", err);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(interval); // eslint-disable-next-line
  }, []);

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
          <>
            <Typography
              fontSize={{ xs: "17px", sm: "21px", md: "23px" }}
              color="white"
              fontWeight="bold"
            >
              Here you can find the emergencies you have reported,{" "}
              {user_info.nickname}
            </Typography>
          </>
        </Stack>
      </Stack>
      <Stack
        pt="20px"
        direction="row"
        justifyContent={"center"}
        flexWrap="wrap"
        gap="24px"
        maxWidth="1440px"
      >
        {supplies}
      </Stack>
      <Paginationn page={page} setPage={setPage} max={maxPages} />
    </>
  );
}
