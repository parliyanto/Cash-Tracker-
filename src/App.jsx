import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Transactions from "./pages/Transactions"
import Layout from './layout/Layout'
import Settings from './pages/Settings'
import { Toaster } from "react-hot-toast"

function App() {
  return (
    <>
     <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            fontSize: "14px",
          },
        }}
      />
    
    <Routes>
      <Route path="/" element={<Login />} />
      
      <Route element={<Layout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>

    </>
  )
}

export default App