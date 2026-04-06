import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import Button from '../shared/Button'
import { useSelector, useDispatch } from 'react-redux'
import loanService from '../../appwrite/loans'
import accountService from '../../appwrite/account'
import transactionService from '../../appwrite/transaction'
import { setLoading } from '../../redux/uiSlice'
import toast from 'react-hot-toast'

const LoanSettleModal = ({ isOpen, onClose, loan, onSettled }) => {
    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch()

    const [accounts, setAccounts] = useState([])
    const [formData, setFormData] = useState({
        accountId: '',
        date: new Date().toISOString().split('T')[0],
        note: 'Full Settlement'
    })

    useEffect(() => {
        const fetchAccounts = async () => {
            if (!user) return
            try {
                const res = await accountService.getAccounts({ userId: user.$id })
                setAccounts(res.documents)
                if (res.documents.length > 0 && !formData.accountId) {
                    setFormData(prev => ({ ...prev, accountId: res.documents[0].$id }))
                }
            } catch (error) {
                console.error("Failed to fetch accounts", error)
            }
        }
        if (isOpen) fetchAccounts()
    }, [user, isOpen])

    useEffect(() => {
        if (isOpen) {
            setFormData({
                accountId: accounts[0]?.$id || '',
                date: new Date().toISOString().split('T')[0],
                note: 'Full Settlement'
            })
        }
    }, [loan, isOpen, accounts])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!user || !loan) return

        const settleAmount = Number(loan.outstandingAmount)
        if (settleAmount <= 0) {
            toast.error("Loan is already settled")
            return
        }

        dispatch(setLoading(true))
        try {
            // 1. Update Loan Outstanding to 0 and Status to Settled
            await loanService.updateLoan(loan.$id, {
                ...loan,
                outstandingAmount: 0,
                status: 'settled'
            })

            // 2. Create Transaction
            // If loanType is 'given', settling = receiving payment (income)
            // If loanType is 'taken', settling = making payment (expense)
            const txType = loan.loanType === 'given' ? 'income' : 'expense'
            const label = `${loan.loanType === 'given' ? 'Loan Settlement (Received)' : 'Loan Settlement (Paid)'}: ${loan.loanName}`
            
            await transactionService.createTransaction({
                label: formData.note ? `${label} (${formData.note})` : label,
                amount: settleAmount,
                type: txType,
                userId: user.$id,
                accountId: formData.accountId,
                categoryId: null,
                loans: loan.$id
            })

            toast.success('Loan settled successfully')
            onSettled()
            onClose()
        } catch (error) {
            toast.error(error.message || 'Failed to settle loan')
        } finally {
            dispatch(setLoading(false))
        }
    }

    if (!loan) return null

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Settle Loan: ${loan.loanName}`}>
            <form onSubmit={handleSubmit} className="space-y-6 text-center">
                <div className="p-8 rounded-[2rem] bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 mb-6 group transition-all">
                    <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 gap-2 flex items-center uppercase tracking-widest mb-2">
                           <span className="text-xl">💰</span> Settlement Amount
                        </span>
                        <span className="text-4xl font-black text-emerald-700 dark:text-white">₹{loan.outstandingAmount.toLocaleString('en-IN')}</span>
                        <p className="mt-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                            Confirming this will pay off the remaining balance in full and mark the loan as settled.
                        </p>
                    </div>
                </div>

                <div className="space-y-4 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 ml-1">Payment Account</label>
                            <select
                                required
                                value={formData.accountId}
                                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                                className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-neutral-900 dark:text-white font-bold appearance-none"
                            >
                                <option value="" disabled>Select Account</option>
                                {accounts.map(acc => (
                                    <option key={acc.$id} value={acc.$id}>{acc.accountName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 ml-1">Settlement Date</label>
                            <input
                                required
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-neutral-900 dark:text-white font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 ml-1">Note (Optional)</label>
                        <input
                            type="text"
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-neutral-900 dark:text-white font-medium"
                            placeholder="e.g. Full payoff"
                        />
                    </div>
                </div>

                <div className="pt-6 flex gap-3">
                    <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="emerald" className="flex-1">
                        Confirm Settlement
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default LoanSettleModal
