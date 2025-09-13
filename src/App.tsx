import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TestComponent from './components/TestComponent';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import PublicPortfolio from './components/PublicPortfolio';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Layout>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/login" element={<Navigate to="/auth" replace />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/p/:handle" element={<PublicPortfolio />} />
                {/* Remove test route in production */}
                {process.env.NODE_ENV === 'development' && (
                  <Route path="/test" element={<TestComponent />} />
                )}
              </Routes>
            </Layout>
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;