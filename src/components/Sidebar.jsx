import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { cn } from '../utils'
import authService from '../appwrite/auth'
import { logout } from '../redux/authSlice'
import { setLoading } from '../redux/uiSlice'
import toast from 'react-hot-toast'

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)

    const handleLogout = async () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?")
        if (!confirmLogout) return

        dispatch(setLoading(true))
        try {
            await authService.logout()
            dispatch(logout())
            toast.success("Logged out successfully")
            navigate('/login')
        } catch (error) {
            toast.error(error.message || "Failed to logout")
        } finally {
            dispatch(setLoading(false))
        }
    }

    const navItems = [
        // { name: 'Home', path: '/', icon: '🏠' },
        { name: 'Dashboard', path: '/dashboard', icon: '📊' },
        { name: 'Accounts', path: '/accounts', icon: '💳' },
        { name: 'Categories', path: '/categories', icon: '🏷️' },
        { name: 'Transactions', path: '/transactions', icon: '📝' },
        { name: 'Settings', path: '/settings', icon: '⚙️' },
        // { name: 'About', path: '/about', icon: 'ℹ️' },
    ]

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={cn(
                "fixed md:sticky top-0 left-0 h-screen bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 flex flex-col items-center md:items-stretch transition-all duration-300 z-50 overflow-y-auto",
                isOpen
                    ? "translate-x-0 w-72 p-4 md:p-6 border-r shadow-2xl dark:shadow-none"
                    : "-translate-x-full w-0 border-none p-0 opacity-0 pointer-events-none"
            )}>
                {/* Branding & Close Button */}
                <div className="mb-10 w-full">
                    <div className="flex items-center justify-between mb-2">
                        <Link to="/dashboard" className="flex items-center gap-2">
                            <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                                MyMoney
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                                BETA
                            </span>
                        </Link>

                        {/* Mobile Close Button */}
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-700 md:hidden"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <p className="hidden lg:block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mt-2 ml-1">
                        Financial Mastery
                    </p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2 w-full">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                id={item.name === 'Accounts' ? 'tour-sidebar-accounts' : undefined}
                                title={item.name}
                                onClick={() => { if (window.innerWidth < 768) onClose() }}
                                className={cn(
                                    "flex items-center justify-center lg:justify-start gap-4 p-4 lg:px-5 lg:py-4 rounded-2xl font-bold transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                        : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 hover:text-indigo-600 dark:hover:text-white"
                                )}
                            >
                                <span className="text-xl flex-shrink-0">{item.icon}</span>
                                <span className="lg:inline whitespace-nowrap">{item.name}</span>
                                {isActive && (
                                    <div className="absolute left-0 lg:left-0 top-0 bottom-0 w-1 bg-white/30 rounded-full my-auto h-1/2" />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="pt-6 border-t border-neutral-100 dark:border-neutral-700 space-y-3 w-full">
                    {user && (
                        <button
                            onClick={handleLogout}
                            title="Logout"
                            className="w-full flex items-center justify-center lg:justify-start gap-4 p-4 lg:px-5 lg:py-4 rounded-2xl font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all active:scale-[0.98] cursor-pointer"
                        >
                            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                </svg>
                            </div>
                            <span className="hidden lg:inline whitespace-nowrap">Logout</span>
                        </button>
                    )}
                </div>
            </aside>
        </>
    )
}

export default Sidebar
