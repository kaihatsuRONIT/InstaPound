import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

function MainLayout() {
  return (
    <>
    <Sidebar/>
    <Outlet/>
    </>
  )
}

export default MainLayout