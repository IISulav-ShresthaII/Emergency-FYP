import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  Pagination,
  Button,
  Paper,
  TextField,
  styled,
  Box,
  Modal,
} from "@mui/material";
import Axios from "axios";

const Paginationn = ({ page, setPage, max }) => {
  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Pagination
      sx={{
        pt: "40px",
        pb: "20px",
        display: "flex",
        justifyContent: "center",
      }}
      count={Math.ceil(max)}
      page={page}
      onChange={handleChange}
      showLastButton
      showFirstButton
    />
  );
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: theme.palette.primary.main,
  padding: theme.spacing(4),
  border: `5px solid ${theme.palette.primary.dark}`,
  marginBottom: theme.spacing(6),
}));

const WhiteTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: theme.palette.common.white,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.common.white,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.common.white,
    },
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.common.white,
  },
  "& .MuiOutlinedInput-input": {
    color: theme.palette.common.white,
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  borderRadius: 16,
  border: `1px solid ${theme.palette.primary.main}`,
}));

const StyledCardContent = styled(CardContent)({
  padding: "16px",
});

const ModalContent = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: 400,
  backgroundColor: theme.palette.background.paper,
  border: "2px solid #000",
  boxShadow: 24,
  padding: theme.spacing(2, 4, 3),
}));

const ViewManual = () => {
  const [user_info, setUser_info] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [manual, setManual] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCard, setExpandedCard] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    img: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!user_info);

  const fetchData = async () => {
    try {
      const response = await Axios.get("http://localhost:4000/manual");
      const allmanual = response.data.manuals.reverse();
      const manualPerPage = 9;
      const numManual = allmanual.length;
      setMaxPages(Math.ceil(numManual / manualPerPage));
      const startIndex = (page - 1) * manualPerPage;
      const endIndex = startIndex + manualPerPage;
      const data = allmanual.slice(startIndex, endIndex);
      setManual(data);
    } catch (err) {
      console.log("Error fetching manual:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get("http://localhost:4000/manual");
        const allManual = response.data.manuals.reverse();
        let filteredManual = allManual;

        // Filter manual based on search term if it exists
        if (searchTerm) {
          filteredManual = allManual.filter(
            (item) =>
              item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        const manualPerPage = 9;
        const numManual = filteredManual.length;
        setMaxPages(Math.ceil(numManual / manualPerPage));
        const startIndex = (page - 1) * manualPerPage;
        const endIndex = startIndex + manualPerPage;
        const data = filteredManual.slice(startIndex, endIndex);
        setManual(data);
      } catch (err) {
        console.log("Error fetching manual:", err);
      }
    };

    fetchData();
  }, [page, searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenModal = (supply) => {
    setExpandedCard(supply);
    setEditFormData({
      title: supply.title,
      description: supply.description,
      img: supply.img,
    });
  };

  const handleCloseModal = () => {
    setExpandedCard(null);
  };

  const handleEditChange = (event) => {
    setEditFormData({
      ...editFormData,
      [event.target.name]: event.target.value,
    });
  };

  const handleEditSubmit = async (event, id) => {
    event.preventDefault();
    try {
      const response = await Axios.put(
        `http://localhost:4000/manual/update/${id}`,
        editFormData
      );
      if (response.status === 200) {
        setManual(
          manual.map((item) =>
            item._id === id ? { ...item, ...editFormData } : item
          )
        );
        handleCloseModal();
      } else {
        console.error("Failed to update manual");
      }
    } catch (error) {
      console.error("Error updating manual:", error);
    }
  };

  const handleDeleteManual = async (id) => {
    try {
      const response = await Axios.delete(
        `http://localhost:4000/manual/delete/${id}`
      );
      if (response.status === 200) {
        setManual(manual.filter((item) => item._id !== id));
      } else {
        console.error("Failed to delete manual");
      }
    } catch (error) {
      console.error("Error deleting manual:", error);
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <>
      <Box sx={{ background: "primary", width: "100%" }}>
        <StyledPaper elevation={3}>
          <Typography variant="h4" color="white" align="center" gutterBottom>
            Welcome to the First Aid Manual Section
          </Typography>
          <Typography variant="body1" color="white" align="center">
            Please read and follow the instructions carefully.
          </Typography>
          <WhiteTextField
            variant="outlined"
            fullWidth
            margin="normal"
            label="Search by Title or Description"
            value={searchTerm}
            onChange={handleSearch}
          />
        </StyledPaper>
      </Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        alignItems="center"
        spacing={3}
        marginBottom={4}
      >
        {manual.map((supply) => (
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            key={supply._id}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <StyledCard>
              <StyledCardContent>
                <Avatar
                  src={supply.img}
                  sx={{ width: 100, height: 100, margin: "0 auto 16px" }}
                />
                <Typography variant="h6" align="center" gutterBottom>
                  {supply.title}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ marginTop: "auto" }}
                  onClick={() => handleOpenModal(supply)}
                >
                  {user_info.role === "staff" ? "Edit" : "View Details"}
                </Button>
                {user_info.role === "staff" && (
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    sx={{ marginTop: 1 }}
                    onClick={() => handleDeleteManual(supply._id)}
                  >
                    Delete
                  </Button>
                )}
              </StyledCardContent>
            </StyledCard>
          </motion.div>
        ))}
      </Stack>
      <Paginationn page={page} setPage={setPage} max={maxPages} />
      <Modal
        open={!!expandedCard}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalContent>
          <form onSubmit={(event) => handleEditSubmit(event, expandedCard._id)}>
            <Typography variant="h6" component="h2">
              {user_info.role === "staff" ? "Edit Manual" : "Manual Details"}
            </Typography>
            <TextField
              label="Title"
              variant="outlined"
              name="title"
              value={editFormData.title}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
              disabled={user_info.role !== "staff"}
            />
            <TextField
              label="Description"
              variant="outlined"
              name="description"
              multiline
              rows={4}
              value={editFormData.description}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
              disabled={user_info.role !== "staff"}
            />
            {user_info.role === "staff" && (
              <Button type="submit" color="primary">
                Save Changes
              </Button>
            )}
            <Button onClick={handleCloseModal}>Close</Button>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ViewManual;

function LoginPage({ onLogin }) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Please log in to access this page</h1>
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={onLogin}>
          Log In
        </Button>
      </Box>
    </div>
  );
}
