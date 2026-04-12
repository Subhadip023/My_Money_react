import React, { useState, useEffect } from 'react'
import { cn } from '../utils'
import { transactionService, categoryService, accountService } from '../services'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import TransactionModal from '../components/ui/TransactionModal'
import TransactionTable from '../components/ui/TransactionTable'
import TransactionFilters from '../components/ui/TransactionFilters'
import Button from '../components/shared/Button'
import { exportTransactionsToExcel } from '../utils/excelExport'

export default function Transactions() {
    const [transactions, setTransactions] = useState([])
    const [categories, setCategories] = useState([])
    const [accounts, setAccounts] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedTransaction, setSelectedTransaction] = useState(null)
    const [filters, setFilters] = useState({
        label: '',
        type: 'all',
        category: 'all',
        account: 'all'
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [limit, setLimit] = useState(10)

    const user = useSelector((state) => state.auth.user)

    const fetchDropdownData = async () => {
        try {
            const [catRes, accRes] = await Promise.all([
                categoryService.getCategories({ userId: user.$id }),
                accountService.getAccounts({ userId: user.$id })
            ])
            setCategories(catRes.documents)
            setAccounts(accRes.documents)
        } catch (error) {
            console.error("Failed to fetch metadata:", error)
        }
    }

    const fetchFilteredTransactions = async () => {
        if (!user) return;
        try {
            const res = await transactionService.getTransactionsByFilters({ 
                userId: user.$id, 
                filters,
                offset: (currentPage - 1) * limit,
                limit: limit
            });
            setTransactions(res.documents)
            setTotalCount(res.total)
        } catch (error) {
            console.error("Failed to fetch filtered transactions:", error)
        }
    }

    useEffect(() => {
        if (user) {
            fetchDropdownData();
        }
    }, [user])

    useEffect(() => {
        if (user) {
            fetchFilteredTransactions();
        }
    }, [user, filters.type, filters.category, filters.account, currentPage, limit])

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }))
        setCurrentPage(1) 
    }

    const clearFilters = () => {
        setFilters({
            label: '',
            type: 'all',
            category: 'all',
            account: 'all'
        })
        setCurrentPage(1)
    }

    const filteredTransactions = transactions.filter(tx => {
        const matchesLabel = tx.label.toLowerCase().includes(filters.label.toLowerCase())
        return matchesLabel;
    })

    const handleTransactionSaved = () => {
        fetchFilteredTransactions()
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
            setTotalCount(prev => prev - 1);
            toast.success("Transaction deleted");
        } else {
            toast.error("Failed to delete transaction");
        }
    }

    const exportExcel = () => {
        exportTransactionsToExcel(filteredTransactions, 'transactions.xlsx')
    }

    const totalPages = Math.ceil(totalCount / limit);

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
                <div className='flex flex-col sm:flex-row gap-4 items-center' >
                    <Button variant="secondary" size="sm" onClick={exportExcel} className="h-12 px-6 rounded-2xl">
                        <span className="text-sm">📄</span>
                        Export Excel
                    </Button>
                    <Button
                        onClick={() => {
                            setSelectedTransaction(null)
                            setIsModalOpen(true)
                        }}
                        className='h-12 px-8 rounded-2xl cursor-pointer'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Transaction
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <TransactionFilters 
                categories={categories}
                accounts={accounts}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClear={clearFilters}
            /> 

            {/* Premium Transaction List */}
            <div className="space-y-4 pb-10">
                <div className="flex items-center justify-between px-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                        {totalCount > 0 ? (
                            `Showing ${(currentPage - 1) * limit + 1} to ${Math.min(currentPage * limit, totalCount)} of ${totalCount}`
                        ) : (
                            'No transactions found'
                        )}
                    </span>
                    {totalCount > 10 && (
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Show</span>
                            <select 
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl px-2 py-1 text-xs font-bold focus:outline-none cursor-pointer"
                            >
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    )}
                </div>
                <TransactionTable 
                    transactions={filteredTransactions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showInvestment={true}
                />

                {/* Pagination UI */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 pt-6">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                            Page {currentPage} of {totalPages}
                        </span>
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={() => {
                                    setCurrentPage(prev => Math.max(1, prev - 1));
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                disabled={currentPage === 1}
                                className="rounded-2xl px-6 h-11 bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 font-bold"
                            >
                                ← Previous
                            </Button>
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={() => {
                                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                disabled={currentPage >= totalPages}
                                className="rounded-2xl px-6 h-11 bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 font-bold"
                            >
                                Next →
                            </Button>
                        </div>
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