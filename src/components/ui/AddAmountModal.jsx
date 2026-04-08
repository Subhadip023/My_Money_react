import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../../redux/uiSlice'
import toast from 'react-hot-toast'
import Modal from './Modal'
import { cn } from '../../utils'
import transactionService from '../../appwrite/transaction'
import Button from '../shared/Button'

const AddAmountModal = ({ isOpen, onClose, account, onAmountAdded }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const loading = useSelector((state) => state.ui.loading)

    useEffect(() => {
        if (!isOpen) {
            reset()
        }
    }, [isOpen, reset])

    const onSubmit = async (data) => {
        if (!account) return;
        dispatch(setLoading(true))
        try {
            await transactionService.createTransaction({
                label: data.label || 'Deposit',
                amount: parseFloat(data.amount),
                type: 'income',
                userId: user.$id,
                accountId: account.$id,
                categoryId: null
            })
            onAmountAdded()
            toast.success('Amount added to account successfully')
            reset()
            onClose()
        } catch (error) {
            toast.error(error.message || 'Failed to add amount.')
        } finally {
            dispatch(setLoading(false))
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Add Funds to ${account?.accountName || 'Account'}`}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold mb-2 ml-1 text-neutral-700 dark:text-neutral-300">
                        Label (Optional)
                    </label>
                    <input
                        {...register("label")}
                        className={cn(
                            "w-full px-5 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border-2 transition-all outline-none text-neutral-700 dark:text-neutral-300",
                            "border-neutral-100 dark:border-neutral-700 focus:border-indigo-500"
                        )}
                        placeholder="e.g., Deposit"
                    />
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
                            {...register("amount", { required: "Amount is required", min: { value: 0.01, message: "Valid amount is required" } })}
                            className={cn(
                                "w-full px-10 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border-2 transition-all outline-none text-neutral-700 dark:text-neutral-300",
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
                        Add Amount
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default AddAmountModal
