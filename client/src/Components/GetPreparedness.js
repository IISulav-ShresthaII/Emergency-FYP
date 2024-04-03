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
  const handleChange = (event, page) => {
    setPage(page);
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
  width: "100%", // Adjusted width to 100% for responsiveness
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
  width: "80%", // Adjusted width to 80% for responsiveness
  maxWidth: 400, // Added maxWidth for larger screens
  backgroundColor: theme.palette.background.paper,
  border: "2px solid #000",
  boxShadow: 24,
  padding: theme.spacing(2, 4, 3),
}));

const GetPreparedness = () => {
  const [Preparedness, setPreparedness] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCard, setExpandedCard] = useState(null);

  const fetchData = async () => {
    try {
      const response = await Axios.get("http://localhost:4000/Preparedness");
      const allpreparedness = response.data.preparednesss.reverse();
      const preparednessPerPage = 9;
      const numPreparedness = allpreparedness.length;
      setMaxPages(Math.ceil(numPreparedness / preparednessPerPage));
      const startIndex = (page - 1) * preparednessPerPage;
      const endIndex = startIndex + preparednessPerPage;
      const data = allpreparedness
        .slice(startIndex, endIndex)
        .map((supply) => ({
          ...supply,
          expanded: false,
        }));
      setPreparedness(data);
    } catch (err) {
      console.log("Error fetching preparedness data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenModal = (supply) => {
    setExpandedCard(supply);
  };

  const handleCloseModal = () => {
    setExpandedCard(null);
  };

  const filteredPreparednesss = Preparedness.filter(
    (supply) =>
      supply.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supply.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Box sx={{ background: "primary", width: "100%" }}>
        <StyledPaper elevation={3}>
          <Typography variant="h4" color="white" align="center" gutterBottom>
            Welcome to the Instruction Prepare Section
          </Typography>
          <Typography variant="body1" color="white" align="center">
            We will help you get prepared in case of emergencies.
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
        direction={{ xs: "column", sm: "row" }} // Adjusted direction for responsiveness
        justifyContent="center"
        alignItems="center"
        spacing={3}
        marginBottom={4}
      >
        {filteredPreparednesss.map((supply) => (
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            key={supply._id}
            sx={{ width: { xs: "100%", sm: "auto" } }} // Adjusted width for responsiveness
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
                  View Details
                </Button>
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {expandedCard?.title}
          </Typography>
          <Avatar
            src={expandedCard?.img}
            sx={{ width: 200, height: 200, margin: "0 auto" }}
          />
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2, textAlign: "center" }}
          >
            {expandedCard?.description}
          </Typography>
          <Button onClick={handleCloseModal}>Close</Button>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GetPreparedness;
