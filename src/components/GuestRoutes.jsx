import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

function GuestRoutes() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
    return (
        isAuthenticated ? <Navigate to="/dashboard" /> : <Outlet />
    )
}

export default GuestRoutes