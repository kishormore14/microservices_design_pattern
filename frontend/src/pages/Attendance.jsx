import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { employeeService } from '../services/api';

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
  });

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
  }, []);

  const fetchAttendance = async () => {
    try {
      // This would need to be implemented in the backend
      // For now, we'll use mock data
      setAttendance([
        {
          id: 1,
          employeeId: 'EMP001',
          employeeName: 'John Doe',
          date: new Date().toISOString().split('T')[0],
          status: 'Present',
        },
        {
          id: 2,
          employeeId: 'EMP002',
          employeeName: 'Jane Smith',
          date: new Date().toISOString().split('T')[0],
          status: 'Absent',
        },
      ]);
    } catch (err) {
      setError('Failed to fetch attendance');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (err) {
      console.error('Failed to fetch employees for attendance');
    }
  };

  const handleSubmit = async () => {
    try {
      // This would call the attendance API
      console.log('Attendance record:', formData);
      setOpenDialog(false);
      setFormData({
        employeeId: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
      });
      fetchAttendance();
    } catch (err) {
      setError('Failed to record attendance');
      console.error(err);
    }
  };

  const handleAddAttendance = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setFormData({
      employeeId: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Present',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'success';
      case 'Absent': return 'error';
      case 'Late': return 'warning';
      case 'Leave': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Present': return <CheckIcon />;
      case 'Absent': return <CloseIcon />;
      default: return null;
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Attendance Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddAttendance}
        >
          Mark Attendance
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee ID</TableCell>
                    <TableCell>Employee Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.employeeId}</TableCell>
                      <TableCell>{record.employeeName}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(record.status)}
                          label={record.status}
                          color={getStatusColor(record.status)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Mark Attendance</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Employee</InputLabel>
              <Select
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              >
                {employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
                <MenuItem value="Late">Late</MenuItem>
                <MenuItem value="Leave">Leave</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
