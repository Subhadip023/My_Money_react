import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { cn } from '../utils'
import { dashboardRoutes } from '../config/routes'
import Button from './shared/Button'

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation()
    const user = useSelector((state) => state.auth.user)

    const navItems = dashboardRoutes
        .filter(route => !route.path.includes(':')) // Hide detail routes from sidebar
        .filter(route => {
            if (!route.requiredLabel) return true;
            return user?.labels?.includes(route.requiredLabel);
        })
        .map(route => ({
            name: route.name,
            path: `/${route.path}`,
            icon: route.icon || '📍'
        }));

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
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            className="p-2 md:hidden"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </Button>
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

                {/* Footer Actions (Empty for now) 
                <div className="pt-6 border-t border-neutral-100 dark:border-neutral-700 space-y-3 w-full items-center flex justify-center">
                    <a href="mailto:subhadip240420@gmail.com" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold flex items-center gap-1.5 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        Contact
                    </a>
                </div>*/}
            </aside>
        </>
    )
}

export default Sidebar
