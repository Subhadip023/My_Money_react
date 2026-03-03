import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../../redux/uiSlice'
import toast from 'react-hot-toast'
import Modal from './Modal'
import { transactionService, accountService, categoryService } from '../../services'
import Button from '../shared/Button'
import { Input, Select } from '../shared/FormField'
import TransactionTypeToggle from '../shared/TransactionTypeToggle'

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
                    console.error("Failed to fetch deps:", error)
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
                ...data,
                amount: parseFloat(data.amount),
                userId: user.$id
            })

            onTransactionUpdated(res)
            onClose()
            toast.success("Transaction updated")
        } catch (error) {
            toast.error(error.message || 'Failed to update transaction.')
        } finally {
            dispatch(setLoading(false))
        }
    }

    const type = watch('type')
    const accountOptions = accounts.map(acc => ({ label: acc.accountName, value: acc.$id }))
    const categoryOptions = categories.map(cat => ({ label: `${cat.name} (${cat.type})`, value: cat.$id }))

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Transaction">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <TransactionTypeToggle
                    value={type}
                    onChange={(val) => setValue('type', val)}
                />

                <Input
                    label="Description"
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
                        name="amount"
                        register={register}
                        rules={{ required: "Required", min: { value: 0.01, message: "Must be > 0" } }}
                        error={errors.amount?.message}
                    />
                    <Select
                        label="Account"
                        name="accountId"
                        options={accountOptions}
                        register={register}
                        rules={{ required: "Required" }}
                        error={errors.accountId?.message}
                    />
                </div>

                <Select
                    label="Category"
                    name="categoryId"
                    options={categoryOptions}
                    register={register}
                    rules={{ required: "Required" }}
                    error={errors.categoryId?.message}
                />

                <div className="pt-4 flex gap-4">
                    <Button onClick={onClose} variant="secondary" className="flex-1">Cancel</Button>
                    <Button type="submit" loading={loading} className="flex-1">Save Changes</Button>
                </div>
            </form>
        </Modal>
    )
}

export default EditTransactionModal;
