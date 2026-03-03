import React from 'react'
import { cn } from '../utils'

const transactions = [
    { id: 1, label: 'Starbucks Coffee', date: '2026-03-01', type: 'expense', amount: 5.50, category: 'Food' },
    { id: 2, label: 'Freelance Payment', date: '2026-03-02', type: 'income', amount: 1200.00, category: 'Work' },
    { id: 3, label: 'Apple Subscription', date: '2026-03-03', type: 'expense', amount: 14.99, category: 'Digital' },
    { id: 4, label: 'Rent Refund', date: '2026-02-28', type: 'income', amount: 50.00, category: 'Housing' },
    { id: 5, label: 'Amazon Purchase', date: '2026-02-27', type: 'expense', amount: 124.20, category: 'Shopping' },
]

export default function Transactions() {
    return (
        <div className='max-w-5xl mx-auto space-y-10'>
            {/* Header */}
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
                <div className="space-y-2">
                    <h1 className='text-4xl font-black tracking-tight'>Transactions</h1>
                    <p className='text-neutral-500 dark:text-neutral-400 font-medium'>
                        Detailed history of your income and expenditures across all accounts.
                    </p>
                </div>
            </div>

            {/* Premium Transaction List */}
            <div className="overflow-hidden rounded-3xl border border-neutral-100 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/30 backdrop-blur-sm shadow-sm">
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className='bg-neutral-50/50 dark:bg-neutral-800/50'>
                            <th className='px-8 py-5 text-sm font-bold uppercase tracking-widest text-neutral-400'>Transaction</th>
                            <th className='px-8 py-5 text-sm font-bold uppercase tracking-widest text-neutral-400'>Date</th>
                            <th className='px-8 py-5 text-sm font-bold uppercase tracking-widest text-neutral-400'>Category</th>
                            <th className='px-8 py-5 text-sm font-bold uppercase tracking-widest text-neutral-400 text-right'>Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className='hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors'>
                                <td className='px-8 py-6'>
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center text-xl",
                                            tx.type === 'income' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                                        )}>
                                            {tx.type === 'income' ? '↙' : '↗'}
                                        </div>
                                        <span className="font-bold text-neutral-900 dark:text-white">{tx.label}</span>
                                    </div>
                                </td>
                                <td className='px-8 py-6 text-neutral-500 dark:text-neutral-400 font-medium'>
                                    {new Date(tx.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </td>
                                <td className='px-8 py-6'>
                                    <span className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-700 text-xs font-bold text-neutral-600 dark:text-neutral-300">
                                        {tx.category}
                                    </span>
                                </td>
                                <td className={cn(
                                    'px-8 py-6 text-right font-black tabular-nums text-lg',
                                    tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-900 dark:text-white'
                                )}>
                                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}