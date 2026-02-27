# HRMS Frontend

A React-based frontend for the HR Management System using Material-UI.

## Features

- **Authentication**: Login/logout functionality with JWT tokens
- **Dashboard**: Overview of system statistics
- **User Management**: Create, read, update, and delete users
- **Employee Management**: Manage employee profiles and details
- **Payroll Management**: Handle salary calculations and payroll records
- **Attendance Management**: Track employee attendance
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- React 19
- React Router v7
- Material-UI v7
- Axios for API calls
- Vite for build tooling

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

## Installation

1. Navigate to the frontend directory:
```bash
cd hrms-microservices/frontend
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Production Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## API Configuration

The frontend is configured to communicate with the API Gateway at `http://localhost:3000/api`. Make sure the backend services are running.

You can change the API base URL in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # React context providers
├── pages/          # Page components
├── services/       # API service layer
├── theme/          # Material-UI theme configuration
├── App.jsx         # Main application component
└── main.jsx        # Application entry point
```

## Authentication Flow

1. User visits the application
2. If not authenticated, redirected to login page
3. On successful login, JWT token is stored in localStorage
4. Token is automatically included in all API requests
5. On token expiration or invalidation, user is redirected to login

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Default Credentials

For testing purposes, you can use the following default credentials:
- Email: `admin@example.com`
- Password: `admin123`

Note: These credentials need to be created in the backend first.

## Deployment

To deploy the frontend:

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist/` folder to your web server or static hosting service.

## Environment Variables

You can create a `.env` file to configure environment-specific settings:

```env
VITE_API_URL=http://localhost:3000/api
```

Then update `src/services/api.js` to use the environment variable:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```
