import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import QrScanner from "react-qr-scanner";

const StudentAttendance = () => {
  const [searchParams] = useSearchParams();
  const [otpValue, setOtpValue] = useState("");
  const [qrScanData, setQrScanData] = useState(null);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const studentId = searchParams.get("student_id");
  const timeTableId = searchParams.get("time_table_id");
  const lectureId = searchParams.get("lecture_id");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const payload = {
      otp_value: qrScanData || otpValue,
      student_id: parseInt(studentId),
      time_table_id: parseInt(timeTableId),
      lecture_id: parseInt(lectureId),
    };

    try {
      const response = await fetch(
        qrScanData
          ? `${qrScanData}&student_id=${studentId}`
          : "http://127.0.0.1:8000/api/verify-otp",
        {
          method: qrScanData ? "GET" : "POST",
          headers: { "Content-Type": "application/json" },
          body: qrScanData ? null : JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Verify Attendance</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="otp" style={{ display: "block", marginBottom: "5px" }}>
            Enter OTP:
          </label>
          <input
            id="otp"
            type="text"
            value={otpValue}
            onChange={(e) => setOtpValue(e.target.value)}
            required={!qrScanData}
            disabled={!!qrScanData}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
        {showQrScanner && (
          <div style={{ marginBottom: "10px" }}>
            <QrScanner
              delay={300}
              onError={(error) => console.error(error)}
              onScan={(data) => {
                if (data) {
                  setQrScanData(data.text);
                  setShowQrScanner(false);
                }
              }}
              style={{ width: "100%" }}
            />
          </div>
        )}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Submit
        </button>
      </form>
      {qrScanData && (
        <p style={{ color: "blue", marginTop: "10px" }}>
          Scanned QR Data: {qrScanData}
        </p>
      )}
      {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default StudentAttendance;
