import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardPage } from '../features/dashboard/page';

export function AppRouter(): JSX.Element {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
