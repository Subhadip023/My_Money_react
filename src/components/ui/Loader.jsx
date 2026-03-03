import React from 'react'
import { useSelector } from 'react-redux'
import { cn } from '../../utils'

const Loader = () => {
    const { isLoading } = useSelector((state) => state.ui)

    if (!isLoading) return null

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm transition-all duration-300">
            <div className="relative flex flex-col items-center">
                {/* Outer Glow */}
                <div className="absolute inset-0 w-24 h-24 bg-indigo-500/20 dark:bg-indigo-400/20 blur-3xl rounded-full scale-150 animate-pulse" />

                {/* Spinning Rings */}
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-t-4 border-indigo-600 dark:border-indigo-400 animate-spin" />
                    <div className="absolute inset-2 rounded-full border-b-4 border-violet-500 dark:border-violet-400 animate-[spin_1.5s_linear_infinite_reverse]" />
                    <div className="absolute inset-4 rounded-full border-l-4 border-emerald-500 dark:border-emerald-400 animate-[spin_2s_linear_infinite]" />
                </div>

                {/* Text */}
                <div className="mt-8 flex flex-col items-center">
                    <span className="text-xl font-bold tracking-tighter bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent animate-pulse">
                        MyMoney
                    </span>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
                        Processing Securely
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Loader
