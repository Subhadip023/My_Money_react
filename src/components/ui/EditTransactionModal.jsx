import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../../redux/uiSlice'
import toast from 'react-hot-toast'
import Modal from './Modal'
import { cn } from '../../utils'
import transactionService from '../../appwrite/transaction'
import accountService from '../../appwrite/account'
import categoryService from '../../appwrite/category'

const EditTransactionModal = ({ isOpen, onClose, transaction, onTransactionUpdated }) => {
    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const loading = useSelector((state) => state.ui.loading)
    const [accounts, setAccounts] = useState([])
    const [categories, setCategories] = useState([])

    useEffect(() => {
        if (isOpen && user) {
            const fetchData = async () => {
                try {
                    const [accRes, catRes] = await Promise.all([
                        accountService.getAccounts({ userId: user.$id }),
                        categoryService.getCategories({ userId: user.$id })
                    ])
                    setAccounts(accRes.documents)
                    setCategories(catRes.documents)
                } catch (error) {
                    console.error("Failed to fetch accounts/categories:", error)
                }
            }
            fetchData()
        }
    }, [isOpen, user])

    useEffect(() => {
        if (transaction && accounts.length > 0 && categories.length > 0) {
            setValue("label", transaction.label)
            setValue("amount", transaction.amount)
            setValue("type", transaction.type)
            // Handle both expanded object and plain ID string
            const accId = typeof transaction.accounts === 'object' ? transaction.accounts?.$id : transaction.accounts
            const catId = typeof transaction.categories === 'object' ? transaction.categories?.$id : transaction.categories

            setValue("accountId", accId)
            setValue("categoryId", catId)
        }
    }, [transaction, setValue, accounts, categories])

    const onSubmit = async (data) => {
        if (loading) return
        dispatch(setLoading(true))
        try {
            const res = await transactionService.updateTransaction(transaction.$id, {
                label: data.label,
                amount: parseFloat(data.amount),
                type: data.type,
                accountId: data.accountId,
                categoryId: data.categoryId
            })

            onTransactionUpdated(res)
            onClose()
            toast.success("Transaction updated successfully")
        } catch (error) {
            toast.error(error.message || 'Failed to update transaction.')
        } finally {
            dispatch(setLoading(false))
        }
    }

    const transactionType = watch('type')

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Transaction">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Transaction Type Toggle */}
                <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-2xl">
                    <button
                        type="button"
                        onClick={() => setValue('type', 'expense')}
                        className={cn(
                            "flex-1 py-3 rounded-xl font-bold transition-all",
                            transactionType === 'expense'
                                ? "bg-white dark:bg-neutral-700 text-rose-600 shadow-sm"
                                : "text-neutral-500"
                        )}
                    >
                        Expense
                    </button>
                    <button
                        type="button"
                        onClick={() => setValue('type', 'income')}
                        className={cn(
                            "flex-1 py-3 rounded-xl font-bold transition-all",
                            transactionType === 'income'
                                ? "bg-white dark:bg-neutral-700 text-emerald-600 shadow-sm"
                                : "text-neutral-500"
                        )}
                    >
                        Income
                    </button>
                    <input type="hidden" {...register("type")} />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2 ml-1 text-neutral-700 dark:text-neutral-300">
                        Description / Label
                    </label>
                    <input
                        {...register("label", { required: "Description is required" })}
                        className={cn(
                            "w-full px-5 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border-2 transition-all outline-none",
                            errors.label
                                ? "border-rose-500/50 focus:border-rose-500"
                                : "border-neutral-100 dark:border-neutral-700 focus:border-indigo-500"
                        )}
                        placeholder="e.g., Grocery shopping"
                    />
                    {errors.label && (
                        <p className="mt-2 ml-1 text-xs font-bold text-rose-500 uppercase tracking-wider">
                            {errors.label.message}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-2 ml-1 text-neutral-700 dark:text-neutral-300">
                            Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">₹</span>
                            <input
                                type="number"
                                step="0.01"
                                {...register("amount", { required: "Amount is required", min: { value: 0.01, message: "Amount must be positive" } })}
                                className={cn(
                                    "w-full px-10 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border-2 transition-all outline-none",
                                    errors.amount
                                        ? "border-rose-500/50 focus:border-rose-500"
                                        : "border-neutral-100 dark:border-neutral-700 focus:border-indigo-500"
                                )}
                                placeholder="0.00"
                            />
                        </div>
                        {errors.amount && (
                            <p className="mt-2 ml-1 text-xs font-bold text-rose-500 uppercase tracking-wider">
                                {errors.amount.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2 ml-1 text-neutral-700 dark:text-neutral-300">
                            Account
                        </label>
                        <select
                            {...register("accountId", { required: "Account is required" })}
                            className={cn(
                                "w-full px-5 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border-2 transition-all outline-none appearance-none",
                                errors.accountId
                                    ? "border-rose-500/50 focus:border-rose-500"
                                    : "border-neutral-100 dark:border-neutral-700 focus:border-indigo-500"
                            )}
                        >
                            <option value="">Select Account</option>
                            {accounts.map(acc => (
                                <option key={acc.$id} value={acc.$id}  >{acc.accountName}</option>
                            ))}
                        </select>
                        {errors.accountId && (
                            <p className="mt-2 ml-1 text-xs font-bold text-rose-500 uppercase tracking-wider">
                                {errors.accountId.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2 ml-1 text-neutral-700 dark:text-neutral-300">
                        Category
                    </label>
                    <select
                        {...register("categoryId", { required: "Category is required" })}
                        className={cn(
                            "w-full px-5 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border-2 transition-all outline-none appearance-none",
                            errors.categoryId
                                ? "border-rose-500/50 focus:border-rose-500"
                                : "border-neutral-100 dark:border-neutral-700 focus:border-indigo-500"
                        )}
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.$id} value={cat.$id}>{cat.name} ({cat.type})</option>
                        ))}
                    </select>
                    {errors.categoryId && (
                        <p className="mt-2 ml-1 text-xs font-bold text-rose-500 uppercase tracking-wider">
                            {errors.categoryId.message}
                        </p>
                    )}
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
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default EditTransactionModal
