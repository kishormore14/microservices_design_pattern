import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { employeeService } from '../services/api';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    department: '',
    position: '',
    salary: '',
    dateOfJoining: '',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (err) {
      setError('Failed to fetch employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const employeeData = {
        ...formData,
        salary: parseFloat(formData.salary),
      };

      if (editingEmployee) {
        await employeeService.updateEmployee(editingEmployee.id, employeeData);
      } else {
        await employeeService.createEmployee(employeeData);
      }
      setOpenDialog(false);
      setEditingEmployee(null);
      setFormData({
        userId: '',
        firstName: '',
        lastName: '',
        department: '',
        position: '',
        salary: '',
        dateOfJoining: '',
      });
      fetchEmployees();
    } catch (err) {
      setError('Operation failed');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.deleteEmployee(id);
        fetchEmployees();
      } catch (err) {
        setError('Failed to delete employee');
        console.error(err);
      }
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      userId: employee.userId || '',
      firstName: employee.firstName,
      lastName: employee.lastName,
      department: employee.department,
      position: employee.position,
      salary: employee.salary?.toString() || '',
      dateOfJoining: employee.dateOfJoining?.split('T')[0] || '',
    });
    setOpenDialog(true);
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setFormData({
      userId: '',
      firstName: '',
      lastName: '',
      department: '',
      position: '',
      salary: '',
      dateOfJoining: '',
    });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditingEmployee(null);
    setFormData({
      userId: '',
      firstName: '',
      lastName: '',
      department: '',
      position: '',
      salary: '',
      dateOfJoining: '',
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Employee Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddEmployee}
        >
          Add Employee
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
                    <TableCell>Name</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Salary</TableCell>
                    <TableCell>Joining Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        {employee.firstName} {employee.lastName}
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>
                        ${employee.salary?.toLocaleString() || '0'}
                      </TableCell>
                      <TableCell>{formatDate(employee.dateOfJoining)}</TableCell>
                      <TableCell>
                        <Chip
                          label={employee.status || 'Active'}
                          color={employee.status === 'Active' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(employee)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(employee.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
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
        <DialogTitle>
          {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  margin="dense"
                  label="First Name"
                  fullWidth
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Last Name"
                  fullWidth
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </Grid>
            </Grid>
            <TextField
              margin="dense"
              label="User ID (optional)"
              fullWidth
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              helperText="Link to existing user account"
            />
            <TextField
              margin="dense"
              label="Department"
              fullWidth
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Position"
              fullWidth
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Salary"
              type="number"
              fullWidth
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Date of Joining"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.dateOfJoining}
              onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingEmployee ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
