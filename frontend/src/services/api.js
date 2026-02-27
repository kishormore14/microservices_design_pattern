import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: (credentials) => apiClient.post('/users/login', credentials).then(res => res.data),
  register: (userData) => apiClient.post('/users/register', userData).then(res => res.data),
  getCurrentUser: () => apiClient.get('/users/profile').then(res => res.data),
  logout: () => apiClient.post('/users/logout').then(res => res.data),
};

// User Service
export const userService = {
  getAllUsers: (params) => apiClient.get('/users', { params }).then(res => res.data),
  getUserById: (id) => apiClient.get(`/users/${id}`).then(res => res.data),
  createUser: (userData) => apiClient.post('/users', userData).then(res => res.data),
  updateUser: (id, userData) => apiClient.put(`/users/${id}`, userData).then(res => res.data),
  deleteUser: (id) => apiClient.delete(`/users/${id}`).then(res => res.data),
  assignRole: (id, role) => apiClient.patch(`/users/${id}/role`, { role }).then(res => res.data),
};

// Employee Service
export const employeeService = {
  getAllEmployees: (params) => apiClient.get('/employees', { params }).then(res => res.data),
  getEmployeeById: (id) => apiClient.get(`/employees/${id}`).then(res => res.data),
  createEmployee: (employeeData) => apiClient.post('/employees', employeeData).then(res => res.data),
  updateEmployee: (id, employeeData) => apiClient.put(`/employees/${id}`, employeeData).then(res => res.data),
  deleteEmployee: (id) => apiClient.delete(`/employees/${id}`).then(res => res.data),
  getAttendance: (employeeId, params) => apiClient.get(`/employees/${employeeId}/attendance`, { params }).then(res => res.data),
  markAttendance: (employeeId, attendanceData) => apiClient.post(`/employees/${employeeId}/attendance`, attendanceData).then(res => res.data),
  getLeaveRequests: (employeeId) => apiClient.get(`/employees/${employeeId}/leave-requests`).then(res => res.data),
  submitLeaveRequest: (employeeId, leaveData) => apiClient.post(`/employees/${employeeId}/leave-requests`, leaveData).then(res => res.data),
  processLeaveRequest: (employeeId, requestId, status) => 
    apiClient.patch(`/employees/${employeeId}/leave-requests/${requestId}`, { status }).then(res => res.data),
};

// Payroll Service
export const payrollService = {
  getAllPayrolls: (params) => apiClient.get('/payroll', { params }).then(res => res.data),
  getPayrollById: (id) => apiClient.get(`/payroll/${id}`).then(res => res.data),
  createPayroll: (payrollData) => apiClient.post('/payroll', payrollData).then(res => res.data),
  updatePayroll: (id, payrollData) => apiClient.put(`/payroll/${id}`, payrollData).then(res => res.data),
  deletePayroll: (id) => apiClient.delete(`/payroll/${id}`).then(res => res.data),
  processPayroll: (processData) => apiClient.post('/payroll/process', processData).then(res => res.data),
  getPayslip: (id) => apiClient.get(`/payroll/${id}/payslip`).then(res => res.data),
  getEmployeePayrolls: (employeeId) => apiClient.get(`/payroll/employee/${employeeId}`).then(res => res.data),
};

// Dashboard Service
export const dashboardService = {
  getStats: () => apiClient.get('/dashboard/stats').then(res => res.data),
  getRecentActivity: () => apiClient.get('/dashboard/activity').then(res => res.data),
};

export default apiClient;
