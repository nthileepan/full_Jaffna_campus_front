import React,{useState,useEffect} from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Button, Box } from '@mui/material';
import AddExpenseType from '../modals/AddExpenseType';
import axios from 'axios';



const ExpenseTypesPage = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const handleOpenModal = () => setIsModalOpen(true);
  
    const handleCloseModal = () => setIsModalOpen(false);

    const [expenseTypes , setexpenseType] = useState([]);

    useEffect(() => {
      const fetchExpenseTypes = async () => {
        try {
          const response = await axios.get("http://localhost:8000/api/expenseTypes");
          const  ExpenseTypes = response.data.expensetypes;
  
          setexpenseType(ExpenseTypes);
          fetchExpenseTypes();
  
        } catch (error) {
          console.error("Error fetching Expense Types data:", error);
        }
      };
      fetchExpenseTypes();
    }, []);

  return (
    <Box>

      <Button variant="contained" color="primary" sx={{ marginRight: '20px' }} onClick={handleOpenModal} >Add Category +</Button>
      <AddExpenseType open={isModalOpen} handleClose={handleCloseModal} />
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
              <TableCell sx={{ width: '15%', textAlign: 'center', fontWeight: 'bold', color: 'white' }}>ID</TableCell>
              <TableCell sx={{ width: '35%', textAlign: 'center', fontWeight: 'bold', color: 'white' }}>EXPENSE CATEGORY</TableCell>

              <TableCell sx={{ width: '20%', textAlign: 'center', fontWeight: 'bold', color: 'white' }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenseTypes.map((row, index) => (
              <TableRow key={index}>
                <TableCell sx={{ textAlign: 'center' }}>{index+1}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{row.expenseTypeName}</TableCell>

                <TableCell sx={{ textAlign: 'center' }}>
                  <Button
                    variant="outlined"
                    color="warning"
                    sx={{
                      marginRight: '5px',
                      backgroundColor: '#EEA827',
                      color: 'black',
                      '&:hover': {
                        backgroundColor: '#E08C27',
                      },
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
                      '&:hover': {
                        backgroundColor: '#D63F3F',
                      },
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>



    </Box>
  );
};

export default ExpenseTypesPage;