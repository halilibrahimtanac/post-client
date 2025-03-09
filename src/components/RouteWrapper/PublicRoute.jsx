import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const isAuthenticated = useSelector(state => state.data.isAuthenticated);
  return !isAuthenticated ? <Outlet /> : <Navigate to={"/home"} replace/>
}

export default PublicRoute