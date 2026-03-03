import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { Home } from './pages/Home'
import { About } from './pages/About'
import Dashboard from './pages/Dashboard'
import Accounts from './pages/Accounts'
import Categories from './pages/Categories'
import Transactions from './pages/Transactions'
import GuestLayout from './layouts/GuestLayout'
import AuthLayout from './layouts/AuthLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import authService from './appwrite/auth'
import { setUser, logout } from './redux/authSlice'
import { setLoading } from './redux/uiSlice'
import Loader from './components/ui/Loader'
import ProtectedRoutes from './components/ProtectedRoutes'
import GuestRoutes from './components/GuestRoutes'
import { Toaster } from 'react-hot-toast'

function App() {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

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

  const navigate = useNavigate()

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Loader />
      {/* <Routes>
        {isAuthenticated ? (
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>
        ) : (
          <Route path="/" element={<GuestLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        )}
      </Routes> */}
      <Routes>
        <Route element={<GuestRoutes />}>
          <Route path="/" element={<GuestLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="about" element={<About />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
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

export default App
