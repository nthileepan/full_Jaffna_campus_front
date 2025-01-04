import  {React} from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Button, Box } from '@mui/material';

const expenseData = [
  { name: 'Abi New PC', expenseAmount: 130030, account: 'Sampath Bank', note: 'CEB' },
  { name: 'Bonus', expenseAmount: 208500, account: 'Cash', note: 'Bonus' },
  { name: 'CEB', expenseAmount: 20000, account: 'Sampath Bank', note: 'CEB' },
  { name: 'Diesel', expenseAmount: 15000, account: 'Cash', note: 'Diesel' },
  { name: 'Diesel', expenseAmount: 15000, account: 'Cash', note: 'Diesel' },
  { name: 'Donation', expenseAmount: 10000, account: 'Cash', note: 'Donation' },
];

const ExpensesPage = () => {


  return (
    <Box>

      <Button variant="contained" color="primary" sx={{ marginRight: '20px' }}>Add Expense +</Button>
      
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
              <TableCell sx={{ width: '22%', textAlign: 'center' }}>Name</TableCell>
              <TableCell sx={{ width: '22%', textAlign: 'center' }}>Expense Amount</TableCell>
              <TableCell sx={{ width: '22%', textAlign: 'center' }}>Account</TableCell>
              <TableCell sx={{ width: '22%', textAlign: 'center' }}>Note</TableCell>
              <TableCell sx={{ width: '22%', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenseData.map((row, index) => (
              <TableRow key={index}>
                <TableCell sx={{ width: '22%', textAlign: 'center' }}>{row.name}</TableCell>
                <TableCell sx={{ width: '22%', textAlign: 'center' }}>{row.expenseAmount}</TableCell>
                <TableCell sx={{ width: '22%', textAlign: 'center' }}>{row.account}</TableCell>
                <TableCell sx={{ width: '22%', textAlign: 'center' }}>{row.note}</TableCell>
                <TableCell sx={{ width: '22%', textAlign: 'center' }}>
                  <Button variant="outlined" color="warning" sx={{ marginRight: '5px', backgroundColor: '#EEA827', color: "black" }}>Edit</Button>
                  <Button variant="outlined" color="error" sx={{ backgroundColor: '#F54242', color: "white" }}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


    </Box>
  );
};

export default ExpensesPage;