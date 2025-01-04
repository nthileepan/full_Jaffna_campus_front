import React from "react";
import { Modal, Box, Typography, TextField, Button, Select, MenuItem } from "@mui/material";

const AddBankModal = ({ open, handleClose }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        
        {/* Header */}
        <Typography
          variant="h6"
          align="center"
          sx={{
            bgcolor: "lightgreen",
            p: 1,
            borderRadius: 1,
            marginBottom: 2,
            fontWeight: "bold",
          }}
        >
          Add New Bank Account
        </Typography>

        {/* Form Fields */}
        <Box component="form" noValidate autoComplete="off">
          <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
            <Select fullWidth defaultValue="" displayEmpty>
              <MenuItem value="" disabled>
                Bank
              </MenuItem>
              <MenuItem value="Bank of Ceylon">Bank of Ceylon</MenuItem>
              <MenuItem value="Commercial Bank">Commercial Bank</MenuItem>
              <MenuItem value="HSBC">HSBC</MenuItem>
            </Select>
            <TextField fullWidth label="Account No" variant="outlined" />
          </Box>

          <TextField
            fullWidth
            label="Opening Balance"
            variant="outlined"
            sx={{ marginBottom: 2 }}
          />

          {/* Submit Button */}
          <Button variant="contained" color="primary" fullWidth onClick={handleClose}>
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddBankModal;
