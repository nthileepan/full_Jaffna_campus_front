import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Button, Box, } from '@mui/material';
import AddBankModal from '../modals/AddBank';
import { useState, useEffect } from 'react';
import axios from 'axios';


const AddAccountPage = () => {

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/banks");
        const fetchedBanks = response.data.banks;

        setBanks(fetchedBanks);
        fetchBanks();

      } catch (error) {
        console.error("Error fetching bank data:", error);
      }
    };
    fetchBanks();
  }, []);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [banks, setBanks] = useState([]);

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <Box>

      <Button variant="contained" color="success" sx={{ marginRight: '20px' }} onClick={handleOpenModal}>Add Bank +</Button>

      <AddBankModal open={isModalOpen} handleClose={handleCloseModal} />

      <Box sx={{ marginBottom: '35px', mt: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button variant="outlined" color="secondary" sx={{ marginRight: '20px', '&:hover': { backgroundColor: '#650D70', color: 'white', borderColor: '#650D70', }, }}>
            Copy
          </Button>

          <Button variant="outlined" color="warning" sx={{ marginRight: '20px', '&:hover': { backgroundColor: '#EEA827', color: 'white', borderColor: '#EEA827', }, }}>
            CSV
          </Button>

          <Button variant="outlined" color="success" sx={{ marginRight: '20px', '&:hover': { backgroundColor: '#11440D', color: 'white', borderColor: '#11440D', }, }} >
            Excel
          </Button>

          <Button variant="outlined" color="error" sx={{ '&:hover': { backgroundColor: '#BD0D5F', color: 'white', borderColor: '#BD0D5F', }, }} >
            Print
          </Button>
        </Box>


        <Box>
          <label htmlFor="search-box" style={{ marginRight: '10px', fontSize: '14px', fontWeight: '500', color: '#555', display: 'inline-block', verticalAlign: 'middle', }}>
            Search:
          </label>
          <input id="search-box" type="text" placeholder="Search..." style={{ padding: '10px 15px', width: '250px', borderRadius: '25px', border: '2px solid #E0E0E0', fontSize: '16px', outline: 'none', backgroundColor: '#f9f9f9', color: '#333', transition: 'all 0.3s ease', }} onFocus={(e) => e.target.style.borderColor = '#007BFF'} onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
          />



        </Box>
      </Box>

      <TableContainer sx={{ borderRadius: '10px', overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#3498DB' }}>
            <TableRow>
              <TableCell sx={{ width: '25%', textAlign: 'center', fontWeight: 'bold', color: 'white' }}>NAME</TableCell>
              <TableCell sx={{ width: '10%', textAlign: 'center', fontWeight: 'bold', color: 'white' }}>ACCOUNT NO</TableCell>
              <TableCell sx={{ width: '15%', textAlign: 'center', fontWeight: 'bold', color: 'white' }}>OPENING BALANCE</TableCell>
              <TableCell sx={{ width: '10%', textAlign: 'center', fontWeight: 'bold', color: 'white' }}>UPDATE</TableCell>
              <TableCell sx={{ width: '15%', textAlign: 'center', fontWeight: 'bold', color: 'white' }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {banks.length > 0 ? (
              banks.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ textAlign: 'center' }}>{row.bankName}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{row.accountNo}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {row.openingBalance?.toLocaleString() || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{row.actionBy}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Button
                      variant="outlined"
                      color="warning"
                      sx={{
                        marginRight: '5px',
                        backgroundColor: '#EEA827',
                        color: 'black',
                        '&:hover': { backgroundColor: '#E08C27' },
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{
                        backgroundColor: '#F54242',
                        color: 'white',
                        '&:hover': { backgroundColor: '#D63F3F' },
                      }}
                    >
                      Inactive
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <p>No bank data available.</p>
            )}
          </TableBody>
        </Table>

        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px', justifyContent: 'flex-end' }}>
          <Button sx={{ color: "#828C9E" }}>
            Previous
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '30px', height: '30px', borderRadius: '20%', bgcolor: '#3498DB', color: 'white', fontWeight: 'bold', marginX: '10px', }} >
            1
          </Box>

          <Button sx={{ color: "#828C9E" }}  >
            Next
          </Button>
        </Box>
      </TableContainer>
    </Box>
  );
};

export default AddAccountPage;