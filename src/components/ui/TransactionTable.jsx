import React from 'react';
import TransactionIcon from './TransactionIcon';
import Button from '../shared/Button';
import { cn } from '../../utils';

export default function TransactionTable({ 
    transactions = [], 
    onEdit, 
    onDelete, 
    showActions = true,
    showAccount = true,
    showCategory = true,
    limit 
}) {
    const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

    if (transactions.length === 0) {
        return (
            <div className="py-20 text-center text-neutral-500 font-medium">
                <div className="text-4xl mb-4 opacity-20">📭</div>
                No transactions found.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-3xl border border-neutral-100 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/30 backdrop-blur-sm shadow-sm">
            <table className='w-full text-left border-collapse'>
                <thead>
                    <tr className='bg-neutral-50/50 dark:bg-neutral-800/50'>
                        <th className='px-8 py-5 text-sm font-bold uppercase tracking-widest text-neutral-400'>Transaction</th>
                        <th className='px-8 py-5 text-sm font-bold uppercase tracking-widest text-neutral-400'>Date</th>
                        {showCategory && <th className='px-8 py-5 text-sm font-bold uppercase tracking-widest text-neutral-400'>Category</th>}
                        <th className='px-8 py-5 text-sm font-bold uppercase tracking-widest text-neutral-400 text-right'>Amount</th>
                        {showActions && <th className='px-8 py-5 text-sm font-bold uppercase tracking-widest text-neutral-400 text-right'>Action</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
                    {displayTransactions.map((tx) => (
                        <tr key={tx.$id} className='hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group'>
                            <td className='px-8 py-6'>
                                <div className="flex items-center gap-4">
                                    <TransactionIcon type={tx.type} className="w-10 h-10" />
                                    <div className='flex flex-col min-w-[120px]'>
                                        <span className="font-bold text-neutral-900 dark:text-white truncate max-w-[200px]">{tx.label}</span>
                                        {showAccount && (
                                            <span className='text-xs text-neutral-400 font-medium'>
                                                {tx.accounts?.accountName || 'Unknown Account'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className='px-8 py-6 text-neutral-500 dark:text-neutral-400 font-medium whitespace-nowrap'>
                                {new Date(tx.$createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            {showCategory && (
                                <td className='px-8 py-6'>
                                    <span className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-700 text-xs font-bold text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                                        {tx.categories?.name || 'Uncategorized'}
                                    </span>
                                </td>
                            )}
                            <td className={cn(
                                'px-8 py-6 text-right font-black tabular-nums text-lg',
                                tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-900 dark:text-white'
                            )}>
                                {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            {showActions && (
                                <td className='px-8 py-6 text-right'>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            onClick={() => onEdit?.(tx)}
                                            className="p-2 text-indigo-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-30"
                                            title="Edit"
                                            disabled={!onEdit}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => onDelete?.(tx.$id)}
                                            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 disabled:opacity-30"
                                            title="Delete"
                                            disabled={!onDelete}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </Button>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
