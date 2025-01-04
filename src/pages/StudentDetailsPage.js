import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Button, Box ,Dialog, DialogTitle, DialogContent, DialogActions,Typography,Grid,Paper} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';




const StudentDetailsPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);


  const [open, setOpen] = useState(false);

  const handleView = (student) => {
    setSelectedStudent(student);
    console.log(student);
    
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStudent(null);
  };

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/getstudents')
      .then(response => {
        setStudents(response.data.students);
      })
      .catch(error => {
        console.error("There was an error fetching the students data!", error);
      });
  }, []);
  // ////////////////////////////////////////////////////////////////////////////////
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        // Make the DELETE request and capture the response
        const response = await axios.delete(`http://127.0.0.1:8000/api/students/${id}`);
  
        // Log the response to check what you're getting
        console.log('Response from API:', response);
  
        if (response.data && response.data.message) {
          alert(response.data.message

          ); // Show the response message from the backend
        }
  
        // Remove the student from the state
        setStudents((prevStudents) => prevStudents.filter(student => student.id !== id));
  
      } catch (error) {
        // Log the error to debug it
        console.error('Error deleting student:', error.response ? error.response.data : error);
        alert('Failed to delete student');
      }
    }
  };
  // ////////////////////////////////////////////////////////////////////////////////
  const navigate = useNavigate();
  
  // ////////////////////////////////////////////////////////////////////////////////

  return (
      <Box>

       {/* <Button variant="contained" color="primary" sx={{ marginRight: '20px' }} disabled>Add Expense +</Button> */}
       <Box sx={{ marginBottom: '35px', mt: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button variant="outlined" color="secondary" sx={{ marginRight: '20px','&:hover': { backgroundColor: '#650D70', color: 'white', borderColor: '#650D70', },}}>
          Copy
        </Button>

        <Button variant="outlined" color="warning" sx={{ marginRight: '20px', '&:hover': { backgroundColor: '#EEA827', color: 'white', borderColor: '#EEA827', }, }}>
          CSV
        </Button>

        <Button variant="outlined" color="success" sx={{ marginRight: '20px', '&:hover': { backgroundColor: '#11440D', color: 'white', borderColor: '#11440D',},}} >
          Excel
        </Button>

        <Button variant="outlined" color="error" sx={{ '&:hover': { backgroundColor: '#BD0D5F', color: 'white', borderColor: '#BD0D5F',},}} >
          Print
        </Button>
      </Box>


      <Box>
      <label htmlFor="search-box" style={{ marginRight: '10px', fontSize: '14px', fontWeight: '500', color: '#555', display: 'inline-block', verticalAlign: 'middle', }}>
  Search:
</label>
<input id="search-box" type="text" placeholder="Search..." style={{ padding: '10px 15px', width: '250px', borderRadius: '25px', border: '2px solid #E0E0E0', fontSize: '16px', outline: 'none', backgroundColor: '#f9f9f9', color: '#333', transition: 'all 0.3s ease',}}onFocus={(e) => e.target.style.borderColor = '#007BFF'} onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
/>



      </Box>
    </Box>

      
      <TableContainer sx={{ borderRadius: '10px', overflow: 'hidden'}}>
  <Table>
    <TableHead sx={{ backgroundColor: '#3498DB' }}>
      <TableRow>
        <TableCell sx={{ width: '12%', textAlign: 'center' }}>Student Name</TableCell>
        <TableCell sx={{ width: '12%', textAlign: 'center' }}>Course</TableCell>
        <TableCell sx={{ width: '12%', textAlign: 'center' }}>Email</TableCell>
        <TableCell sx={{ width: '12%', textAlign: 'center' }}>Contact No</TableCell>
        <TableCell sx={{ width: '40%', textAlign: 'center'}}>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
    {students.map(student => (
        <TableRow  key={student.id}>
          <TableCell sx={{ width: '22%', textAlign: 'center' }}>{student.first_name}</TableCell>
          <TableCell sx={{ width: '22%', textAlign: 'center' }}>
  {student.name_of_course?.course_name || 'N/A'}
</TableCell>

          <TableCell sx={{ width: '22%', textAlign: 'center' }}>{student.email}</TableCell>
          <TableCell sx={{ width: '22%', textAlign: 'center' }}>{student.phone_number}</TableCell>
          <TableCell sx={{ width: '30%', textAlign: 'center' }}>
  <Box sx={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
  <Button
  variant="outlined"
  color="warning"
  sx={{ backgroundColor: '#EEA827', color: 'black' }}
  onClick={() => navigate('/add-student', { state: { student } })}
>
  Edit
</Button>
    <Button
      variant="outlined"
      color="error"
      sx={{ backgroundColor: '#F54242', color: 'white' }}
      onClick={() => handleDelete(student.id)}

    >
      Delete
    </Button>
    <Button
      variant="outlined"
      color="error"
      sx={{ backgroundColor: '#4C9E75', color: 'white' }}
      onClick={() => handleView(student)}
    >
      View
    </Button>
  </Box>
</TableCell>

        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

<Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
  <DialogTitle sx={{ backgroundColor: '#1976d2', color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Student Details</DialogTitle>
  <DialogContent sx={{ backgroundColor: '#f5f5f5', padding: '20px' }}>
    {selectedStudent && (
        <Box sx={{ padding: 3 }}>
        <Paper sx={{ padding: 3 }}>
          <Typography variant="h4" gutterBottom>
            Student Details
          </Typography>
  
          <Grid container spacing={3}>
            {/* Student Basic Information */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" color="text.secondary">
                <strong>First Name:</strong> {selectedStudent.first_name || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Middle Name:</strong> {selectedStudent.middle_name || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Last Name:</strong> {selectedStudent.last_name || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>DOB:</strong> {selectedStudent.date_of_birth || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Address:</strong> {selectedStudent.email || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Phone:</strong> {selectedStudent.phone_number || 'N/A'}
              </Typography>
            </Grid>
  
            {/* Address Information */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" color="text.secondary">
                <strong>Address:</strong> {selectedStudent.address || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Street AddressLine:</strong> {selectedStudent.address_line  || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>City:</strong> {selectedStudent.city || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Province:</strong> {selectedStudent.province || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>NIC:</strong> {selectedStudent.nic_number || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Postal Code:</strong> {selectedStudent.postal_code || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Country:</strong> {selectedStudent.country || 'N/A'}
              </Typography>
            </Grid>
  
            {/* Course Information */}
            <Grid item xs={12} sm={6}>
            <Typography variant="body1" color="text.secondary">
                <strong>Preferred Mode:</strong> {selectedStudent.name_of_course?.preferred_mode || 'N/A'}
              </Typography>
            <Typography variant="body1" color="text.secondary">
                <strong>Program Applied For:</strong> {selectedStudent.name_of_course?.program_applied_for || 'N/A'}
              </Typography>
            <Typography variant="body1" color="text.secondary">
                <strong>Student Number:</strong> {selectedStudent.name_of_course?.student_number || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Course Name:</strong> {selectedStudent.name_of_course?.course_name || 'N/A'}
              </Typography>
              
            </Grid>
  
            {/* Emergency Contact Information */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" color="text.secondary">
                <strong>Emergency Contact First name :</strong> {selectedStudent.emergency_contact?.first_name || 'N/A'} 
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Emergency Contact Last name:</strong> {selectedStudent.emergency_contact?.last_name || ''}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Relationship:</strong> {selectedStudent.emergency_contact?.relationship || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Address:</strong> {selectedStudent.emergency_contact?.address || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Address Line:</strong> {selectedStudent.emergency_contact?.address_line || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>City:</strong> {selectedStudent.emergency_contact?.city || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Province:</strong> {selectedStudent.emergency_contact?.province || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Postal Code:</strong> {selectedStudent.emergency_contact?.postal_code || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Emergency Contact Phone:</strong> {selectedStudent.emergency_contact?.phone_number || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Emergency Contact Email:</strong> {selectedStudent.emergency_contact?.email || 'N/A'}
              </Typography>
            </Grid>
  
            {/* Qualifications */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" color="text.secondary">
                <strong>O/L Exam Name:</strong> {selectedStudent.qualifications?.olexam || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Selected O/L File:</strong> {selectedStudent.qualifications?.olpath || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>A/L Exam Name:</strong> {selectedStudent.qualifications?.alexam || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Selected A/L File:</strong> {selectedStudent.qualifications?.alpath || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Exam/Employment Name:</strong> {selectedStudent.other_qualifications?.qualifications || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Qualifications Statement:</strong> {selectedStudent.other_qualifications?.qualifications_line || 'N/A'}
              </Typography>
            </Grid>
  
            {/* Source of Information */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" color="text.secondary">
                <strong>Newspapers Advertisement:</strong> {selectedStudent.applicant_checklist?.newspaper || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Seminar/Webinar:</strong> {selectedStudent.applicant_checklist?.seminar || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Social Media:</strong> {selectedStudent.applicant_checklist?.social_media || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Open Events:</strong> {selectedStudent.applicant_checklist?.open_events || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Other Sources:</strong> {selectedStudent.applicant_checklist?.other || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Radio:</strong> {selectedStudent.applicant_checklist?.radio || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>BCAS Website:</strong> {selectedStudent.applicant_checklist?.bcas_website || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Leaflets:</strong> {selectedStudent.applicant_checklist?.leaflets || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Student Review:</strong> {selectedStudent.applicant_checklist?.student_review || 'N/A'}
              </Typography>
            </Grid>
  
            {/* Files and Documents */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" color="text.secondary">
                <strong>Selected NIC File:</strong> {selectedStudent.student_nic?.nic || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Selected DOB Certificate:</strong> {selectedStudent.student_date_of_birth_certificate?.date_of_birth_certificate || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Selected Image File:</strong> {selectedStudent.student_image?.image || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Course Reason:</strong> {selectedStudent.personal_statement?.course_reason || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>self:</strong> {selectedStudent.personal_statement?.self || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Parents:</strong> {selectedStudent.personal_statement?.parents || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Other:</strong> {selectedStudent.personal_statement?.other || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Spouser:</strong> {selectedStudent.personal_statement?.spouse || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Spouser:</strong> {selectedStudent.personal_statement?.spouse || 'N/A'}
              </Typography>
            </Grid>
  
            {/* Financial Information */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" color="text.secondary">
                <strong>Name:</strong> {selectedStudent.who_will_pay?.name || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Address:</strong> {selectedStudent.who_will_pay?.address || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Official Address:</strong> {selectedStudent.who_will_pay?.address_official || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>City:</strong> {selectedStudent.who_will_pay?.city || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Province:</strong> {selectedStudent.who_will_pay?.Province || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Postal Code :</strong> {selectedStudent.who_will_pay?.postal_code  || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Country :</strong> {selectedStudent.who_will_pay?.country || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Phone Number :</strong> {selectedStudent.who_will_pay?.phone_number || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Email:</strong> {selectedStudent.who_will_pay?.email || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Scholarship:</strong> {selectedStudent.who_will_pay?.scholarship || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Scholarship:</strong> {selectedStudent.who_will_pay?.scholarship || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Payment Status:</strong> {selectedStudent.admin_use?.status || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Student Number:</strong> {selectedStudent.admin_use?.student_number || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Total Course Fee:</strong> {selectedStudent.admin_use?.total_fees || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Registration Fee:</strong> {selectedStudent.admin_use?.registration_fees || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Installments:</strong> {selectedStudent.admin_use?.installment || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Discount:</strong> {selectedStudent.admin_use?.discount || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Zoho Number:</strong> {selectedStudent.zoho_no || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Join Date:</strong> {selectedStudent.admin_use?.join_date || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>End Date:</strong> {selectedStudent.admin_use?.end_date || 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    )}
  </DialogContent>
  <DialogActions sx={{ backgroundColor: '#1976d2' }}>
    <Button onClick={handleClose} sx={{ color: '#fff' }}>Close</Button>
  </DialogActions>
</Dialog>



    </Box>
  );
};

export default StudentDetailsPage;