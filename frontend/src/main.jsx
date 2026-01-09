import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './authContext.jsx'
import ProjectRoutes from './Routes.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from '@primer/react'

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <AuthProvider>
      <Router>
        <ProjectRoutes />
      </Router>
    </AuthProvider>
  </ThemeProvider>
)
