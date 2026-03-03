import React from 'react'
import GuestNavbar from '../components/GuestNavbar'
import Footer from '../components/Footer'
import { Outlet, useLocation } from 'react-router-dom'
import { cn } from '../utils'

function GuestLayout() {
    const location = useLocation()
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

    return (
        <div className={cn(
            "min-h-screen font-sans transition-colors duration-300 flex flex-col justify-between",
            "bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white"
        )}>
            <GuestNavbar />

            <main className={cn(
                "flex-1 flex flex-col",
                isAuthPage ? "items-center justify-center p-4 md:p-6" : "container mx-auto px-4 pt-12 max-w-5xl"
            )}>
                {isAuthPage ? (
                    <div className="w-full max-w-6xl animate-in fade-in zoom-in-95 duration-500">
                        <div className="bg-white dark:bg-neutral-800 rounded-[40px] border border-neutral-100 dark:border-neutral-700 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

                            {/* Left Side: Branding & Quote */}
                            <div className="md:w-1/2 bg-neutral-900 dark:bg-neutral-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full -mr-20 -mt-20" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/20 blur-[100px] rounded-full -ml-20 -mb-20" />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-12">
                                        <span className="text-4xl text-white">💰</span>
                                        <span className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">MyMoney</span>
                                    </div>

                                    <div className="space-y-4">
                                        <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter">
                                            {location.pathname === '/login' ? (
                                                <>If you can't <span className="text-indigo-400">measure</span> it, you can't <span className="text-violet-400">control</span> it.</>
                                            ) : (
                                                <>Start your <span className="text-indigo-400">journey</span> to financial <span className="text-violet-400">freedom</span>.</>
                                            )}
                                        </h1>
                                        <p className="text-neutral-400 text-lg font-medium leading-relaxed">
                                            {location.pathname === '/login'
                                                ? "Take full command of your financial future today. Join thousands of users managing wealth with precision."
                                                : "Precision tracking. Smart analytics. Total control. Your new financial chapter starts with a single click."
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="relative z-10 pt-12 mt-auto border-t border-neutral-800 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1">Trusted by professionals</p>
                                        <div className="flex gap-4 items-center">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center text-[10px] font-black text-neutral-400">U{i}</div>
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">+10k active</span>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-[10px] font-black text-indigo-400">BETA v1.0</div>
                                </div>
                            </div>

                            {/* Right Side: Form Content */}
                            <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-white dark:bg-neutral-800 overflow-y-auto">
                                <div className="max-w-md mx-auto w-full">
                                    <Outlet />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-neutral-50 dark:bg-neutral-800/50 p-8 md:p-12 rounded-3xl border border-neutral-100 dark:border-neutral-700/50 backdrop-blur-sm transition-colors shadow-sm">
                        <Outlet />
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}

export default GuestLayout;