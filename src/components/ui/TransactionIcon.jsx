import React from 'react';
import { cn } from '../../utils';

export default function TransactionIcon({ type, className }) {
    return (
        <div className={cn(
            "flex items-center justify-center text-xl rounded-xl shrink-0",
            type === 'income' 
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" 
                : "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
            className
        )}>
            {type === 'income' ? '↙' : '↗'}
        </div>
    );
}
