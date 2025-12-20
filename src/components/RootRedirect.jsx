import { Navigate } from 'react-router-dom';

const RootRedirect = () => {
  const accessToken = localStorage.getItem('access_token');
  
  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Navigate to="/login" replace />;
};

export default RootRedirect;

