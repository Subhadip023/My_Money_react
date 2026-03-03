import React from 'react'

export default function Card({ children }) {
    return (
        <div className="group p-8 rounded-[32px] bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
            {children}
        </div>
    )
}
