import React from 'react'
import { cn } from '../../utils'
import Button from './Button'

const TransactionTypeToggle = ({ value, onChange }) => {
    return (
        <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-2xl dark:text-white">
            <Button
                variant="ghost"
                onClick={() => onChange('expense')}
                className={cn(
                    "flex-1 py-3 rounded-xl font-bold transition-all hover:bg-transparent",
                    value === 'expense'
                        ? "bg-white dark:bg-neutral-700 text-rose-600 shadow-sm hover:bg-white dark:hover:bg-neutral-700"
                        : "text-neutral-500"
                )}
            >
                Expense
            </Button>
            <Button
                variant="ghost"
                onClick={() => onChange('income')}
                className={cn(
                    "flex-1 py-3 rounded-xl font-bold transition-all hover:bg-transparent",
                    value === 'income'
                        ? "bg-white dark:bg-neutral-700 text-emerald-600 shadow-sm hover:bg-white dark:hover:bg-neutral-700"
                        : "text-neutral-500"
                )}
            >
                Income
            </Button>
        </div>
    )
}

export default TransactionTypeToggle
