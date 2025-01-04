import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Button,
  Box,
  Modal,
  Typography,
  IconButton,
} from "@mui/material";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import {} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import logo from '../img/logo.jpg';

// const expenseData = [
//   { name: 'Tishath', course: 'HND', email: 'tishath@gmail.com', contactno: '0761861044' },
//   { name: 'vedha', course: 'civil', email: 'vedha@gmail.com', contactno: '0767845145' },

// ];

const DigitalIDPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const [studentImage,setStudentImage] = useState('');
  const [studentQR,setStudentQR] = useState('');

  const handleOpenModal = (row) => {
    setSelectedRow(row);
    setStudentImage(row.student_image.image)
    setStudentQR(row.qr_code)
    // console.log("row", );

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRow(null);
  };

  const handleRotate = () => {
    setIsFlipped(!isFlipped);
  };
  /////////////////////////////////////////////////////////////////////////////////////
  const [students, setStudents] = useState([]);

  const fetchStudent = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/digitalid");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setStudents(data.students);

      if (data.students && data.students.length > 0) {
        console.log(data.students[0].student_image?.image);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////

  return (
    <Box>
      {/* <Button variant="contained" color="primary" sx={{ marginRight: '20px' }} disabled>Add Expense +</Button> */}
      <Box
        sx={{
          marginBottom: "35px",
          mt: 5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="outlined"
            color="secondary"
            sx={{
              marginRight: "20px",
              "&:hover": {
                backgroundColor: "#650D70",
                color: "white",
                borderColor: "#650D70",
              },
            }}
          >
            Copy
          </Button>

          <Button
            variant="outlined"
            color="warning"
            sx={{
              marginRight: "20px",
              "&:hover": {
                backgroundColor: "#EEA827",
                color: "white",
                borderColor: "#EEA827",
              },
            }}
          >
            CSV
          </Button>

          <Button
            variant="outlined"
            color="success"
            sx={{
              marginRight: "20px",
              "&:hover": {
                backgroundColor: "#11440D",
                color: "white",
                borderColor: "#11440D",
              },
            }}
          >
            Excel
          </Button>

          <Button
            variant="outlined"
            color="error"
            sx={{
              "&:hover": {
                backgroundColor: "#BD0D5F",
                color: "white",
                borderColor: "#BD0D5F",
              },
            }}
          >
            Print
          </Button>
        </Box>

        <Box>
          <label
            htmlFor="search-box"
            style={{
              marginRight: "10px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#555",
              display: "inline-block",
              verticalAlign: "middle",
            }}
          >
            Search:
          </label>
          <input
            id="search-box"
            type="text"
            placeholder="Search..."
            style={{
              padding: "10px 15px",
              width: "250px",
              borderRadius: "25px",
              border: "2px solid #E0E0E0",
              fontSize: "16px",
              outline: "none",
              backgroundColor: "#f9f9f9",
              color: "#333",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#007BFF")}
            onBlur={(e) => (e.target.style.borderColor = "#E0E0E0")}
          />
        </Box>
      </Box>

      <TableContainer sx={{ borderRadius: "10px", overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#3498DB" }}>
            <TableRow>
              <TableCell sx={{ width: "12%", textAlign: "center" }}>
                Student Name
              </TableCell>
              <TableCell sx={{ width: "12%", textAlign: "center" }}>
                Course
              </TableCell>
              <TableCell sx={{ width: "12%", textAlign: "center" }}>
                Email
              </TableCell>
              <TableCell sx={{ width: "12%", textAlign: "center" }}>
                Contact No
              </TableCell>
              <TableCell sx={{ width: "40%", textAlign: "center" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((row, student) => (
              <TableRow key={student.id}>
                <TableCell sx={{ width: "22%", textAlign: "center" }}>
                  {row.first_name}
                </TableCell>
                <TableCell sx={{ width: "22%", textAlign: "center" }}>
                  {" "}
                  {row.name_of_course?.course_name || "N/A"}
                </TableCell>
                <TableCell sx={{ width: "22%", textAlign: "center" }}>
                  {row.email}
                </TableCell>
                <TableCell sx={{ width: "22%", textAlign: "center" }}>
                  {row.phone_number}
                </TableCell>
                <TableCell sx={{ width: "30%", textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ backgroundColor: "#4C9E75", color: "white" }}
                      onClick={() => handleOpenModal(row)}
                    >
                      Id generate
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            height: 500,
            perspective: 1000,
          }}
        >
          {/* Flip Container */}
          <Box
            sx={{
              width: "100%",
              height: "100%",
              position: "relative",
              transition: "transform 0.8s",
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* FRONT SIDE */}
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                bgcolor: "#ffffff",
                borderRadius: "12px",
                boxShadow: 4,
                textAlign: "center",
                backfaceVisibility: "hidden",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // Centers everything horizontally
                justifyContent: "space-between",
              }}
            >
              {/* Rotate Icon */}
              <IconButton
                sx={{ position: "absolute", top: 8, right: 8 }}
                onClick={handleRotate}
              >
                <RotateLeftIcon />
              </IconButton>

              {/* Header */}
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                STUDENT ID CARD
              </Typography>

              {/* Profile Image */}

              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  overflow: "hidden",
                  margin: "0 auto",
                  border: "2px solid #1976d2",
                }}
              >
                {/* {selectedRow.} */}
               
                  <img
                    src={`http://localhost:8000/${studentImage}`}
                    alt="Student"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                
              </Box>

              {/* Details */}
              {selectedRow && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  {" "}
                  {/* Center-aligns text */}
                  <Typography>
                    <strong>Name:</strong> {selectedRow.first_name.toUpperCase()}
                  </Typography>
                  <Typography>
                    <strong>DOB:</strong> {selectedRow.date_of_birth.toUpperCase() || "N/A"}
                  </Typography>
                  <Typography>
                    <strong>NIC:</strong> {selectedRow.nic_number.toUpperCase() || "N/A"}
                  </Typography>
                  <Typography>
                    <strong>Address:</strong> {selectedRow.address.toUpperCase() || "N/A"}
                  </Typography>
                  <Typography>
                    <strong>Department:</strong>{" "}
                    {selectedRow.name_of_course?.course_name.toUpperCase() || "N/A"}
                  </Typography>
                  <Typography>
                      <strong>Batch:</strong>{" "}
                      {selectedRow.name_of_course?.preferred_mode
                        ? selectedRow.name_of_course.preferred_mode.toUpperCase()
                        : "N/A"}
                    </Typography>

                </Box>
              )}
              {/* Close Button */}
              <Button
                variant="contained"
                color="error"
                onClick={handleCloseModal}
                sx={{
                  mt: 2,
                  borderRadius: "20px",
                  fontWeight: "bold",
                  width: "60%",
                }}
              >
                Close
              </Button>
            </Box>

            {/* BACK SIDE */}
            {selectedRow && (
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                bgcolor: "#f8f9fa",
                borderRadius: "12px",
                boxShadow: 4,
                textAlign: "center",
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center", // Center vertically
                alignItems: "center", // Center horizontally
                gap: 2, // Adds spacing between sections
                padding: "20px",
              }}
            >
              {/* Rotate Icon */}
              <IconButton
                sx={{ position: "absolute", top: 8, right: 8 }}
                onClick={handleRotate}
              >
                <RotateLeftIcon />
              </IconButton>

              {/* Title */}
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                TERMS AND CONDITIONS
              </Typography>

              {/* Terms */}
              <Box sx={{ textAlign: "center", width: "80%" }}>
                <Typography variant="body2">
                  • Use campus facilities responsibly.
                </Typography>
                <Typography variant="body2">
                  • Carry ID cards at all times.
                </Typography>
              </Box>

              {/* Contact Details */}
              <Box sx={{ textAlign: "center", mt: 2, width: "80%" }}>
                <Typography variant="body2">
                  <strong>Phone:</strong> +94-117-999-300
                </Typography>
                <Typography variant="body2">
                  <strong>Mail:</strong> info@jaffnacampus.lk
                </Typography>
                <Typography variant="body2">
                  <strong>Website:</strong>{" "}
                  <a
                    href="https://jaffnacampus.lk"
                    style={{ color: "#1976d2", textDecoration: "none" }}
                  >
                    https://jaffnacampus.lk
                  </a>
                </Typography>
              </Box>

              {/* QR Code */}
              
                <Box
                  key={studentQR} // Ensure a unique key is used
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid #ccc",
                    mt: 2,
                  }}
                >
                  <img
                    src={studentQR}
                    alt="QR Code"
                    style={{ width: "100%", height: "100%" }}
                  />
                </Box>
              

              {/* Date Section */}
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2">
                  <strong>Joined Date:</strong> {selectedRow.admin_use?.join_date
              ? selectedRow.admin_use.join_date
                        : "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Expire Date:</strong> {selectedRow.admin_use?.end_date
              ? selectedRow.admin_use.end_date
                        : "N/A"}
                </Typography>
              </Box>

              {/* Bottom Section: Logo and Principal */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  mt: "auto",
                  padding: "10px 20px",
                  borderTop: "1px solid #ccc",
                }}
              >
                {/* Logo on the Left */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <img
                    src={logo}
                    alt="Logo"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <Typography variant="body2"> Jaffna Campus</Typography>
                </Box>

                {/* Principal Details on the Right */}
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="body2">Principal</Typography>
                  <Typography variant="body2">___________</Typography>
                </Box>
              </Box>
            </Box>
              )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default DigitalIDPage;
