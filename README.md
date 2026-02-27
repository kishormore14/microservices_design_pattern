# HR Management System - Microservices Architecture

A complete HR Management System built with Node.js microservices and a React frontend.

## Architecture Overview

This system implements a microservices architecture with the following services:

### Services

1. **API Gateway** (`api-gateway`)
   - Single entry point for all client requests
   - Authentication and authorization
   - Rate limiting
   - Request routing to appropriate services

2. **User Service** (`user-service`)
   - User authentication and management
   - Role-based access control
   - User profiles and permissions

3. **Employee Service** (`employee-service`)
   - Employee profile management
   - Department organization
   - Attendance tracking
   - Leave management

4. **Payroll Service** (`payroll-service`)
   - Salary calculations
   - Payslip generation
   - Tax deductions
   - Payment processing

5. **Frontend** (`frontend`)
   - React-based user interface
   - Material-UI components
   - Responsive design

### Communication Patterns

- **Synchronous**: REST/gRPC for real-time queries
- **Asynchronous**: RabbitMQ for event-driven communication
- **Database per Service**: Each service owns its database

## Prerequisites

- Docker and Docker Compose
- Node.js (version 16 or higher)
- npm or yarn

## Quick Start

### Using Docker Compose (Recommended)

1. Navigate to the project root:
```bash
cd hrms-microservices
```

2. Start all services:
```bash
docker-compose up -d
```

3. Access the application:
   - Frontend: http://localhost:5173
   - API Gateway: http://localhost:3000

### Manual Setup

1. **Start databases and message broker:**
```bash
docker-compose up -d postgres-user postgres-employee postgres-payroll rabbitmq
```

2. **Start each service individually:**
```bash
# In separate terminals:

# API Gateway
cd api-gateway
npm install
npm start

# User Service
cd user-service
npm install
npm start

# Employee Service
cd employee-service
npm install
npm start

# Payroll Service
cd payroll-service
npm install
npm start

# Frontend
cd frontend
npm install
npm run dev
```

## Project Structure

```
hrms-microservices/
├── api-gateway/          # API Gateway service
├── user-service/         # User management service
├── employee-service/     # Employee management service
├── payroll-service/      # Payroll processing service
├── frontend/            # React frontend application
├── docker-compose.yml   # Docker configuration
└── README.md           # This file
```

## Services Details

### API Gateway
- Port: 3000
- Routes requests to appropriate services
- Handles authentication with JWT
- Implements rate limiting

### User Service
- Port: 3001
- Manages user accounts and authentication
- PostgreSQL database: `user_db`

### Employee Service
- Port: 3002
- Handles employee profiles and HR data
- PostgreSQL database: `employee_db`

### Payroll Service
- Port: 3003
- Manages salary calculations and payments
- PostgreSQL database: `payroll_db`

### Frontend
- Port: 5173 (development)
- React with Material-UI
- Communicates with API Gateway

## API Endpoints

### Authentication
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration
- `GET /api/users/profile` - Get current user profile

### Default Seed Users

The user service runs a startup migration that creates these users if they do not exist:

- `admin@example.com` / `admin123` (role: `admin`)
- `hr@example.com` / `hrmanager123` (role: `hr_manager`)
- `employee@example.com` / `employee123` (role: `employee`)

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Payroll
- `GET /api/payroll` - Get all payroll records
- `POST /api/payroll` - Create payroll record
- `GET /api/payroll/:id` - Get payroll by ID
- `PUT /api/payroll/:id` - Update payroll
- `DELETE /api/payroll/:id` - Delete payroll

## Database Schema

Each service has its own PostgreSQL database:

### user_db
- `users` table with authentication details

### employee_db
- `employees` table with profile information
- `attendance` table for tracking
- `leave_requests` table for leave management

### payroll_db
- `payrolls` table with salary data
- `payslips` table for generated payslips

## Event-Driven Architecture

Services communicate asynchronously using RabbitMQ:

- `user.created` - Trigger employee profile creation
- `employee.terminated` - Trigger payroll final settlement
- `payroll.processed` - Notify employee of payment

## Development

### Backend Development

Each service can be developed independently:

```bash
cd service-name
npm install
npm run dev  # if nodemon is configured
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

## Testing

Run tests for each service:

```bash
cd service-name
npm test
```

## Monitoring and Logging

- Centralized logging with Winston
- Request tracing with correlation IDs
- Health check endpoints for each service

## Security

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Rate limiting on API Gateway

## Deployment

### Docker Deployment

```bash
docker-compose up --build
```

### Kubernetes (Optional)

Kubernetes manifests can be created for production deployment.

## Environment Variables

Each service requires environment configuration. See individual service READMEs for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.
