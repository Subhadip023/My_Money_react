import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { setLoading } from '../../redux/uiSlice'
import toast from 'react-hot-toast'
import Modal from './Modal'
import { transactionService, accountService, categoryService } from '../../services'
import Button from '../shared/Button'
import { Input, Select } from '../shared/FormField'
import TransactionTypeToggle from '../shared/TransactionTypeToggle'

const TransactionModal = ({ isOpen, onClose, transaction, onTransactionSaved }) => {
    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        defaultValues: { type: 'expense' }
    })

    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const loading = useSelector((state) => state.ui.loading)
    const [accounts, setAccounts] = useState([])
    const [categories, setCategories] = useState([])
    const isEdit = !!transaction

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
                    console.error("Failed to fetch dependencies:", error)
                    toast.error("Failed to load accounts or categories")
                }
            }
            fetchData()
        }
    }, [isOpen, user])

    useEffect(() => {
        if (isOpen) {
            if (transaction) {
                const accId = typeof transaction.accounts === 'object' ? transaction.accounts?.$id : transaction.accounts
                const catId = typeof transaction.categories === 'object' ? transaction.categories?.$id : transaction.categories

                reset({
                    label: transaction.label,
                    amount: transaction.amount,
                    type: transaction.type,
                    accountId: accId,
                    categoryId: catId
                })
            } else {
                reset({
                    label: '',
                    amount: '',
                    type: 'expense',
                    accountId: '',
                    categoryId: ''
                })
            }
        }
    }, [transaction, reset, isOpen])

    const onSubmit = async (data) => {
        if (loading) return
        dispatch(setLoading(true))
        try {
            let res
            if (isEdit) {
                res = await transactionService.updateTransaction(transaction.$id, {
                    ...data,
                    amount: parseFloat(data.amount),
                    userId: user.$id
                })
                toast.success("Transaction updated")
            } else {
                res = await transactionService.createTransaction({
                    ...data,
                    amount: parseFloat(data.amount),
                    userId: user.$id
                })
                toast.success("Transaction recorded")
            }

            if (res) {
                onTransactionSaved(res)
                onClose()
            }
        } catch (error) {
            toast.error(error.message || `Failed to ${isEdit ? 'update' : 'record'} transaction.`)
        } finally {
            dispatch(setLoading(false))
        }
    }

    const type = watch('type')
    const accountOptions = accounts.map(acc => ({ label: acc.accountName, value: acc.$id }))
    const categoryOptions = categories.map(cat => ({
        label: `${cat.name} (${cat.type})`,
        value: cat.$id
    }))

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Transaction" : "Add New Transaction"}>
            {(!isEdit && (!accounts.length || !categories.length)) ? (
                <div className="py-10 flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-4xl shadow-inner">⚠️</div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-neutral-900 dark:text-white">Setup Required</h3>
                        <p className="text-neutral-500 dark:text-neutral-400 font-medium max-w-[280px]">
                            You need an **Account** and a **Category** to start tracking.
                        </p>
                    </div>
                    <div className="flex flex-col w-full gap-3">
                        {!accounts.length && (
                            <Button as={Link} to="/accounts" onClick={onClose} variant="primary">Add Account First</Button>
                        )}
                        {!categories.length && (
                            <Button as={Link} to="/categories" onClick={onClose} variant="violet">Add Category First</Button>
                        )}
                        <Button onClick={onClose} variant="secondary">Cancel</Button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 transition-all">
                    <TransactionTypeToggle
                        value={type}
                        onChange={(val) => setValue('type', val)}
                    />

                    <Input
                        label="Description"
                        placeholder="e.g., Grocery shopping"
                        name="label"
                        register={register}
                        rules={{ required: "Description is required" }}
                        error={errors.label?.message}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Amount"
                            prefix="₹"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            name="amount"
                            register={register}
                            rules={{ required: "Required", min: { value: 0.01, message: "Must be > 0" } }}
                            error={errors.amount?.message}
                        />
                        <Select
                            label="Account"
                            placeholder="Select Account"
                            name="accountId"
                            options={accountOptions}
                            register={register}
                            rules={{ required: "Required" }}
                            error={errors.accountId?.message}
                        />
                    </div>

                    <Select
                        label="Category"
                        placeholder="Select Category"
                        name="categoryId"
                        options={categoryOptions}
                        register={register}
                        rules={{ required: "Required" }}
                        error={errors.categoryId?.message}
                    />

                    <div className="pt-4 flex gap-4">
                        <Button onClick={onClose} variant="secondary" className="flex-1">Cancel</Button>
                        <Button type="submit" loading={loading} className="flex-1">
                            {isEdit ? "Save Changes" : "Record"}
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    )
}

export default TransactionModal
