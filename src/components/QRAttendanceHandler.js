import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const QRAttendanceHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('QRAttendanceHandler rendered');
    const handleQRAttendance = async () => {
      // Get QR parameters from URL
      const params = new URLSearchParams(window.location.search);
      console.log('URL Search Params:', params.toString());
      const qrData = {
        otp_value: params.get('otp_value'),
        lecture_id: params.get('lecture_id'),
        time_table_id: params.get('time_table_id')
      };
      console.log('QR Data:', qrData); // Log the parsed parameters
      // Check if all required parameters are present
      if (!qrData.otp_value || !qrData.lecture_id || !qrData.time_table_id) {
        if (!qrData.otp_value) {
            alert('OTP value is missing'.params.toString());
            return;
          }
          if (!qrData.lecture_id) {
            alert('Lecture ID is missing');
            return;
          }
          if (!qrData.time_table_id) {
            alert('Time Table ID is missing');
            return;
          }
          
        return;
      }

      const userId = localStorage.getItem('userid');

      if (!userId) {
        // If user is not logged in, redirect to login page with return URL
        const currentUrl = encodeURIComponent(window.location.href);
        navigate(`/login?returnUrl=${currentUrl}`);
        return;
      }

      try {
        // Mark attendance
        const response = await fetch(`http://192.168.211.129:8080/api/verify-qr?${new URLSearchParams({
          ...qrData,
          student_id: userId
        }).toString()}`);

        const data = await response.json();

        if (response.ok) {
          alert('Attendance marked successfully!');
          navigate('/dashboard'); // Or wherever you want to redirect after success
        } else {
          alert(data.message || 'Failed to mark attendance');
        }
      } catch (error) {
        console.error('Error marking attendance:', error);
        alert('Failed to mark attendance. Please try again.');
      }
    };

    handleQRAttendance();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Processing Attendance</h1>
        <p className="text-center text-gray-600">Please wait while we process your attendance...</p>
      </div>
    </div>
  );
};

export default QRAttendanceHandler;