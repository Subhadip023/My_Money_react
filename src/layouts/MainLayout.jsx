import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { initializeTheme, toggleTheme } from '../redux/themeSlice'
import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { cn } from '../utils'
import Footer from '../components/Footer'
import UserTour from '../components/ui/UserTour'

export const MainLayout = () => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const darkMode = useSelector((state) => state.theme.darkMode)

    useEffect(() => {
        dispatch(initializeTheme())
    }, [dispatch])

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

                    {/* Right: User Profile & Actions */}
                    <div className="flex items-center gap-3 sm:gap-6">
                        {/* Theme Toggle */}
                        <button
                            onClick={() => dispatch(toggleTheme())}
                            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all active:scale-95 cursor-pointer border border-neutral-100 dark:border-neutral-700 shadow-sm"
                        >
                            {darkMode ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                </svg>
                            )}
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-neutral-900 dark:text-neutral-100 leading-none mb-1">
                                    {user?.name || 'Guest User'}
                                </p>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">
                                    {user?.email || 'Premium Member'}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 p-[2px] shadow-lg shadow-indigo-500/20">
                                <div className="w-full h-full rounded-[14px] bg-white dark:bg-neutral-800 flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-10">
                    <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 md:p-12 rounded-[24px] md:rounded-[40px] border border-neutral-100 dark:border-neutral-700/50 backdrop-blur-sm transition-colors shadow-sm min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-240px)]">
                        <Outlet />
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    )
}
