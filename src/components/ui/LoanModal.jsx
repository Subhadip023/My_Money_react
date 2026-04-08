import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import Button from '../shared/Button'
import { useSelector, useDispatch } from 'react-redux'
import loanService from '../../appwrite/loans'
import accountService from '../../appwrite/account'
import transactionService from '../../appwrite/transaction'
import { categoryService } from '../../services'
import { setLoading } from '../../redux/uiSlice'
import toast from 'react-hot-toast'

const LoanModal = ({ isOpen, onClose, loan, onLoanSaved }) => {
    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch()

    const [accounts, setAccounts] = useState([])
    const [categories, setCategories] = useState([])
    const [formData, setFormData] = useState({
        loanName: '',
        loanType: 'given',
        principalAmount: '',
        outstandingAmount: '',
        interestRate: '',
        dueDate: new Date().toISOString().split('T')[0],
        status: 'active',
        accountId: '',
        categoryId: '',
        trackTransaction: true
    })

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return
            try {
                const [accRes, catRes] = await Promise.all([
                    accountService.getAccounts({ userId: user.$id }),
                    categoryService.getCategories({ userId: user.$id })
                ])
                setAccounts(accRes.documents)
                setCategories(catRes.documents)

                if (accRes.documents.length > 0 && !formData.accountId) {
                    setFormData(prev => ({ ...prev, accountId: accRes.documents[0].$id }))
                }
            } catch (error) {
                console.error("Failed to fetch accounts/categories", error)
            }
        }
        if (isOpen) fetchData()
    }, [user, isOpen])

    useEffect(() => {
        if (!loan) {
            setFormData(prev => ({ ...prev, outstandingAmount: prev.principalAmount }))
        }
    }, [formData.principalAmount, loan])

    useEffect(() => {
        if (loan) {
            setFormData({
                loanName: loan.loanName,
                loanType: loan.loanType,
                principalAmount: loan.principalAmount,
                outstandingAmount: loan.outstandingAmount,
                interestRate: loan.interestRate || '',
                dueDate: loan.dueDate ? new Date(loan.dueDate).toISOString().split('T')[0] : '',
                status: loan.status,
                accountId: '',
                categoryId: '',
                trackTransaction: false
            })
        } else {
            setFormData({
                loanName: '',
                loanType: 'given',
                principalAmount: '',
                outstandingAmount: '',
                interestRate: '',
                dueDate: new Date().toISOString().split('T')[0],
                status: 'active',
                accountId: accounts[0]?.$id || '',
                categoryId: '',
                trackTransaction: true
            })
        }
    }, [loan, isOpen, accounts])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!user) return

        if (formData.trackTransaction && !formData.accountId) {
            toast.error("Please select an account to track the transaction")
            return
        }

        dispatch(setLoading(true))
        try {
            const data = {
                loanName: formData.loanName,
                loanType: formData.loanType,
                principalAmount: Number(formData.principalAmount),
                outstandingAmount: Number(formData.outstandingAmount),
                interestRate: formData.interestRate ? Number(formData.interestRate) : null,
                dueDate: formData.dueDate,
                status: formData.status,
                userId: user.$id
            }

            if (loan) {
                await loanService.updateLoan(loan.$id, data)
                toast.success('Loan updated successfully')
            } else {
                const newLoan = await loanService.createLoan(data)

                if (formData.trackTransaction && formData.accountId != 0) {
                    const txType = formData.loanType === 'given' ? 'expense' : 'income'
                    const label = `${formData.loanType === 'given' ? 'Loan Given' : 'Loan Taken'}: ${formData.loanName}`

                    // Find a category related to loans if possible, otherwise use null
                    const loanCategory = categories.find(c => c.name.toLowerCase().includes('loan'))
                    const finalCategoryId = formData.categoryId || (loanCategory ? loanCategory.$id : null)
                    if (formData.accountId != 0) {
                        await transactionService.createTransaction({
                            label,
                            amount: Number(formData.principalAmount),
                            type: txType,
                            userId: user.$id,
                            accountId: formData.accountId,
                            categoryId: finalCategoryId,
                            loans: newLoan.$id
                        })
                    }
                    toast.success('Transaction created and balance updated')
                }
                toast.success('Loan added successfully')
            }
            onLoanSaved()
            onClose()
        } catch (error) {
            toast.error(error.message || 'Failed to save loan')
        } finally {
            dispatch(setLoading(false))
        }
    }

    const loanTypes = ['given', 'taken']
    const statuses = ['active', 'settled']

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={loan ? "Edit Loan" : "Add New Loan"}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 ml-1">Loan Name</label>
                        <input
                            required
                            disabled={!!loan}
                            type="text"
                            value={formData.loanName}
                            onChange={(e) => setFormData({ ...formData, loanName: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-neutral-900 dark:text-white transition-all font-bold placeholder:text-neutral-300 dark:placeholder:text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="e.g. Person Name / Entity"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 ml-1">Loan Type</label>
                        <select
                            disabled={!!loan}
                            value={formData.loanType}
                            onChange={(e) => setFormData({ ...formData, loanType: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-neutral-900 dark:text-white transition-all font-black appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loanTypes.map(type => (
                                <option key={type} value={type} className="dark:bg-neutral-900">{type === 'given' ? '📤 Loan Given' : '📥 Loan Taken'}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 ml-1">Principal Amount (₹)</label>
                        <input
                            required
                            disabled={!!loan}
                            type="number"
                            step="0.01"
                            value={formData.principalAmount}
                            onChange={(e) => setFormData({ ...formData, principalAmount: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-neutral-900 dark:text-white transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 ml-1">Outstanding Amount (₹)</label>
                        <input
                            required
                            type="number"
                            step="0.01"
                            value={formData.outstandingAmount}
                            onChange={(e) => setFormData({ ...formData, outstandingAmount: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-neutral-900 dark:text-white transition-all font-bold ring-2 ring-emerald-500/20"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 ml-1">Interest Rate (%)</label>
                        <input
                            disabled={!!loan}
                            type="number"
                            step="0.01"
                            value={formData.interestRate}
                            onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-neutral-900 dark:text-white transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="e.g. 8.5"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 ml-1">Due Date</label>
                        <input
                            required
                            disabled={!!loan}
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-neutral-900 dark:text-white transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 ml-1">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-neutral-900 dark:text-white transition-all font-black appearance-none cursor-pointer"
                        >
                            {statuses.map(s => (
                                <option key={s} value={s} className="dark:bg-neutral-900">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 ml-1">Funding Account</label>
                        <select
                            value={formData.accountId}
                            onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-neutral-900 dark:text-white transition-all font-black appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="0" selected className="dark:bg-neutral-900">Select Account</option>
                            {accounts.map(acc => (
                                <option key={acc.$id} value={acc.$id} className="dark:bg-neutral-900">{acc.accountName} (₹{acc.balance})</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="pt-4 flex gap-3">
                    <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                        {loan ? 'Update Loan' : 'Add Loan'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default LoanModal
