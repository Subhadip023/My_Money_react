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
        search: '',
        type: 'all',
        category: 'all',
        account: 'all'
    })

    const user = useSelector((state) => state.auth.user)

    const fetchData = async () => {
        try {
            const [txRes, catRes, accRes] = await Promise.all([
                transactionService.getTransactions({ userId: user.$id }),
                categoryService.getCategories({ userId: user.$id }),
                accountService.getAccounts({ userId: user.$id })
            ])
            setTransactions(txRes.documents)
            setCategories(catRes.documents)
            setAccounts(accRes.documents)
        } catch (error) {
            console.error(error)
            toast.error('Failed to fetch data')
        }
    }

    useEffect(() => {
        if (user) fetchData()
    }, [user])

    const handleFilterChange = (name, value) => {
        console.log(name,value)
        setFilters(prev => ({ ...prev, [name]: value }))
    }

    const clearFilters = () => {
        setFilters({
            search: '',
            type: 'all',
            category: 'all',
            account: 'all'
        })
    }

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = tx.label.toLowerCase().includes(filters.search.toLowerCase())
        const matchesType = filters.type === 'all' || tx.type === filters.type
        const matchesCategory = filters.category === 'all' || (tx.categories?.$id === filters.category || tx.categories === filters.category)
        const matchesAccount = filters.account === 'all' || (tx.accounts?.$id === filters.account || tx.accounts === filters.account)
        
        return matchesSearch && matchesType && matchesCategory && matchesAccount
    })

    const handleTransactionSaved = () => {
        fetchData()
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

    const exportExcel = () => {
        exportTransactionsToExcel(filteredTransactions, 'transactions.xlsx')
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
           {/* <TransactionFilters 
                categories={categories}
                accounts={accounts}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClear={clearFilters}
            /> */}

            {/* Premium Transaction List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                        Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
                    </span>
                </div>
                <TransactionTable 
                    transactions={filteredTransactions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
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