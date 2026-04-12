import React from 'react';
import { cn } from '../../utils';
import { GoArrowUpRight, GoArrowDownLeft } from "react-icons/go";

export default function TransactionIcon({ type, className }) {
    const isIncome = type === 'income';

    return (
        <div className={cn(
            "flex items-center justify-center rounded-xl p-2.5",
            isIncome
                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
            className
        )}>
            {isIncome ? <GoArrowDownLeft className="text-2xl" /> : <GoArrowUpRight className="text-2xl" />}
        </div>
    );
}


