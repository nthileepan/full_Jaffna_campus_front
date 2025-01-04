import React, { useState, useEffect } from 'react';
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
  IconButton as CloseIconButton
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";

const AttendanceTable = () => {
  const [attendanceData, setAttendanceData] = useState([
    { id: 1, student: 'S.Thileephan', present: true, daysAbsent: '00', percentage: 80 },
    { id: 2, student: 'K.Abinayan', present: true, daysAbsent: '13', percentage: 10 },
    { id: 3, student: 'A.Amala', present: true, daysAbsent: '01', percentage: 76 },
    { id: 4, student: 'S.Thileephan', present: true, daysAbsent: '02', percentage: 80 },
    { id: 5, student: 'S.Thileephan', present: true, daysAbsent: '02', percentage: 80 }
  ]);

  // OTP related states
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [lectureId] = useState(1);
  const [timeTableId] = useState(5);

  const toggleAttendance = (id, status) => {
    setAttendanceData(prevData => 
      prevData.map(student => 
        student.id === id ? { ...student, present: status } : student
      )
    );
  };

  const generateOtp = async () => {
    try {
      const response = await axios.post(
        "http://192.168.1.7:8000/api/generate-otp",
        {
          lecture_id: lectureId,
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
      const attendanceParams = encodeURIComponent(
        JSON.stringify({
          otp_value: otp,
          lecture_id: lectureId,
          time_table_id: timeTableId,
        })
      );
      return `http://192.168.1.7:3000/login?attendance=${attendanceParams}`;
    }
    return "";
  };

  const handleOtpClick = () => {
    setOpenOtpModal(true);
    generateOtp();
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        bgcolor: '#003B87',
        p: 2,
        color: 'white'
      }}>
        <Typography variant="h5">ATTENDANCE</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography>09:56</Typography>
          <Button 
            variant="contained" 
            onClick={handleOtpClick}
            sx={{ 
              bgcolor: '#5B8AD9',
              '&:hover': {
                bgcolor: '#4A7BC7'
              }
            }}
          >
            OTP
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#B31B1B' }}>
              <TableCell sx={{ color: 'white' }}>Student</TableCell>
              <TableCell sx={{ color: 'white' }}>Present</TableCell>
              <TableCell sx={{ color: 'white' }}>Absent</TableCell>
              <TableCell sx={{ color: 'white' }}>No of days Absent</TableCell>
              <TableCell sx={{ color: 'white' }}>Percentage</TableCell>
              <TableCell sx={{ color: 'white' }}>Extra</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData.map((row) => (
              <TableRow key={row.id} sx={{ '&:nth-of-type(even)': { bgcolor: '#f5f5f5' } }}>
                <TableCell>{row.student}</TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => toggleAttendance(row.id, true)}
                    sx={{ 
                      p: 0.5,
                      bgcolor: row.present ? 'rgba(0, 255, 0, 0.1)' : 'transparent',
                      '&:hover': { bgcolor: 'rgba(0, 255, 0, 0.2)' }
                    }}
                  >
                    <CheckIcon sx={{ 
                      color: row.present ? 'green' : '#ccc',
                      transition: 'color 0.3s'
                    }} />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => toggleAttendance(row.id, false)}
                    sx={{ 
                      p: 0.5,
                      bgcolor: !row.present ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
                      '&:hover': { bgcolor: 'rgba(255, 0, 0, 0.2)' }
                    }}
                  >
                    <CloseIcon sx={{ 
                      color: !row.present ? '#d32f2f' : '#ccc',
                      transition: 'color 0.3s'
                    }} />
                  </IconButton>
                </TableCell>
                <TableCell>{row.daysAbsent}</TableCell>
                <TableCell sx={{ 
                  color: row.percentage < 75 ? '#B31B1B' : '#000'
                }}>
                  {row.percentage}%
                </TableCell>
                <TableCell></TableCell>
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
            position: 'relative'
          }
        }}
      >
        <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
          <Button 
            onClick={() => setOpenOtpModal(false)}
            variant="contained"
            sx={{ 
              bgcolor: '#5B8AD9',
              '&:hover': { bgcolor: '#4A7BC7' }
            }}
          >
            CLOSE
          </Button>
        </Box>
        
        <DialogContent sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 3,
          p: 4,
          minWidth: 400
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <QRCodeSVG value={generateQrCodeUrl()} size={256} level="H" />
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              ml: 4
            }}>
              <Typography variant="h3">09:56</Typography>
              <Button 
                variant="contained" 
                color="error"
                sx={{ minWidth: 100 }}
              >
                STOP
              </Button>
              <Box sx={{ 
                border: '2px solid #000',
                p: 2,
                mt: 2,
                textAlign: 'center'
              }}>
                <Typography variant="h6">OTP</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {otp || '12eF3'}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          {timeLeft && (
            <Typography sx={{ mt: 2 }}>
              Time remaining: {timeLeft}
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AttendanceTable;