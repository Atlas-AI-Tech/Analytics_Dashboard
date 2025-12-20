import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const accessToken = localStorage.getItem('access_token');

  // If user is already logged in, redirect to dashboard
  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;

