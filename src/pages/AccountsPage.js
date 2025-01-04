import React from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, Grid } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Person from '@mui/icons-material/Person';
import AccessTime from '@mui/icons-material/AccessTime';
import Money from '@mui/icons-material/Money';
import Group from '@mui/icons-material/Group';
import Event from '@mui/icons-material/Event';
import Security from '@mui/icons-material/Security';
import { Assessment } from '@mui/icons-material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, } from 'recharts';


const AccountsPage = () => {
  return (

    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,


        // maxWidth: 'fit-content', 
        // marginLeft: 'auto', 
        // marginRight: 'auto',
      }}
    >
      <Box
        sx={{
          padding: 2,
          borderRadius: 1,
          width: '50%',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // Align content to the left
          gap: 2,
          // bgcolor:"blue"
        }}
      >
        {/* Account Statement Heading */}
        <Typography
          variant="h6"
          sx={{
            color: 'black',
            bgcolor: '#91F391',
            width: '250px',
            padding: 1,
            borderRadius: 5,
            fontSize: 25,
            textAlign: "center"
          }}
        >
          Account Statement
        </Typography>

        {/* Date Pickers and Analyze Button */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center', // Centers items vertically
            justifyContent: 'center', // Centers items horizontally
            gap: 25, // Space between elements
            width: '105%',
            marginLeft: 10

            // bgcolor: "red",
          }}
        >
          {/* Start Date */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{
                width: '250px',
                '& .MuiInputBase-root': {
                  height: '50px',
                  width: "350px",
                  borderRadius: 4,
                },
              }}
              label="Start Date"
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          {/* End Date */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{
                width: '250px',
                '& .MuiInputBase-root': {
                  height: '50px',
                  width: "350px",
                  borderRadius: 4,

                },
              }}
              label="End Date"
              renderInput={(params) => <TextField {...params} />}
              orientation='landscape'
            />
          </LocalizationProvider>

          {/* Analyze Button */}
          <Button variant="contained" sx={{ bgcolor: "black" }}>
            Analysis
          </Button>
        </Box>

      </Box>



      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          padding: '10px',
          gap: '10px',
          width: '100%',



        }}
      >
        <Card sx={{
          width: 330, height: 220, border: '1px solid #ccc', margin: '5px', position: 'relative', borderRadius: '13px', boxShadow: "none",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          backgroundColor: '#ffffff',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
          }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>

              <Box sx={{ display: 'flex', alignItems: 'center', position: 'absolute', top: 8, left: 0, right: 0, borderBottom: '1px solid #f0f0f0', }}>
                <Typography sx={{ color: "black", ml: 2, }}>No of Students</Typography>
              </Box>

              <Grid container style={{ marginTop: '30px', marginBottom: '10px' }}>
                <Grid container style={{ marginBottom: '20px' }}>
                  <Grid item xs={6}>
                    <Typography>Total Cost:</Typography>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: 'right' }}>
                    <Typography>0</Typography>
                  </Grid>
                </Grid>
                <Grid container style={{ marginBottom: '20px' }}>
                  <Grid item xs={6}>
                    <Typography>Shipping:</Typography>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: 'right' }}>
                    <Typography>0</Typography>
                  </Grid>
                </Grid>
                <Grid container style={{ marginBottom: '20px' }}>
                  <Grid item xs={6}>
                    <Typography>Discount:</Typography>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: 'right' }}>
                    <Typography>0</Typography>
                  </Grid>
                </Grid>
                <Grid container style={{ marginBottom: '20px' }}>
                  <Grid item xs={6}>
                    <Typography>Tax:</Typography>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: 'right' }}>
                    <Typography>0</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

        <Card sx={{
          width: 330, height: 220, border: '1px solid #ccc', margin: '5px', position: 'relative', borderRadius: '13px', boxShadow: "none",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          backgroundColor: '#ffffff',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
          }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>

              <Box sx={{ display: 'flex', alignItems: 'center', position: 'absolute', top: 8, left: 0, right: 0, borderBottom: '1px solid #f0f0f0', }}>
                <Typography sx={{ color: "black", ml: 2, }}>No of Students</Typography>
              </Box>

              <Grid container style={{ marginTop: '30px', marginBottom: '10px' }}>
                <Grid container style={{ marginBottom: '20px' }}>
                  <Grid item xs={6}>
                    <Typography>Total Cost:</Typography>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: 'right' }}>
                    <Typography>0</Typography>
                  </Grid>
                </Grid>
                <Grid container style={{ marginBottom: '20px' }}>
                  <Grid item xs={6}>
                    <Typography>Shipping:</Typography>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: 'right' }}>
                    <Typography>0</Typography>
                  </Grid>
                </Grid>
                <Grid container style={{ marginBottom: '20px' }}>
                  <Grid item xs={6}>
                    <Typography>Discount:</Typography>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: 'right' }}>
                    <Typography>0</Typography>
                  </Grid>
                </Grid>
                <Grid container style={{ marginBottom: '20px' }}>
                  <Grid item xs={6}>
                    <Typography>Tax:</Typography>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: 'right' }}>
                    <Typography>0</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

        <Card sx={{
          width: 330, height: 220, border: '1px solid #ccc', margin: '5px', position: 'relative', borderRadius: '13px', boxShadow: "none",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          backgroundColor: '#ffffff',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
          }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>

              <Box sx={{ display: 'flex', alignItems: 'center', position: 'absolute', top: 8, left: 0, right: 0, borderBottom: '1px solid #f0f0f0', }}>
                <Typography sx={{ color: "black", ml: 2, }}>No of Students</Typography>
              </Box>

              <Grid container style={{ marginTop: '30px', marginBottom: '10px' }}>
                <Grid container style={{ marginBottom: '20px' }}>
                  <Grid item xs={6}>
                    <Typography>Total Cost:</Typography>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: 'right' }}>
                    <Typography>0</Typography>
                  </Grid>
                </Grid>
                <Grid container style={{ marginBottom: '20px' }}>
                  <Grid item xs={6}>
                    <Typography>Shipping:</Typography>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: 'right' }}>
                    <Typography>0</Typography>
                  </Grid>
                </Grid>
                <Grid container style={{ marginBottom: '20px' }}>
                  <Grid item xs={6}>
                    <Typography>Discount:</Typography>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: 'right' }}>
                    <Typography>0</Typography>
                  </Grid>
                </Grid>
                <Grid container style={{ marginBottom: '20px' }}>
                  <Grid item xs={6}>
                    <Typography>Tax:</Typography>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: 'right' }}>
                    <Typography>0</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

        <Card sx={{
          width: 330, height: 220, border: '1px solid #ccc', margin: '5px', position: 'relative', borderRadius: '13px', boxShadow: "none",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          backgroundColor: '#ffffff',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
          }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>

              <Box sx={{ display: 'flex', alignItems: 'center', position: 'absolute', top: 8, left: 0, right: 0, borderBottom: '1px solid #f0f0f0', }}>
                <Typography sx={{ color: "black", ml: 2, }}>No of Students</Typography>
              </Box>

              <Grid container style={{ marginTop: '30px', marginBottom: '10px' }}>
                <Grid container style={{ marginBottom: '20px' }}>
                  <Grid item xs={6}>
                    <Typography>Total Cost:</Typography>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: 'right' }}>
                    <Typography>0</Typography>
                  </Grid>
                </Grid>
                <Grid container style={{ marginBottom: '20px' }}>
                  <Grid item xs={6}>
                    <Typography>Shipping:</Typography>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: 'right' }}>
                    <Typography>0</Typography>
                  </Grid>
                </Grid>
                <Grid container style={{ marginBottom: '20px' }}>
                  <Grid item xs={6}>
                    <Typography>Discount:</Typography>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: 'right' }}>
                    <Typography>0</Typography>
                  </Grid>
                </Grid>
                <Grid container style={{ marginBottom: '20px' }}>
                  <Grid item xs={6}>
                    <Typography>Tax:</Typography>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: 'right' }}>
                    <Typography>0</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}





      </Box>
    </Box>

  );
};

export default AccountsPage;