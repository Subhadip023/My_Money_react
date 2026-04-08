import React, { useState, useEffect } from 'react'
import { cn } from '../utils'
import transactionService from '../appwrite/transaction'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import TransactionModal from '../components/ui/TransactionModal'
import TransactionIcon from '../components/ui/TransactionIcon'
import Button from '../components/shared/Button'
import { exportTransactionsToExcel } from '../utils/excelExport'
export default function Transactions() {
    const [transactions, setTransactions] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedTransaction, setSelectedTransaction] = useState(null)
    const user = useSelector((state) => state.auth.user)

    const fetchTransactions = async () => {
        try {
            const res = await transactionService.getTransactions({ userId: user.$id })
            setTransactions(res.documents)
        } catch (error) {
            console.error(error)
            toast.error('Failed to fetch transactions')
        }
    }

    const exportExcel = () => {
        exportTransactionsToExcel(transactions, 'transactions.xlsx')
    }

    useEffect(() => {
        if (user) fetchTransactions()
    }, [user])

    const handleTransactionSaved = () => {
        fetchTransactions()
    }

    const handleEdit = (tx) => {
        setSelectedTransaction(tx)
        setIsModalOpen(true)
    }

    const handleDelete = async (id) => {
        const ok = window.confirm("Are you sure you want to delete this transaction?");
        if (!ok) return;

        const success = await transactionService.deleteTransaction(id);
        if (success) {
            setTransactions(prev => prev.filter(tx => tx.$id !== id));
            toast.success("Transaction deleted");
        } else {
            toast.error("Failed to delete transaction");
        }
    }

    return (
        <div className='w-full space-y-10'>
            {/* Header */}
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
                <div className="space-y-2">
                    <h1 className='text-4xl font-black tracking-tight'>Transactions</h1>
                    <p className='text-neutral-500 dark:text-neutral-400 font-medium'>
                        Detailed history of your income and expenditures across all accounts.
                    </p>
                </div>
                <div className='flex gap-4'>
                </div>
                <div className='flex flex-col gap-2 items-end justify-center' >
                    
                <Button
                    onClick={() => {
                        setSelectedTransaction(null)
                        setIsModalOpen(true)
                    }}
                    className='text-lg sm:px-8 sm:py-4 px-6 py-3 cursor-pointer'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Transaction
                </Button>
                <Button variant="secondary" size="sm" onClick={exportExcel}>
                        <span className="text-sm">📄</span>
                        Export Excel
                    </Button>
                </div>
            </div>

            {/* Premium Transaction List */}
            <div className="overflow-x-auto overflow-y-hidden rounded-3xl border border-neutral-100 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/30 backdrop-blur-sm shadow-sm">
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className='bg-neutral-50/50 dark:bg-neutral-800/50'>
                            <th className='px-8 py-5 text-sm font-bold uppercase tracking-widest text-neutral-400'>Transaction</th>
                            <th className='px-8 py-5 text-sm font-bold uppercase tracking-widest text-neutral-400'>Date</th>
                            <th className='px-8 py-5 text-sm font-bold uppercase tracking-widest text-neutral-400'>Category</th>
                            <th className='px-8 py-5 text-sm font-bold uppercase tracking-widest text-neutral-400 text-right'>Amount</th>
                            <th className='px-8 py-5 text-sm font-bold uppercase tracking-widest text-neutral-400 text-right'>Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
                        {transactions.map((tx) => (
                            <tr key={tx.$id} className='hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group'>
                                <td className='px-8 py-6'>
                                    <div className="flex items-center gap-4">
                                        <TransactionIcon type={tx.type} className="w-10 h-10" />
                                        <div className='flex flex-col'>
                                            <span className="font-bold text-neutral-900 dark:text-white">{tx.label}</span>
                                            <span className='text-xs text-neutral-400 font-medium'>{tx.accounts?.accountName}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className='px-8 py-6 text-neutral-500 dark:text-neutral-400 font-medium'>
                                    {new Date(tx.$createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </td>
                                <td className='px-8 py-6'>
                                    <span className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-700 text-xs font-bold text-neutral-600 dark:text-neutral-300">
                                        {tx.categories?.name || 'Uncategorized'}
                                    </span>
                                </td>
                                <td className={cn(
                                    'px-8 py-6 text-right font-black tabular-nums text-lg',
                                    tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-900 dark:text-white'
                                )}>
                                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                                <td className='px-8 py-6 text-right'>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleEdit(tx)}
                                            className="p-2 text-indigo-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                            title="Edit"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleDelete(tx.$id)}
                                            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                                            title="Delete"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {transactions.length === 0 && (
                    <div className="p-20 text-center text-neutral-500 font-medium">
                        No transactions found.
                    </div>
                )}
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                transaction={selectedTransaction}
                onTransactionSaved={handleTransactionSaved}
            />
        </div>
    )
}