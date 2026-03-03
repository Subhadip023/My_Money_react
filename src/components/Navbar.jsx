import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../redux/themeSlice'
import { cn } from '../utils'

const Navbar = () => {
    const location = useLocation()
    const darkMode = useSelector((state) => state.theme.darkMode)
    const dispatch = useDispatch()

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between p-6 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md shadow-sm dark:shadow-2xl border-b border-neutral-100 dark:border-neutral-700 transition-colors">
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                <span>💰</span>
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                    MyMoney
                </span>
            </h1>

            <div className="flex items-center gap-8">
                <div className="flex gap-6">
                    {[
                        { name: 'Home', path: '/' },
                        { name: 'Dashboard', path: '/dashboard' },
                        { name: 'Accounts', path: '/accounts' },
                        { name: 'Categories', path: '/categories' },
                        { name: 'Transactions', path: '/transactions' },
                        { name: 'About', path: '/about' },

                    ].map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "transition-colors font-semibold",
                                location.pathname === item.path
                                    ? "text-indigo-600 dark:text-white"
                                    : "text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-white"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                <button
                    onClick={() => dispatch(toggleTheme())}
                    className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-600 dark:text-neutral-200 transition-all duration-200 active:scale-95 shadow-inner cursor-pointer"
                    aria-label="Toggle theme"
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
            </div>
        </nav>
    )
}

export default Navbar