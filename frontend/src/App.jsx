import React from 'react'
import Signup from './components/Signup'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Home from './components/Home'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'

function App() {
  const browserRouter = createBrowserRouter([
    {
      path: '/',
      element:<MainLayout/>,
      children:[
        {
          path:'/',
          element:<Home/>
        },
        {
          path:'/profile/:id',
          element:<Profile/>
        },
        {
          path:'/account/edit',
          element:<EditProfile/>
        },
      ]
    },
    {
      path:'/signup',
      element:<Signup/>
    },
    {
      path:'/login',
      element:<Login/>
    },
  ])
  return (
    <>
    <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App