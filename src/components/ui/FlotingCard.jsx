import React from 'react'

export default function Card({ children }) {
    return (
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm transition-all hover:-translate-y-1">
            {children}
        </div>
    )
}
