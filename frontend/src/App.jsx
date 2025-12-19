import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ApplyPage from './pages/ApplyPage';
import OverviewPage from './pages/OverviewPage';
import CandidatesPage from './pages/CandidatesPage';
import AISearchPage from './pages/AISearchPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ApplicationsPage from './pages/ApplicationsPage';
import JobRolesPage from './pages/JobRolesPage';
import SettingsPage from './pages/SettingsPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/apply" replace />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <OverviewPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/candidates"
          element={
            <PrivateRoute>
              <CandidatesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/applications"
          element={
            <PrivateRoute>
              <ApplicationsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/job-roles"
          element={
            <PrivateRoute>
              <JobRolesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/ai-search"
          element={
            <PrivateRoute>
              <AISearchPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/analytics"
          element={
            <PrivateRoute>
              <AnalyticsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/apply" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
