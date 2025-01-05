import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileCard = ({ student }) => (
  <div style={styles.profileCard}>
    <h2 style={styles.profileName}>{student.first_name} {student.middle_name} {student.last_name}</h2>
    <p><strong>Student ID:</strong> {student.id}</p>
    <p><strong>Zoho Number:</strong> {student.zoho_no}</p>
    <p><strong>NIC Number:</strong> {student.nic_no}</p>
    <p><strong>Department:</strong> {student.department}</p>
    <p><strong>Batch:</strong> {student.batch}</p>
    <p><strong>Email:</strong> {student.email}</p>
    <p><strong>Phone:</strong> {student.phone_number}</p>
    <p><strong>Address:</strong> {student.address}, {student.city}, {student.province}, {student.postal_code}, {student.country}</p>
    <p><strong>Date of Birth:</strong> {student.date_of_birth || "Not Provided"}</p>
  </div>
);

const AttendanceTable = ({ attendance }) => (
  <table style={styles.attendanceTable}>
    <thead>
      <tr>
        <th style={styles.tableHeader}>ID</th>
        <th style={styles.tableHeader}>Lecture ID</th>
        <th style={styles.tableHeader}>Attendance At</th>
        <th style={styles.tableHeader}>Time Table ID</th>
        <th style={styles.tableHeader}>OTP Used</th>
        <th style={styles.tableHeader}>Verification Type</th>
        <th style={styles.tableHeader}>Status</th>
      </tr>
    </thead>
    <tbody>
      {attendance.map((record) => (
        <tr key={record.id}>
          <td style={styles.tableCell}>{record.id}</td>
          <td style={styles.tableCell}>{record.lecture_id}</td>
          <td style={styles.tableCell}>{new Date(record.attendance_at).toLocaleString()}</td>
          <td style={styles.tableCell}>{record.time_table_id}</td>
          <td style={styles.tableCell}>{record.otp_used}</td>
          <td style={styles.tableCell}>{record.verification_type}</td>
          <td style={styles.tableCell}>{record.status}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const StudentProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const searchParams = new URLSearchParams(window.location.search);
  const stu_Id = searchParams.get("str_id");

  const fetchProfile = async () => {
    if (!stu_Id) {
      setError("Student ID is missing from the URL.");
      return;
    }

    try {
      setError(null);
      const response = await axios.post(`http://127.0.0.1:8000/api/attendance/${stu_Id}`);
      setProfileData(response.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : "An error occurred.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [stu_Id]);

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (!profileData) {
    return <div style={styles.loading}>Loading...</div>;
  }

  const { student, attendance } = profileData;

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>Student Profile</h1>
      <div style={styles.profileContainer}>
        <ProfileCard student={student} />
        <h2 style={styles.attendanceTitle}>Attendance Records</h2>
        <AttendanceTable attendance={attendance} />
      </div>
    </div>
  );
};

export default StudentProfile;

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: 0,
    backgroundColor: '#f4f4f9',
    maxWidth: '900px',
    margin: '40px auto',
    padding: '20px',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  profileCard: {
    width: '100%',
    background: '#fafafa',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease-in-out',
  },
  profileName: {
    margin: '0',
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  attendanceTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  tableHeader: {
    background: '#f5f5f5',
    color: '#333',
    padding: '12px',
    textAlign: 'center',
    fontWeight: '600',
    border: '1px solid #ddd',
  },
  tableCell: {
    border: '1px solid #ddd',
    padding: '10px',
    textAlign: 'center',
  },
  attendanceTitle: {
    fontSize: '20px',
    marginBottom: '10px',
    color: '#333',
    fontWeight: '500',
  },
  pageTitle: {
    fontSize: '30px',
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
    fontWeight: '700',
  },
  error: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: 'red',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: '#777',
  },
};
