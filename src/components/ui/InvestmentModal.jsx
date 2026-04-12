import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../../redux/uiSlice'
import toast from 'react-hot-toast'
import Modal from './Modal'
import { investmentService, accountService, transactionService, categoryService } from '../../services'
import Button from '../shared/Button'
import { Input, Select } from '../shared/FormField'

const InvestmentModal = ({ isOpen, onClose, investment, onInvestmentSaved }) => {
    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        defaultValues: { investmentType: 'mf' }
    })
    const [accounts, setAccounts] = useState([])
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const loading = useSelector((state) => state.ui.loading)
    const type = watch('investmentType')
    const isEdit = !!investment;
    
    const fetchAccounts = async () => {
        try {
            const res = await accountService.getAccounts({ userId: user.$id })
            setAccounts(res.documents)
        } catch (error) {
            console.error("Failed to fetch accounts:", error)
        }
    }

    const accountOptions = accounts.map(acc => ({ label: acc.accountName, value: acc.$id }))

    useEffect(() => {
        if (isOpen) {
            if (investment) {
                reset({
                    investmentType: investment.investmentType,
                    investmentName: investment.investmentName,
                    investedAmount: investment.investedAmount,
                    currentValue: investment.currentValue,
                    quantity: investment.quantity,
                    symbol: investment.symbol,
                    avgBuyPrice: investment.avgBuyPrice
                })
            } else {
                reset({
                    investmentType: 'mf',
                    investmentName: '',
                    investedAmount: '',
                    currentValue: '',
                    quantity: '',
                    symbol: '',
                    avgBuyPrice: ''
                })
            }
            fetchAccounts()
        }
    }, [investment, reset, isOpen])

    const onSubmit = async (data) => {
        if (loading) return
        dispatch(setLoading(true))
        try {
            const avgPrice = data.avgBuyPrice || (Number(data.investedAmount) / Number(data.quantity || 1))
            
            const payload = {
                userId: user.$id,
                ...data,
                investedAmount: Number(data.investedAmount),
                currentValue: Number(data.currentValue),
                quantity: Number(data.quantity || 0),
                avgBuyPrice: Number(avgPrice)
            }

            let invRes;
            if (isEdit) {
                invRes = await investmentService.updateInvestment(investment.$id, payload)
                toast.success("Investment updated")
            } else {
                // 1. Create Investment (temporary transactionId null)
                invRes = await investmentService.createInvestment({ ...payload, transactionId: null })
                
                // 2. If an account is selected, create a linked transaction
                if (data.fromAccount) {
                    try {
                        const txRes = await transactionService.createTransaction({
                            label: `Deposit: ${data.investmentName}`,
                            amount: Number(data.investedAmount),
                            type: 'expense',
                            userId: user.$id,
                            accountId: data.fromAccount,
                            categoryId: null, 
                            investments: invRes.$id 
                        })

                        await investmentService.updateInvestment(invRes.$id, { transactionId: txRes.$id })
                        invRes.transactionId = txRes.$id;
                    } catch (txError) {
                        console.error("Link transaction failed:", txError)
                        toast.error("Investment added, but failed to record the transaction.")
                    }
                }
                toast.success("Investment added successfully")
            }
            
            onInvestmentSaved(invRes)
            onClose()
        } catch (error) {
            toast.error(error.message || `Failed to ${isEdit ? 'update' : 'add'} investment.`)
        } finally {
            dispatch(setLoading(false))
        }
    }

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={isEdit ? "Update Investment" : "New Portfolio Asset"}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 transition-all duration-500">
                {/* Type Selection Tabs */}
                <div className="flex bg-neutral-100 dark:bg-neutral-900 p-1 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                    {[
                        { id: 'mf', label: 'Mutual Fund', icon: '📈' },
                        { id: 'stock', label: 'Stock', icon: '🏛️' },
                        { id: 'fd', label: 'Fixed Deposit', icon: '🔒' }
                    ].map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setValue('investmentType', t.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                type === t.id 
                                ? 'bg-white dark:bg-neutral-800 text-indigo-600 shadow-sm border border-neutral-100 dark:border-neutral-700' 
                                : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                            }`}
                        >
                            <span className="text-sm">{t.icon}</span>
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    <Input
                        label="Asset Name"
                        placeholder={type === 'fd' ? "e.g. HDFC Fixed Deposit" : "e.g. Parag Parikh Flexi Cap"}
                        name="investmentName"
                        register={register}
                        rules={{ required: "Name is required" }}
                        error={errors.investmentName?.message}
                    />

                    {type === 'stock' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <Input
                                label="Equity Symbol"
                                placeholder="e.g. TCS.NS"
                                name="symbol"
                                register={register}
                            />
                            <Input
                                label="Quantity"
                                type="number"
                                placeholder="0"
                                name="quantity"
                                register={register}
                            />
                        </div>
                    )}

                    {!isEdit && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <Select
                                label="Execution Account"
                                placeholder="Select funding source (Optional)"
                                name="fromAccount"
                                register={register}
                                options={accountOptions}
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Initial Investment"
                            prefix="₹"
                            type="number"
                            placeholder="0.00"
                            name="investedAmount"
                            register={register}
                            rules={{ required: "Required" }}
                            error={errors.investedAmount?.message}
                        />
                        <Input
                            label="Current Portfolio Value"
                            prefix="₹"
                            type="number"
                            placeholder="0.00"
                            name="currentValue"
                            register={register}
                            rules={{ required: "Required" }}
                            error={errors.currentValue?.message}
                        />
                    </div>

                    {type === 'stock' && (
                        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700">
                            <Input
                                label="Average Buy Price"
                                prefix="₹"
                                type="number"
                                placeholder="Calculated automatically if empty"
                                name="avgBuyPrice"
                                register={register}
                                className="bg-white dark:bg-neutral-900"
                            />
                        </div>
                    )}
                </div>

                <div className="pt-6 flex gap-4">
                    <Button onClick={onClose} variant="secondary" className="flex-1 h-12 rounded-2xl font-bold">Cancel</Button>
                    <Button type="submit" loading={loading} className="flex-1 h-12 rounded-2xl font-bold shadow-lg shadow-indigo-600/20">
                        {isEdit ? "Update Asset" : "Add to Portfolio"}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default InvestmentModal;
