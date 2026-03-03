import React from 'react'
import { cn } from '../../utils'

const TransactionTypeToggle = ({ value, onChange }) => {
    return (
        <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-2xl dark:text-white">
            <button
                type="button"
                onClick={() => onChange('expense')}
                className={cn(
                    "flex-1 py-3 rounded-xl font-bold transition-all",
                    value === 'expense'
                        ? "bg-white dark:bg-neutral-700 text-rose-600 shadow-sm"
                        : "text-neutral-500"
                )}
            >
                Expense
            </button>
            <button
                type="button"
                onClick={() => onChange('income')}
                className={cn(
                    "flex-1 py-3 rounded-xl font-bold transition-all",
                    value === 'income'
                        ? "bg-white dark:bg-neutral-700 text-emerald-600 shadow-sm"
                        : "text-neutral-500"
                )}
            >
                Income
            </button>
        </div>
    )
}

export default TransactionTypeToggle
