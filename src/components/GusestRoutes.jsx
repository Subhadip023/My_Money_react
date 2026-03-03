import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

function GusestRoutes() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
    return (
        isAuthenticated ? <Navigate to="/dashboard" /> : <Outlet />
    )
}

export default GusestRoutes