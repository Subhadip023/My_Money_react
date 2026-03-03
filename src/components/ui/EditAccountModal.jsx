import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { setLoading } from '../../redux/uiSlice'
import toast from 'react-hot-toast'
import Modal from './Modal'
import { cn } from '../../utils'
import accountService from '../../appwrite/account'
import { useSelector } from 'react-redux'

const EditAccountModal = ({ isOpen, onClose, account, onAccountUpdated }) => {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)

    useEffect(() => {
        if (account) {
            setValue("name", account.accountName)
            setValue("type", account.accountType)
            setValue("balance", account.balance)
        }
    }, [account, setValue])

    const onSubmit = async (data) => {
        dispatch(setLoading(true))
        try {
            const res = await accountService.updateAccount(account.$id, {
                accountName: data.name,
                balance: parseFloat(data.balance),
                accountType: data.type,
                userId: user.$id
            })
            onAccountUpdated(res)
            onClose()
        } catch (error) {
            toast.error(error.message || 'Failed to update account.')
        } finally {
            dispatch(setLoading(false))
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Account">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold mb-2 ml-1 text-neutral-700 dark:text-neutral-300">
                        Account Name
                    </label>
                    <input
                        {...register("name", { required: "Name is required" })}
                        className={cn(
                            "w-full px-5 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border-2 transition-all outline-none text-neutral-700 dark:text-neutral-300",
                            errors.name
                                ? "border-rose-500/50 focus:border-rose-500"
                                : "border-neutral-100 dark:border-neutral-700 focus:border-indigo-500"
                        )}
                        placeholder="e.g., My Savings"
                    />
                    {errors.name && (
                        <p className="mt-2 ml-1 text-xs font-bold text-rose-500 uppercase tracking-wider">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2 ml-1 text-neutral-700 dark:text-neutral-300">
                        Account Type
                    </label>
                    <select
                        {...register("type", { required: "Type is required" })}
                        className={cn(
                            "w-full px-5 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border-2 transition-all outline-none text-neutral-700 dark:text-neutral-300",
                            errors.type
                                ? "border-rose-500/50 focus:border-rose-500"
                                : "border-neutral-100 dark:border-neutral-700 focus:border-indigo-500"
                        )}
                    >
                        <option value="asset">Asset</option>
                        <option value="liability">Liability</option>
                    </select>
                    {errors.type && (
                        <p className="mt-2 ml-1 text-xs font-bold text-rose-500 uppercase tracking-wider">
                            {errors.type.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2 ml-1 text-neutral-700 dark:text-neutral-300">
                        Balance
                    </label>
                    <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">₹</span>
                        <input
                            type="number"
                            step="0.01"
                            {...register("balance", { required: "Balance is required" })}
                            className={cn(
                                "w-full px-10 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border-2 transition-all outline-none text-neutral-700 dark:text-neutral-300",
                                errors.balance
                                    ? "border-rose-500/50 focus:border-rose-500"
                                    : "border-neutral-100 dark:border-neutral-700 focus:border-indigo-500"
                            )}
                            placeholder="0.00"
                        />
                    </div>
                    {errors.balance && (
                        <p className="mt-2 ml-1 text-xs font-bold text-rose-500 uppercase tracking-wider">
                            {errors.balance.message}
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
                        className="flex-1 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg transition-all active:scale-[0.98] shadow-xl shadow-indigo-600/20"
                    >
                        Update Account
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default EditAccountModal
