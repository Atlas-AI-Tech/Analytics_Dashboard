import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './components/Login.jsx'
import AnalyticsDashboard from './AnalyticsDashboard.jsx'
import FieldwiseAnalyticsDashboard from './FieldwiseAnalyticsDashboard.jsx'
import LatencyTracker from './LatencyTracker.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PublicRoute from './components/PublicRoute.jsx'
import RootRedirect from './components/RootRedirect.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'


const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: "/login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <AnalyticsDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/fieldwise-analytics",
        element: (
          <ProtectedRoute>
            <FieldwiseAnalyticsDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/api-latency-tracker",
        element: (
          <ProtectedRoute>
            <LatencyTracker />
          </ProtectedRoute>
        ),
      },
      {
        path: "/",
        element: <RootRedirect />,
      },
    ]
  },
])

const root = createRoot(document.getElementById("root"));


root.render(
    <RouterProvider router={appRouter} />
);