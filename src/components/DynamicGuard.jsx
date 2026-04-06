import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

/**
 * A highly versatile and reusable guard for protecting routes based on 
 * authentication, user labels, or custom checks.
 */
const DynamicGuard = ({ 
    user, 
    requiredLabel = "mvp", 
    fallback = "/dashboard", 
    check = null 
}) => {
    // 1. Initial Authentication Check
    if (!user) return <Navigate to="/login" replace />;

    // 2. Perform Authorization Logic
    // Can be either a custom check function or a label check
    const isAuthorized = check 
        ? check(user) 
        : (requiredLabel ? user.labels?.includes(requiredLabel) : true);

    // 3. Fallback for unauthorized users
    if (!isAuthorized) {
        return <Navigate to={fallback} replace />;
    }

    // 4. Authorized: Render nested routes
    return <Outlet />;
}

export default DynamicGuard
