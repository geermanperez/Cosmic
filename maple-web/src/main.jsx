import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './brand.css'
import App from './App.jsx'
import { startEverleafBranding } from './brandRuntime.js'

startEverleafBranding()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
