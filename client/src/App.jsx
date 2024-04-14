import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import Navbar from './components/Navbar'
import AllEmp from './pages/AllEmp'
import PageNotFound from './pages/PageNotFound'
import Home from './pages/Home'
import AddLeaves from './pages/AddLeaves'
import ShowSingleEmpLeave from './pages/ShowSingleEmpLeave'
import EditEmp from './pages/EditEmp'
import Login from './pages/Login'



function App() {
  return (
    <>
      <BrowserRouter>

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/allemployee' element={<AllEmp />} />
          <Route path='/showsingleempleave/:id' element={<ShowSingleEmpLeave />} />
          <Route path='/editemp/:id' element={<EditEmp />} />

          <Route path='/addleave/:id' element={<AddLeaves />} />

          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App