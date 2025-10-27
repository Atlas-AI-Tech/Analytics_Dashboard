import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AnalyticsDashboard from './AnalyticsDashboard.jsx'
import FieldwiseAnalyticsDashboard from './FieldwiseAnalyticsDashboard.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'


const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: "/",
        element: <AnalyticsDashboard />,
      },
      {
        path: "/fieldwise-analytics",
        element: <FieldwiseAnalyticsDashboard />,
      }
    ]
  },
])

const root = createRoot(document.getElementById("root"));


root.render(
    <RouterProvider router={appRouter} />
);