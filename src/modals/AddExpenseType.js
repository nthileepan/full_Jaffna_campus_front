import React, { useState } from "react";
import axios from "axios";
import { Box, Button, Select, MenuItem, TextField, Typography, Modal } from "@mui/material";


const AddExpenseType = ({ open, handleClose }) => {
    const [expenseType, setexpenseType] = useState("");

    const handleSubmit = async () => {

        if (!expenseType) {
            alert("Please fill in all fields");
            return;
        }

        const formData = {
            expenseType,
        };

        try {

            const response = await axios.post(
                "http://localhost:8000/api/save-expense-type",
                formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            }
            );

            if (response.status === 200) {
                alert("Expense Type saved successfully!");
                handleClose();
            }

        } catch (error) {
            console.error("Error saving Expense Type :", error);
            alert("Failed to save the Expense Type. Please try again.");
        }
    };

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
                    Add Expense Type
                </Typography>

                {/* Form Fields */}

                <TextField
                    fullWidth
                    label="Expense Type"
                    variant="outlined"
                    value={expenseType}
                    onChange={(e) => setexpenseType(e.target.value)}
                    sx={{ marginBottom: 2 }}
                />

                {/* Submit Button */}
                <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                    Submit
                </Button>
            </Box>

        </Modal>
    );
};

export default AddExpenseType;
