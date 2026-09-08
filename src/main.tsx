import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./main.css"
import Navbar from './navbar.js'

const root = document.getElementById('root') ?? document.createElement("div")

createRoot(root).render(
  <StrictMode>
    <Navbar />
  </StrictMode>,
)
