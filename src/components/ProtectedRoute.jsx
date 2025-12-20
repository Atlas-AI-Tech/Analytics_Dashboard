import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const validateToken = async () => {
      const accessToken = localStorage.getItem('access_token');

      if (!accessToken) {
        setIsValidating(false);
        setIsValid(false);
        return;
      }

      try {
        const response = await fetch('https://dev4.kreditmind.com/analytics/validate-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: accessToken,
          }),
        });

        const data = await response.json();

        if (data.valid === true && data.expired === false) {
          setIsValid(true);
        } else {
          // Token is invalid or expired, remove it and mark as invalid
          localStorage.removeItem('access_token');
          setIsValid(false);
        }
      } catch (error) {
        // On error, treat as invalid and remove token
        console.error('Token validation error:', error);
        localStorage.removeItem('access_token');
        setIsValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [location.pathname]);

  // Show nothing while validating (or you could show a loading spinner)
  if (isValidating) {
    return null; // Or return a loading component if you have one
  }

  // Redirect to login if token is invalid or doesn't exist
  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  // Token is valid, render the protected content
  return children;
};

export default ProtectedRoute;

