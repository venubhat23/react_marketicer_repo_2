import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

const Report = () => {
  const [open, setOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(dayjs());

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSave = () => {
    console.log('Scheduled for:', selectedDateTime.toString());
    handleClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 2 }}>
        <Button variant="contained" onClick={handleOpen}>
          Schedule
        </Button>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Select Date & Time</DialogTitle>
          <DialogContent sx={{ mt: 1 }}>
            <DateTimePicker
              label="Schedule Date & Time"
              value={selectedDateTime}
              onChange={(newValue) => setSelectedDateTime(newValue)}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default Report;
