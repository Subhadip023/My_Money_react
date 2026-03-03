import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { Home } from './pages/Home'
import { About } from './pages/About'
import Dashboard from './pages/Dashboard'
import Accounts from './pages/Accounts'
import Categories from './pages/Categories'
import Transactions from './pages/Transactions'
import GuestLayout from './layouts/GuestLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import authService from './appwrite/auth'
import { setUser, logout } from './redux/authSlice'
import { setLoading } from './redux/uiSlice'
import Loader from './components/ui/Loader'
import ProtectedRoutes from './components/ProtectedRoutes'
import GuestRoutes from './components/GuestRoutes'
import { Toaster } from 'react-hot-toast'
import NotFound from './pages/NotFound'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setLoading(true))
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(setUser(userData))
        } else {
          dispatch(logout())
        }
      })
      .catch(() => {
        dispatch(logout())
      })
      .finally(() => {
        dispatch(setLoading(false))
      })
  }, [dispatch])

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Loader />
      <Routes>
        {/* Everything inside GuestLayout by default */}
        <Route element={<GuestLayout />}>
          {/* Publicly Shared Pages */}
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />

          {/* Authenticated Guests Only (Login/Register) */}
          <Route element={<GuestRoutes />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Fallback for anything not caught by ProtectedRoutes */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Dashbaord/Protected Pages (MainLayout) */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<MainLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="categories" element={<Categories />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App;
