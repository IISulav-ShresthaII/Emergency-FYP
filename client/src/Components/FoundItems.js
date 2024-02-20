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

export default function FoundItems() {
  const [user_info, setuser_info] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const ReadMore = ({ children }) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
      setIsReadMore(!isReadMore);
    };
    return (
      <p style={{ fontSize: "1rem" }} className="text">
        {isReadMore ? text.slice(0, 15) : text}
        <span onClick={toggleReadMore} className="read-or-hide">
          {isReadMore ? "...." : " show less"}
        </span>
      </p>
    );
  };
  setConstraint(true);

  const [item, setitem] = useState("");
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);

  useEffect(() => {
    Axios({
      url: "http://localhost:4000/items",
      method: "GET",
    })
      .then((response) => {
        const allitems = response.data.items.reverse();
        const itemsPerPage = 9;
        const numItems = allitems.length;
        setMaxPages(Math.ceil(numItems / itemsPerPage));
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const data = allitems.slice(startIndex, endIndex);

        let items = [];
        data.map((item) => {
          let created_date = new Date(item.createdAt);

          let createdAt =
            created_date.getHours() + ":" + created_date.getMinutes();

          if (item.type === "Help") {
            let user = false;
            if (item.userId === user_info._id) {
              user = true;
            }

            items.push(
              <motion.div
                whileHover={{ scale: [null, 1.05, 1.05] }}
                transition={{ duration: 0.4 }}
                key={item.name}
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
                          src={item.img}
                          sx={{
                            width: "190px",
                            height: "190px",
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
                        {item.name}
                      </Typography>
                    </Stack>
                    <Stack direction="row" width="100%" gap="15px">
                      <FcAbout fontSize="25px" />
                      <Typography
                        // ml="5px"
                        noWrap
                        fontSize="16px"
                        color="black"
                        width="100%"
                      >
                        {item.description.toString().slice(0, 30)} ...
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
                        to={`/${item.name}?cid=${item._id}&type=${item.type}/${user}`}
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
        setitem(items);
      })
      .catch((err) => {
        console.log("Error :", err);
      });
  }, [page]);

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
              fontSize={{ xs: "18px", sm: "22px", md: "25px" }}
              color="white"
              fontWeight=""
            >
              Welcome {user_info.nickname} 👋!
            </Typography>

            <Typography
              fontSize={{ xs: "17px", sm: "21px", md: "23px" }}
              color="white"
              fontWeight="bold"
            >
              Here are all the rescuses on the way!
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
        {item}
      </Stack>

      <Paginationn page={page} setPage={setPage} max={maxPages} />
    </>
  );
}
