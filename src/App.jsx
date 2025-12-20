
import './App.css'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div>
      {!isLoginPage && <Navbar />}
      <Outlet />
    </div>
  )
}

export default App
