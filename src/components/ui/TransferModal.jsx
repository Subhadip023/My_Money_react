import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../../redux/uiSlice'
import toast from 'react-hot-toast'
import Modal from './Modal'
import { cn } from '../../utils'
import accountService from '../../appwrite/account'
import transactionService from '../../appwrite/transaction'

const TransferModal = ({ isOpen, onClose, onTransferComplete }) => {
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const loading = useSelector((state) => state.ui.loading)
    const [accounts, setAccounts] = useState([])

    useEffect(() => {
        if (isOpen && user) {
            const fetchAccounts = async () => {
                try {
                    const res = await accountService.getAccounts({ userId: user.$id })
                    setAccounts(res.documents)
                } catch (error) {
                    toast.error("Failed to load accounts")
                }
            }
            fetchAccounts()
        }
    }, [isOpen, user])

    const onSubmit = async (data) => {
        if (loading) return
        if (data.fromAccount === data.toAccount) {
            toast.error("Source and destination accounts cannot be the same")
            return
        }

        dispatch(setLoading(true))
        try {
            const amount = parseFloat(data.amount)

            // 1. Perform balance updates
            await accountService.transferAmount({
                userId: user.$id,
                fromAccountId: data.fromAccount,
                toAccountId: data.toAccount,
                amount: amount
            })

            // 2. Create Transaction records for history
            // Record withdrawal
            await transactionService.createTransaction({
                label: `Transfer to ${accounts.find(a => a.$id === data.toAccount)?.accountName}`,
                amount: amount,
                type: 'transfer',
                userId: user.$id,
                accountId: data.fromAccount,
                categoryId: null,
                skipBalanceUpdate: true
            })

            // Record deposit
            await transactionService.createTransaction({
                label: `Transfer from ${accounts.find(a => a.$id === data.fromAccount)?.accountName}`,
                amount: amount,
                type: 'income',
                userId: user.$id,
                accountId: data.toAccount,
                categoryId: null,
                skipBalanceUpdate: true
            })

            toast.success("Transfer completed successfully")
            onTransferComplete()
            reset()
            onClose()
        } catch (error) {
            toast.error(error.message || "Transfer failed")
        } finally {
            dispatch(setLoading(false))
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Transfer Amount">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold mb-2 ml-1 text-neutral-700 dark:text-neutral-300">
                        From Account
                    </label>
                    <select
                        {...register("fromAccount", { required: "Source account is required" })}
                        className={cn(
                            "w-full px-5 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border-2 transition-all outline-none appearance-none",
                            errors.fromAccount ? "border-rose-500" : "border-neutral-100 dark:text-white dark:border-neutral-700 focus:border-indigo-500"
                        )}
                    >
                        <option value="">Select Source Account</option>
                        {accounts.map(acc => (
                            <option key={acc.$id} value={acc.$id}>{acc.accountName} (₹{acc.balance.toLocaleString()})</option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-center -my-2 relative z-10">
                    <div className="bg-white dark:bg-neutral-900 p-2 rounded-full border-2 border-neutral-100 dark:border-neutral-800">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-indigo-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                        </svg>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2 ml-1 text-neutral-700 dark:text-neutral-300">
                        To Account
                    </label>
                    <select
                        {...register("toAccount", { required: "Destination account is required" })}
                        className={cn(
                            "w-full px-5 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 dark:text-white border-2 transition-all outline-none appearance-none",
                            errors.toAccount ? "border-rose-500" : "border-neutral-100 dark:border-neutral-700 focus:border-indigo-500"
                        )}
                    >
                        <option value="">Select Destination Account</option>
                        {accounts.map(acc => (
                            <option key={acc.$id} value={acc.$id}>{acc.accountName} (₹{acc.balance.toLocaleString()})</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2 ml-1 text-neutral-700 dark:text-neutral-300">
                        Amount
                    </label>
                    <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">₹</span>
                        <input
                            type="number"
                            step="0.01"
                            {...register("amount", { required: "Amount is required", min: { value: 1, message: "Min amount is ₹1" } })}
                            className={cn(
                                "w-full px-10 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 dark:text-white border-2 transition-all outline-none",
                                errors.amount ? "border-rose-500" : "border-neutral-100 dark:border-neutral-700 focus:border-indigo-500"
                            )}
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="pt-4 flex gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold transition-all hover:bg-neutral-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                            "flex-1 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg transition-all active:scale-[0.98] shadow-xl shadow-indigo-600/20",
                            loading && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {loading ? 'Processing...' : 'Transfer Now'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default TransferModal
