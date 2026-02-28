import { Box, Paper, Typography } from '@mui/material';

export function DashboardPage(): JSX.Element {
  return (
    <Box p={4}>
      <Paper sx={{ p: 4 }} elevation={2}>
        <Typography variant="h4">HRMS Enterprise Dashboard</Typography>
        <Typography sx={{ mt: 2 }}>React + Vite + Material UI scaffold with Keycloak-ready auth layer.</Typography>
      </Paper>
    </Box>
  );
}
