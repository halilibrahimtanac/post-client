import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from '../Navbar';

const ProtectedRoute = () => {
  const isAuthenticated = useSelector(state => state.data.isAuthenticated);
  return isAuthenticated ? <div>
    <Navbar></Navbar>
    <Outlet />
    </div> : <Navigate to={"/login"} replace/>
}

export default ProtectedRoute