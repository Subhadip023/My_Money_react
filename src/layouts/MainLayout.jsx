import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../redux/themeSlice'
import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { cn } from '../utils'
import Footer from '../components/Footer'
import UserTour from '../components/ui/UserTour'
import conf from '../config/config'
import IssueModal from '../components/ui/IssueModal'

export const MainLayout = () => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 768)
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false)
    const darkMode = useSelector((state) => state.theme.darkMode)

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
                                {user?.prefs?.avatarId ? (
                                    <img src={`https://fra.cloud.appwrite.io/v1/storage/buckets/${conf.appwriteBucketID}/files/${user.prefs.avatarId}/view?project=${conf.appwriteProjectId}`} alt="Profile" className="w-full h-full rounded-[14px] object-cover" />
                                ) : (
                                    <div className="w-full h-full rounded-[14px] bg-white dark:bg-neutral-800 flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                            </div>
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
