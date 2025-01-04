import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';

const PaymentPage = () => {
  const [studentId, setstudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [zohoNo, setZohoNo] = useState('');
  const [department, setDepartment] = useState('');
  const [batch, setBatch] = useState('');
  const [totalPayment, setTotalPayment] = useState('');
  const [paidPayment, setPaidPayment] = useState('');
  const [arrearsPayment, setArrearsPayment] = useState('');
  const [outstandingPayment, setOutstandingPayment] = useState('');
  const [amount, setAmount] = useState('');

  const fetchStudentDetails = async (zohoorNic) => {

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/payment/getStudentDetails/${zohoorNic}`);

      if (response.ok) {

        const data = await response.json();

        const { studentId, studentName, zohoNo, department, batch, totalPayment, paidPayment, arrearsPayment, outstandingPayment } = data;

        setstudentId(studentId);
        setStudentName(studentName);
        setZohoNo(zohoNo);
        setDepartment(department);
        setBatch(batch);
        setTotalPayment(totalPayment);
        setPaidPayment(paidPayment);
        setArrearsPayment(arrearsPayment);
        setOutstandingPayment(outstandingPayment);

      } else {
        handleError();
      }
    } catch (error) {
      handleError();
    }
  };

  const handleError = () => {
    setStudentName('');
    setZohoNo('');
    setDepartment('');
    setBatch('');
    setTotalPayment('');
    setPaidPayment('');
    setArrearsPayment('');
    setOutstandingPayment('');
  };

  const handleZohoChange = (e) => {
    const zohoorNic = e.target.value;
    fetchStudentDetails(zohoorNic);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentId) {
      alert('Please Search Again!')
      return;
    }
    else if (!amount || amount == 0) {
      alert('Please Enter Valid Amount!')
      return;
    }

    try {
      const formData = {
        studentId: studentId,
        amount: amount,
      };

      const response = await fetch('http://127.0.0.1:8000/api/payment/payPayment', {
        method: 'POST',
        body: JSON.stringify({ formData }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (

    <div>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', padding: '10px', gap: '10px', width: '100%', }}>
        <Typography color="BLACK" sx={{ fontSize: 20 }}>
          Payment
        </Typography>
        <hr style={{ border: '2px solid rgb(232, 232, 234)', marginTop: "1px", width: "100%" }} />
        <Typography color="BLACK" sx={{ fontSize: 20 }}>
          Enter Zoho No / NIC No
        </Typography>

        <div style={{
          position: 'relative',
          width: '40%',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          marginTop: '40px',
          marginLeft: "-14%"
        }}>
          <input
            type="text"
            placeholder="Search for ...."
            onChange={handleZohoChange}
            style={{
              width: '100%',
              padding: '12px 20px 12px 40px',
              fontSize: '16px',
              borderRadius: '30px',
              border: '1px solid #ccc',
              backgroundColor: '#f4f4f9',
              transition: 'all 0.3s ease',
              outline: 'none',
              boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#0057d8';
              e.target.style.boxShadow = '0 0 2px rgba(0, 87, 216, 0.5)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ccc';
              e.target.style.boxShadow = '0 2px 2px rgba(0, 0, 0, 0.1)';
            }}
          />
          <span
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '18px',
              color: '#888',
            }}
          >
            🔍
          </span>
        </div>



      </Box>

      {/* New Box for the form */}
      <form onSubmit={handleSubmit} >
        <Box
          sx={{
            padding: '20px',
            marginTop: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Student Name"
                value={studentName}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField label="Zoho No" InputProps={{
                readOnly: true,
              }} value={zohoNo} variant="outlined" fullWidth />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField label="Department" InputProps={{
                readOnly: true,
              }} value={department} variant="outlined" fullWidth />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField label="Batch" InputProps={{
                readOnly: true,
              }} value={batch} variant="outlined" fullWidth />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField label="Total Payment" InputProps={{
                readOnly: true,
              }} value={totalPayment} variant="outlined" fullWidth />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField label="Paid Payment" InputProps={{
                readOnly: true,
              }} value={paidPayment} variant="outlined" fullWidth />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField label="Arrears Payment" InputProps={{
                readOnly: true,
              }} value={arrearsPayment} variant="outlined" fullWidth />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField label="Outstanding Payment" InputProps={{
                readOnly: true,
              }} value={outstandingPayment} variant="outlined" fullWidth />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField label="Amount" onChange={(e) => setAmount(e.target.value)} value={amount} variant="outlined" fullWidth />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField label="Student Id" InputProps={{
                readOnly: true,
              }} value={studentId} style={{ display: 'none' }} variant="outlined" fullWidth />
            </Grid>
          </Grid>

          <Box sx={{ marginTop: '20px', display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
            <Button variant="outlined" sx={{ color: 'white', bgcolor: '#22BA97' }}>
              Reset
            </Button>
          </Box>
        </Box>
      </form>
    </div>
  );
};


export default PaymentPage;
