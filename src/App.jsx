import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { Home } from './pages/Home'
import { About } from './pages/About'
import Dashboard from './pages/Dashboard'
import Accounts from './pages/Accounts'
import AccountDetails from './pages/AccountDetails'
import Categories from './pages/Categories'
import Transactions from './pages/Transactions'
import Settings from './pages/Settings'
import Investments from './pages/Investments'
import GuestLayout from './layouts/GuestLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import { useDispatch ,useSelector} from 'react-redux'
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


  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Loader />
      {/* Is user Authnticated load dashboard not home page  */}
      <Routes>
        {/* Everything inside GuestLayout by default */}
        <Route element={isAuthenticated ? <MainLayout /> : <GuestLayout />}>
          {/* Publicly Shared Pages */}
          <Route index element={isAuthenticated ? <Dashboard /> : <Home />} />
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
            <Route path="accounts/:id" element={<AccountDetails />} />
            <Route path="categories" element={<Categories />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="investments" element={<Investments />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App;
