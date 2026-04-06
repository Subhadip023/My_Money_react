import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { dashboardRoutes } from './config/routes'
import DynamicGuard from './components/DynamicGuard'
import GuestLayout from './layouts/GuestLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import { useDispatch ,useSelector} from 'react-redux'
import { useEffect } from 'react'
import authService from './appwrite/auth'
import { setUser, logout } from './redux/authSlice'
import { setLoading } from './redux/uiSlice'
import Loader from './components/ui/Loader'
import ProtectedRoutes from './components/ProtectedRoutes'
import GuestRoutes from './components/GuestRoutes'
import { Toaster } from 'react-hot-toast'
import { initializeTheme } from './redux/themeSlice'
import MvpGuard from './components/MvpGuard'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeTheme())
  }, [dispatch])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      if (localStorage.getItem('darkMode') === null) {
        if (e.matches) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

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
  const user = useSelector((state) => state.auth.user)

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Loader />
      {/* Is user Authnticated load dashboard not home page  */}
      <Routes>
        {/* Everything inside GuestLayout by default */}
        <Route element={isAuthenticated ? <MainLayout /> : <GuestLayout />}>
          {/* Publicly Shared Pages */}
          <Route index element={ <Home />} />
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
            {dashboardRoutes.map((route) => {
              const Component = route.element;
              return route.requiredLabel ? (
                <Route key={route.path} element={<DynamicGuard user={user} requiredLabel={route.requiredLabel} featureName={route.name} />}>
                  <Route path={route.path} element={<Component />} />
                </Route>
              ) : (
                <Route key={route.path} path={route.path} element={<Component />} />
              );
            })}
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App;
