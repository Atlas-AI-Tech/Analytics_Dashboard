
import './App.css'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

function App() {

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default App
