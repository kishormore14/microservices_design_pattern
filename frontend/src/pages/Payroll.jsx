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
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { payrollService } from '../services/api';

export default function Payroll() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState(null);
  const [formData, setFormData] = useState({
    employeeId: '',
    month: '',
    year: new Date().getFullYear(),
    basicSalary: '',
    allowances: '',
    deductions: '',
  });

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const fetchPayrolls = async () => {
    try {
      const data = await payrollService.getAllPayrolls();
      setPayrolls(data);
    } catch (err) {
      setError('Failed to fetch payrolls');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const payrollData = {
        ...formData,
        basicSalary: parseFloat(formData.basicSalary),
        allowances: parseFloat(formData.allowances) || 0,
        deductions: parseFloat(formData.deductions) || 0,
      };

      if (editingPayroll) {
        await payrollService.updatePayroll(editingPayroll.id, payrollData);
      } else {
        await payrollService.createPayroll(payrollData);
      }
      setOpenDialog(false);
      setEditingPayroll(null);
      setFormData({
        employeeId: '',
        month: '',
        year: new Date().getFullYear(),
        basicSalary: '',
        allowances: '',
        deductions: '',
      });
      fetchPayrolls();
    } catch (err) {
      setError('Operation failed');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payroll record?')) {
      try {
        await payrollService.deletePayroll(id);
        fetchPayrolls();
      } catch (err) {
        setError('Failed to delete payroll');
        console.error(err);
      }
    }
  };

  const handleEdit = (payroll) => {
    setEditingPayroll(payroll);
    setFormData({
      employeeId: payroll.employeeId,
      month: payroll.month,
      year: payroll.year,
      basicSalary: payroll.basicSalary?.toString() || '',
      allowances: payroll.allowances?.toString() || '',
      deductions: payroll.deductions?.toString() || '',
    });
    setOpenDialog(true);
  };

  const handleAddPayroll = () => {
    setEditingPayroll(null);
    setFormData({
      employeeId: '',
      month: '',
      year: new Date().getFullYear(),
      basicSalary: '',
      allowances: '',
      deductions: '',
    });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditingPayroll(null);
    setFormData({
      employeeId: '',
      month: '',
      year: new Date().getFullYear(),
      basicSalary: '',
      allowances: '',
      deductions: '',
    });
  };

  const calculateNetSalary = (basic, allowances = 0, deductions = 0) => {
    return (parseFloat(basic) + parseFloat(allowances || 0) - parseFloat(deductions || 0));
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Payroll Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddPayroll}
        >
          Add Payroll
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
                    <TableCell>Period</TableCell>
                    <TableCell>Basic Salary</TableCell>
                    <TableCell>Allowances</TableCell>
                    <TableCell>Deductions</TableCell>
                    <TableCell>Net Salary</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payrolls.map((payroll) => (
                    <TableRow key={payroll.id}>
                      <TableCell>{payroll.employeeId}</TableCell>
                      <TableCell>{payroll.month} {payroll.year}</TableCell>
                      <TableCell>${payroll.basicSalary?.toLocaleString() || '0'}</TableCell>
                      <TableCell>${payroll.allowances?.toLocaleString() || '0'}</TableCell>
                      <TableCell>${payroll.deductions?.toLocaleString() || '0'}</TableCell>
                      <TableCell>
                        <strong>
                          ${calculateNetSalary(
                            payroll.basicSalary,
                            payroll.allowances,
                            payroll.deductions
                          )?.toLocaleString() || '0'}
                        </strong>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={payroll.status || 'Pending'}
                          color={
                            payroll.status === 'Processed' ? 'success' :
                            payroll.status === 'Processing' ? 'warning' : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(payroll)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(payroll.id)}
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
          {editingPayroll ? 'Edit Payroll' : 'Add New Payroll'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Employee ID"
              fullWidth
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Month</InputLabel>
                  <Select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  >
                    {months.map((month) => (
                      <MenuItem key={month} value={month}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Year"
                  type="number"
                  fullWidth
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                />
              </Grid>
            </Grid>
            <TextField
              margin="dense"
              label="Basic Salary"
              type="number"
              fullWidth
              value={formData.basicSalary}
              onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Allowances"
              type="number"
              fullWidth
              value={formData.allowances}
              onChange={(e) => setFormData({ ...formData, allowances: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Deductions"
              type="number"
              fullWidth
              value={formData.deductions}
              onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingPayroll ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
