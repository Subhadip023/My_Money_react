import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../redux/themeSlice'
import { useEffect, useState, useRef } from 'react'
import Sidebar from '../components/Sidebar'
import { cn } from '../utils'
import authService from '../appwrite/auth'
import { logout } from '../redux/authSlice'
import { setLoading } from '../redux/uiSlice'
import toast from 'react-hot-toast'
import Footer from '../components/Footer'
import UserTour from '../components/ui/UserTour'
import conf from '../config/config'
import IssueModal from '../components/ui/IssueModal'

export const MainLayout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state) => state.auth.user)
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 768)
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)
    const darkMode = useSelector((state) => state.theme.darkMode)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

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

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false)
            } else {
                setIsSidebarOpen(true)
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className={cn(
            "min-h-screen font-sans transition-colors duration-300 flex",
            "bg-white text-neutral-900",
            "dark:bg-neutral-900 dark:text-white"
        )} >
            <UserTour />
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-800 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
                    {/* Left: Mobile Toggle */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400  hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>

                    <div className="hidden md:block">
                        {/* Title or Breadcrumbs could go here */}
                    </div>

                    {/* Right: User Profile & Actions & Theme Toggle */}
                    <div className="flex items-center gap-3 sm:gap-6">
                        {/* Report Issue Button */}
                        <button
                            onClick={() => setIsIssueModalOpen(true)}
                            title='Report an Issue'
                            className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all active:scale-95 cursor-pointer shadow-sm font-bold flex items-center justify-center gap-2 text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="hidden sm:inline">Report Issue</span>
                        </button>

                        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-neutral-900 dark:text-neutral-100 leading-none mb-1">
                                    {user?.name || 'Guest User'}
                                </p>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">
                                    {user?.email || 'Premium Member'}
                                </p>
                            </div>
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 p-[2px] shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform"
                            >
                                {user?.prefs?.avatarId ? (
                                    <img src={`https://fra.cloud.appwrite.io/v1/storage/buckets/${conf.appwriteBucketID}/files/${user.prefs.avatarId}/view?project=${conf.appwriteProjectId}`} alt="Profile" className="w-full h-full rounded-[14px] object-cover pointer-events-none" />
                                ) : (
                                    <div className="w-full h-full rounded-[14px] bg-white dark:bg-neutral-800 flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400 pointer-events-none">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-2 space-y-1">
                                        <Link 
                                            to="/settings"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Settings
                                        </Link>
                                    </div>
                                    <div className="p-2 border-t border-neutral-100 dark:border-neutral-700/50">
                                        <button 
                                            onClick={() => {
                                                setIsDropdownOpen(false)
                                                handleLogout()
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-10">
                    <Outlet />
                </main>
                <Footer />
            </div>

            <IssueModal
                isOpen={isIssueModalOpen}
                onClose={() => setIsIssueModalOpen(false)}
                onIssueSaved={() => {
                    // Optional: Dispatch an event or action if needed globally,
                    // but for now, the toast handles the user feedback globally.
                    window.dispatchEvent(new Event('issue_saved_globally'));
                }}
            />
        </div>
    )
}
