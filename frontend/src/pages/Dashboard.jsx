import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People as PeopleIcon,
  AccountCircle as UserIcon,
  Paid as PayrollIcon,
  Assignment as AttendanceIcon,
} from '@mui/icons-material';
import { dashboardService } from '../services/api';

const StatCard = ({ title, value, icon, color = 'primary' }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center">
        <Box
          sx={{
            p: 1,
            borderRadius: '50%',
            backgroundColor: `${color}.main`,
            color: 'white',
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const statData = [
    {
      title: 'Total Users',
      value: stats?.users || 0,
      icon: <UserIcon />,
      color: 'primary',
    },
    {
      title: 'Total Employees',
      value: stats?.employees || 0,
      icon: <PeopleIcon />,
      color: 'secondary',
    },
    {
      title: 'Active Payrolls',
      value: stats?.payrolls || 0,
      icon: <PayrollIcon />,
      color: 'success',
    },
    {
      title: 'Attendance Today',
      value: stats?.attendanceToday || 0,
      icon: <AttendanceIcon />,
      color: 'info',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {statData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Typography color="text.secondary">
                Activity feed will be implemented here
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Typography color="text.secondary">
                Quick action buttons will be implemented here
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
