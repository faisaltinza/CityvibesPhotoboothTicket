import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {RouterProvider,createBrowserRouter} from 'react-router-dom'
import RegistrationForm from './RegistrationForm.jsx'
import PhotoboothTicket from './PhotoboothTicket.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <RegistrationForm/>
  },
 
  {
    path: "/ticket",
    element: <PhotoboothTicket/>
  }


])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
