import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { initializeTheme } from '../redux/themeSlice'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { cn } from '../utils'
import Footer from '../components/Footer'

export const MainLayout = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializeTheme())
    }, [dispatch])

    return (
        <div className={cn(
            "min-h-screen font-sans transition-colors duration-300",
            "bg-white text-neutral-900",
            "dark:bg-neutral-900 dark:text-white"
        ) + " flex flex-col justify-between"} >
            <Navbar />

            <main className="container mx-auto px-4 pt-12 max-w-5xl">
                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-8 md:p-12 rounded-3xl border border-neutral-100 dark:border-neutral-700/50 backdrop-blur-sm transition-colors shadow-sm">
                    <Outlet />
                </div>
            </main>

            <Footer />
        </div>
    )
}
