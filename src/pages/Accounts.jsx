import React, { useState, useEffect } from 'react'
import AddAccountModal from '../components/ui/AddAccountModal'
import EditAccountModal from '../components/ui/EditAccountModal'
import TransferModal from '../components/ui/TransferModal'
import AddAmountModal from '../components/ui/AddAmountModal'
import { accountService } from '../services'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import Button from '../components/shared/Button'

export default function Accounts() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isAddAmountModalOpen, setIsAddAmountModalOpen] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState(null)
    const [accounts, setAccounts] = useState([])
    const user = useSelector((state) => state.auth.user)

    const fetchAccounts = async () => {
        try {
            const res = await accountService.getAccounts({ userId: user.$id })
            setAccounts(res.documents)
        } catch (error) {
            toast.error('Failed to fetch accounts')
        }
    }

    useEffect(() => {
        if (user?.$id) fetchAccounts()
    }, [user?.$id])

    const handleDeleteAccount = async (documentId) => {
        if (!window.confirm("Delete this account?")) return
        try {
            await accountService.deleteAccount(documentId)
            setAccounts((prev) => prev.filter((account) => account.$id !== documentId))
            toast.success('Account deleted')
        } catch (error) {
            toast.error('Failed to delete account')
        }
    }

    const handleEditAccount = (account) => {
        setSelectedAccount(account)
        setIsEditModalOpen(true)
    }

    const handleAddAmount = (account) => {
        setSelectedAccount(account)
        setIsAddAmountModalOpen(true)
    }

    const handleUpdateAccount = (updatedAccount) => {
        setAccounts((prev) => prev.map((account) =>
            account.$id === updatedAccount.$id ? updatedAccount : account
        ))
        toast.success('Account updated')
    }

    const handleAddAccount = (newAccount) => {
        setAccounts((prev) => [...prev, newAccount])
        toast.success('Account added')
    }

    const totalBalance = accounts.reduce((total, account) =>
        total + (account.accountType === 'asset' ? account.balance : -account.balance), 0
    )

    return (
        <div className='w-full space-y-10'>
            <header className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
                <div className="space-y-2">
                    <h1 className='text-4xl font-black tracking-tight'>Accounts</h1>
                    <p className='text-neutral-500 dark:text-neutral-400 font-medium'>
                        Manage your financial institutions and monitor individual balances.
                    </p>
                </div>
                <div className='flex gap-3'>
                    <Button
                        variant="secondary"
                        onClick={() => setIsTransferModalOpen(true)}
                        icon={() => (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-indigo-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                            </svg>
                        )}
                    >
                        Transfer
                    </Button>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        icon={() => (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        )}
                    >
                        Add Account
                    </Button>
                </div>
            </header>

            <div className='flex items-center justify-end gap-x-5 px-4'>
                <h2 className='text-sm font-black uppercase tracking-widest text-neutral-400'>Total Liquid Balance</h2>
                <p className='text-2xl font-black tracking-tight tabular-nums text-indigo-600 dark:text-indigo-400'>
                    ₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
            </div>

            <div className="overflow-x-auto overflow-y-hidden rounded-3xl border border-neutral-100 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/30 backdrop-blur-sm shadow-sm ring-1 ring-black/5 dark:ring-white/5">
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className='bg-neutral-50/50 dark:bg-neutral-800/50'>
                            <th className='px-8 py-5 text-xs font-black uppercase tracking-widest text-neutral-400'>Account Name</th>
                            <th className='px-8 py-5 text-xs font-black uppercase tracking-widest text-neutral-400'>Type</th>
                            <th className='px-8 py-5 text-xs font-black uppercase tracking-widest text-neutral-400 text-right'>Balance</th>
                            <th className='px-8 py-5 text-xs font-black uppercase tracking-widest text-neutral-400 text-right'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
                        {accounts.map((account) => (
                            <tr key={account.$id} className='hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group'>
                                <td className='px-8 py-6'>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black">
                                            {account?.accountName?.slice(0, 2).toUpperCase()}
                                        </div>
                                        <span className="font-bold text-neutral-900 dark:text-white capitalize">{account.accountName}</span>
                                    </div>
                                </td>
                                <td className='px-8 py-6 text-neutral-500 dark:text-neutral-400 font-medium capitalize'>
                                    {account.accountType}
                                </td>
                                <td className='px-8 py-6 text-right'>
                                    <span className="text-xl font-black text-neutral-900 dark:text-white tabular-nums">
                                        ₹{account.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </span>
                                </td>
                                <td className='px-8 py-6 text-right'>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleAddAmount(account)}>Add Funds</Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleEditAccount(account)}>Edit</Button>
                                        <Button variant="danger" size="sm" onClick={() => handleDeleteAccount(account.$id)}>Delete</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AddAccountModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAccountAdded={handleAddAccount} />
            <EditAccountModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} account={selectedAccount} onAccountUpdated={handleUpdateAccount} />
            <AddAmountModal isOpen={isAddAmountModalOpen} onClose={() => setIsAddAmountModalOpen(false)} account={selectedAccount} onAmountAdded={fetchAccounts} />
            <TransferModal isOpen={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)} onTransferComplete={fetchAccounts} />
        </div>
    )
}