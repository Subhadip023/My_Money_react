import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../../redux/uiSlice'
import toast from 'react-hot-toast'
import Modal from './Modal'
import { cn } from '../../utils'
import accountService from '../../appwrite/account'
import Button from '../shared/Button'

const AccountModal = ({ isOpen, onClose, account, onAccountSaved }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const loading = useSelector((state) => state.ui.loading)
    const isEdit = !!account

    useEffect(() => {
        if (isOpen) {
            if (account) {
                reset({
                    name: account.accountName,
                    type: account.accountType,
                    balance: account.balance
                })
            } else {
                reset({
                    name: '',
                    type: 'asset',
                    balance: ''
                })
            }
        }
    }, [account, reset, isOpen])

    const onSubmit = async (data) => {
        if (loading) return
        dispatch(setLoading(true))
        try {
            let res
            if (isEdit) {
                res = await accountService.updateAccount(account.$id, {
                    accountName: data.name,
                    accountType: data.type,
                    balance: parseFloat(data.balance)
                })
                toast.success("Account updated successfully")
            } else {
                res = await accountService.createAccount({
                    accountName: data.name,
                    balance: parseFloat(data.balance),
                    accountType: data.type,
                    userId: user.$id
                })
                toast.success("Account added successfully")
            }
            
            if (res) {
                onAccountSaved(res)
                onClose()
            }
        } catch (error) {
            toast.error(error.message || `Failed to ${isEdit ? 'update' : 'add'} account.`)
        } finally {
            dispatch(setLoading(false))
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Account" : "Add New Account"}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold mb-2 ml-1 text-neutral-700 dark:text-neutral-300">
                        Account Name
                    </label>
                    <input
                        {...register("name", { required: "Name is required" })}
                        className={cn(
                            "w-full px-5 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border-2 transition-all outline-none dark:text-white",
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
                            "w-full px-5 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border-2 transition-all outline-none dark:text-white",
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
                        {isEdit ? 'Current Balance' : 'Initial Balance'}
                    </label>
                    <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">₹</span>
                        <input
                            type="number"
                            step="0.01"
                            {...register("balance", { required: "Balance is required" })}
                            className={cn(
                                "w-full px-10 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border-2 transition-all outline-none dark:text-white",
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
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="flex-1 font-bold"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        loading={loading}
                        className="flex-1 text-lg"
                    >
                        {isEdit ? 'Save Changes' : 'Create Account'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default AccountModal
