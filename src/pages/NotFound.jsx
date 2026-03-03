import React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../utils'

const NotFound = () => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* 404 Visual */}
            <div className="relative mb-8">
                <h1 className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter bg-gradient-to-b from-indigo-600/40 via-indigo-600/10 to-transparent bg-clip-text text-transparent select-none">
                    404
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl md:text-8xl">🕵️‍♂️</span>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-md space-y-6">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-neutral-900 dark:text-white">
                    Lost in the Mint?
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 text-lg font-medium leading-relaxed">
                    The page you're looking for has been moved to a high-yield savings account or simply doesn't exist.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link
                        to="/"
                        className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black transition-all active:scale-95 shadow-xl shadow-indigo-600/20"
                    >
                        Back to Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="px-8 py-4 rounded-2xl bg-white dark:bg-neutral-800 border-2 border-neutral-100 dark:border-neutral-700 font-black text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all active:scale-95 shadow-sm"
                    >
                        Go Back
                    </button>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="fixed top-1/4 left-1/4 w-64 h-64 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-1/4 right-1/4 w-64 h-64 bg-violet-500/5 blur-[120px] rounded-full pointer-events-none" />
        </div>
    )
}

export default NotFound
