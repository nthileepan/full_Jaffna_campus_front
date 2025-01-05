import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const AttendanceTable = () => {
  const [searchParams] = useSearchParams();
  const [classDetails, setClassDetails] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSummaryModal, setOpenSummaryModal] = useState(false);
  // OTP related states
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
   const navigate = useNavigate()

  const lectureId = searchParams.get("lecture_id");
  const timeTableId = searchParams.get("time_table_id");

  const handleStopSession = async () => {
    try {
      // You can add an API call here to mark the session as complete
      // await axios.post('http://localhost:8000/api/end-session', {
      //   lecture_id: lectureId,
      //   time_table_id: timeTableId
      // });

      setIsTimerRunning(false);
      setOtp("");
      setOpenOtpModal(false);
      setOpenSummaryModal(true);
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/class-attendance?lecture_id=${lectureId}&time_table_id=${timeTableId}`
        );

        const { class_details, attendance_statistics, students } =
          response.data;

        setClassDetails(class_details);
        setStatistics(attendance_statistics);
        setAttendanceData(
          students.map((student) => ({
            id: student.student_id,
            student: student.full_name,
            present: student.attendance_status === "present",
            daysAbsent: student.days_absent,
            percentage: student.attendance_percentage,
            zohoNo: student.zoho_no,
            email: student.email,
            phone: student.phone_number,
          }))
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setLoading(false);
      }
    };

    if (lectureId && timeTableId) {
      setInterval(() => {
        fetchAttendanceData();
      }, 50000);
    }
  }, [lectureId, timeTableId]);

  const toggleAttendance = async (id, status) => {
    try {
      // You would implement the API call to update attendance here
      await axios.post("http://localhost:8000/api/update-attendance", {
        student_id: id,
        lecture_id: lectureId,
        time_table_id: timeTableId,
        status: status ? "present" : "absent",
      });

      setAttendanceData((prevData) =>
        prevData.map((student) =>
          student.id === id ? { ...student, present: status } : student
        )
      );
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  const generateOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/generate-otp",
        {
          lecture_id: lectureId,
          time_table_id: timeTableId,
        }
      );
      const { otp: generatedOtp, expires_at } = response.data;
      setOtp(generatedOtp);
      setExpiresAt(new Date(expires_at));
      setIsTimerRunning(true);
    } catch (error) {
      console.error("Error generating OTP:", error);
    }
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning && expiresAt) {
      interval = setInterval(() => {
        const now = new Date();
        const remainingTime = expiresAt - now;

        if (remainingTime <= 0) {
          setTimeLeft("OTP expired");
          clearInterval(interval);
        } else {
          const minutes = Math.floor(remainingTime / 60000);
          const seconds = Math.floor((remainingTime % 60000) / 1000);
          setTimeLeft(`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, expiresAt]);

  const generateQrCodeUrl = () => {
    if (otp && lectureId && timeTableId) {
      const params = new URLSearchParams({
        otp_value: otp,
        lecture_id: lectureId,
        time_table_id: timeTableId
      });
      return `http://192.168.211.129:3000/qr-attendance?${params.toString()}`;
    }
    return "";
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#003B87",
          p: 2,
          color: "white",
        }}
      >
        <Box>
          <Typography variant="h5">ATTENDANCE</Typography>
          <Typography variant="subtitle1">
            {classDetails?.department}
          </Typography>
          <Typography variant="subtitle2">
            {classDetails?.classroom} - Batch {classDetails?.batch}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ textAlign: "right" }}>
            <Typography>Present: {statistics?.present_students}</Typography>
            <Typography>Absent: {statistics?.absent_students}</Typography>
            <Typography>Total: {statistics?.total_students}</Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              setOpenOtpModal(true);
              generateOtp();
            }}
            sx={{
              bgcolor: "#5B8AD9",
              "&:hover": {
                bgcolor: "#4A7BC7",
              },
            }}
          >
            OTP
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#B31B1B" }}>
              <TableCell sx={{ color: "white" }}>Zoho No</TableCell>
              <TableCell sx={{ color: "white" }}>Student</TableCell>
              <TableCell sx={{ color: "white" }}>Present</TableCell>
              <TableCell sx={{ color: "white" }}>Absent</TableCell>
              <TableCell sx={{ color: "white" }}>Days Absent</TableCell>
              <TableCell sx={{ color: "white" }}>Percentage</TableCell>
              <TableCell sx={{ color: "white" }}>Contact</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:nth-of-type(even)": { bgcolor: "#f5f5f5" } }}
              >
                <TableCell>{row.zohoNo}</TableCell>
                <TableCell onClick={() => navigate(`/StudentproAttendance?str_id=${row.id}`)}>{row.student}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => toggleAttendance(row.id, true)}
                    sx={{
                      p: 0.5,
                      bgcolor: row.present
                        ? "rgba(0, 255, 0, 0.1)"
                        : "transparent",
                      "&:hover": { bgcolor: "rgba(0, 255, 0, 0.2)" },
                    }}
                  >
                    <CheckIcon
                      sx={{
                        color: row.present ? "green" : "#ccc",
                        transition: "color 0.3s",
                      }}
                    />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => toggleAttendance(row.id, false)}
                    sx={{
                      p: 0.5,
                      bgcolor: !row.present
                        ? "rgba(255, 0, 0, 0.1)"
                        : "transparent",
                      "&:hover": { bgcolor: "rgba(255, 0, 0, 0.2)" },
                    }}
                  >
                    <CloseIcon
                      sx={{
                        color: !row.present ? "#d32f2f" : "#ccc",
                        transition: "color 0.3s",
                      }}
                    />
                  </IconButton>
                </TableCell>
                <TableCell>{row.daysAbsent}</TableCell>
                <TableCell
                  sx={{
                    color: row.percentage < 75 ? "#B31B1B" : "#000",
                  }}
                >
                  {row.percentage}%
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{row.email}</Typography>
                  <Typography variant="body2">{row.phone}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* OTP Modal */}
      <Dialog
        open={openOtpModal}
        onClose={() => setOpenOtpModal(false)}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2,
            position: "relative",
          },
        }}
      >
        <Box sx={{ position: "absolute", right: 8, top: 8 }}>
          <Button
            onClick={() => setOpenOtpModal(false)}
            variant="contained"
            sx={{
              bgcolor: "#5B8AD9",
              "&:hover": { bgcolor: "#4A7BC7" },
            }}
          >
            CLOSE
          </Button>
        </Box>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            p: 4,
            minWidth: 400,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <QRCodeSVG value={generateQrCodeUrl()} size={256} level="H" />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                ml: 4,
              }}
            >
              <Typography variant="h3">
                {new Date().toLocaleTimeString()}
              </Typography>
              <Button
                variant="contained"
                color="error"
                sx={{ minWidth: 100 }}
                onClick={handleStopSession}
              >
                STOP
              </Button>
              <Box
                sx={{
                  border: "2px solid #000",
                  p: 2,
                  mt: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6">OTP</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {otp}
                </Typography>
              </Box>
            </Box>
          </Box>

          {timeLeft && (
            <Typography sx={{ mt: 2 }}>Time remaining: {timeLeft}</Typography>
          )}
        </DialogContent>
      </Dialog>
      

      {/* Summary Modal */}
      <Dialog
        open={openSummaryModal}
        onClose={() => setOpenSummaryModal(false)}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ bgcolor: "#003B87", color: "white" }}>
          Attendance Summary
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {/* Class Details */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Class Details
            </Typography>
            <Typography>Department: {classDetails?.department}</Typography>
            <Typography>Classroom: {classDetails?.classroom}</Typography>
            <Typography>Batch: {classDetails?.batch}</Typography>
            <Typography>Date: {new Date().toLocaleDateString()}</Typography>
          </Box>

          {/* Statistics */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Attendance Statistics
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
                mb: 2,
              }}
            >
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#e8f5e9" }}>
                <Typography variant="h4" color="success.main">
                  {statistics?.present_students}
                </Typography>
                <Typography>Present</Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#ffebee" }}>
                <Typography variant="h4" color="error.main">
                  {statistics?.absent_students}
                </Typography>
                <Typography>Absent</Typography>
              </Paper>
            </Box>
            <Typography>
              Total Students: {statistics?.total_students}
            </Typography>
            <Typography>
              Attendance Percentage:{" "}
              {(
                (statistics?.present_students / statistics?.total_students) *
                100
              ).toFixed(1)}
              %
            </Typography>
          </Box>

          {/* Absent Students List */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Absent Students
            </Typography>
            {attendanceData
              .filter((student) => !student.present)
              .map((student) => (
                <Paper
                  key={student.id}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    bgcolor: "#f5f5f5",
                  }}
                >
                  <Typography variant="subtitle1">{student.student}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Zoho No: {student.zohoNo} | Total Days Absent:{" "}
                    {student.daysAbsent}
                  </Typography>
                </Paper>
              ))}
          </Box>

          {/* Actions */}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}
          >
            <Button
              variant="contained"
              onClick={() => {
                // You could add functionality to download/export the summary
                console.log("Download summary");
              }}
              sx={{
                bgcolor: "#5B8AD9",
                "&:hover": { bgcolor: "#4A7BC7" },
              }}
            >
              Download Summary
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpenSummaryModal(false)}
            >
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AttendanceTable;
