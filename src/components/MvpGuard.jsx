import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export default function MvpGuard({ user }) {
  if (!user) return <Navigate to="/login" replace />;

  if (!user.labels?.includes("mvp")) {
    return <Navigate to="/dashboard" replace />; 
  }

  return <Outlet />;
}
