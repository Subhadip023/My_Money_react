import React, { useState, useEffect } from 'react'
import AddAccountModal from '../components/ui/AddAccountModal'
import EditAccountModal from '../components/ui/EditAccountModal'
import TransferModal from '../components/ui/TransferModal'
import { cn } from '../utils'
import accountService from '../appwrite/account'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

export default function Accounts() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState(null)
    const [accounts, setAccounts] = useState([])
    const user = useSelector((state) => state.auth.user)

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await accountService.getAccounts({ userId: user.$id })
                setAccounts(res.documents)
                console.log(res.documents)
            } catch (error) {
                console.log(error)
                toast.error('Failed to fetch accounts')
            }
        }
        fetchAccounts()
    }, [user.$id])

    const fetchAccounts = async () => {
        try {
            const res = await accountService.getAccounts({ userId: user.$id })
            setAccounts(res.documents)
        } catch (error) {
            toast.error('Failed to fetch accounts')
        }
    }

    const handleTransferComplete = () => {
        fetchAccounts()
    }

    const handleDeleteAccount = async (documentId) => {
        try {
            await accountService.deleteAccount(documentId)
            setAccounts((prev) => prev.filter((account) => account.$id !== documentId))
            toast.success('Account deleted successfully')
        } catch (error) {
            console.log(error)
            toast.error('Failed to delete account')
        }
    }

    const handleEditAccount = (account) => {
        setSelectedAccount(account)
        setIsEditModalOpen(true)
    }

    const handleUpdateAccount = (updatedAccount) => {
        setAccounts((prev) => prev.map((account) =>
            account.$id === updatedAccount.$id ? updatedAccount : account
        ))
        toast.success('Account updated successfully')
    }

    const handleAddAccount = (newAccount) => {
        setAccounts((prev) => [...prev, newAccount])
        toast.success('Account added successfully')
    }

    return (
        <div className='w-full space-y-10'>
            {/* Header Section */}
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
                <div className="space-y-2">
                    <h1 className='text-4xl font-black tracking-tight'>Accounts</h1>
                    <p className='text-neutral-500 dark:text-neutral-400 font-medium'>
                        Manage your financial institutions and monitor individual balances.
                    </p>
                </div>
                <div className='flex gap-4'>
                    <button
                        className='px-8 py-4 rounded-2xl bg-white dark:bg-neutral-800 border-2 border-neutral-100 dark:border-neutral-700 text-neutral-900 dark:text-white font-black text-lg transition-all active:scale-95 shadow-sm hover:bg-neutral-50 flex items-center gap-2 cursor-pointer'
                        onClick={() => setIsTransferModalOpen(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-indigo-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                        </svg>
                        Transfer
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className='px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg transition-all active:scale-95 shadow-xl shadow-indigo-600/20 flex items-center gap-2 cursor-pointer'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Account
                    </button>
                </div>
            </div>
            <div className='flex items-center justify-end gap-x-5'>
                <h2 className='text-xl font-black tracking-tight'>Total Balance</h2>
                <p className='text-xl font-black tracking-tight'>₹{accounts.reduce((total, account) => total + (account.accountType === 'asset' ? account.balance : -account.balance), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            </div>
            {/* Table Section */}
            <div className="overflow-hidden rounded-3xl border border-neutral-100 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/30 backdrop-blur-sm shadow-sm">
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className='bg-neutral-50/50 dark:bg-neutral-800/50'>
                            <th className='px-8 py-5 text-sm font-bold uppercase tracking-widest text-neutral-400'>Account Name</th>
                            <th className='px-8 py-5 text-sm font-bold uppercase tracking-widest text-neutral-400'>Account Type</th>
                            <th className='px-8 py-5 text-sm font-bold uppercase tracking-widest text-neutral-400 text-right'>Balance</th>
                            <th className='px-8 py-5 text-sm font-bold uppercase tracking-widest text-neutral-400 text-right'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
                        {accounts.map((account) => (
                            <tr key={account.$id || account.id || Math.random()} className='hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group'>
                                <td className='px-8 py-6'>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black">
                                            {account?.accountName?.slice(0, 2).toUpperCase() || 'NA'}
                                        </div>
                                        <span className="font-bold text-neutral-900 dark:text-white">{account.accountName || 'Unnamed Account'}</span>
                                    </div>
                                </td>
                                <td className='px-8 py-6 text-neutral-500 dark:text-neutral-400 font-medium'>
                                    {account.accountType || 'N/A'}
                                </td>
                                <td className='px-8 py-6 text-right'>
                                    <span className="text-xl font-black text-neutral-900 dark:text-white tabular-nums">
                                        ₹{account.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </span>
                                </td>
                                <td className='px-8 py-6 text-right'>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEditAccount(account)}
                                            className='px-4 py-2 rounded-xl border-2 border-indigo-600/20 text-indigo-600 hover:bg-indigo-600 hover:text-white font-bold transition-all active:scale-95 cursor-pointer'
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAccount(account.$id)}
                                            className='px-4 py-2 rounded-xl border-2 border-rose-600/20 text-rose-600 hover:bg-rose-600 hover:text-white font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-2'
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            <AddAccountModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAccountAdded={handleAddAccount}
            />

            <EditAccountModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                account={selectedAccount}
                onAccountUpdated={handleUpdateAccount}
            />

            <TransferModal
                isOpen={isTransferModalOpen}
                onClose={() => setIsTransferModalOpen(false)}
                onTransferComplete={handleTransferComplete}
            />
        </div>
    )
}