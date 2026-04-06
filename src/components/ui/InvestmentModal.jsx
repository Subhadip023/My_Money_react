import React, { useEffect,useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../../redux/uiSlice'
import toast from 'react-hot-toast'
import Modal from './Modal'
import { investmentService, accountService, transactionService, categoryService } from '../../services'
import Button from '../shared/Button'
import { Input, Select } from '../shared/FormField'

const InvestmentModal = ({ isOpen, onClose, investment, onInvestmentSaved }) => {
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
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
            toast.error("Failed to load accounts")
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

            let res;
            if (isEdit) {
                res = await investmentService.updateInvestment(investment.$id, payload)
                toast.success("Investment updated successfully")
            } else {
                let txId = null;
                
                // If an account is selected, deduct balance and create a transaction
                if (data.fromAccount) {
                    try {
                        const catRes = await categoryService.getCategories({ userId: user.$id })
                        let invCategory = catRes.documents.find(cat => cat.name.toLowerCase() === 'investment')
                        
                        if (!invCategory) {
                           invCategory = await categoryService.createCategory({
                                name: 'Investment',
                                type: 'expense',
                                userId: user.$id
                            })
                        }

                        const txRes = await transactionService.createTransaction({
                            label: `Investment: ${data.investmentName}`,
                            amount: Number(data.investedAmount),
                            type: 'expense',
                            userId: user.$id,
                            accountId: data.fromAccount,
                            categoryId: invCategory.$id
                        })
                        txId = txRes.$id;
                    } catch (txError) {
                        console.error("InvestmentModal :: transactionError", txError)
                        toast.error("An error occurred creating the transaction record.")
                    }
                }
                
                res = await investmentService.createInvestment({ ...payload, transactionId: txId })
                toast.success("Investment added successfully")
            }
            
            onInvestmentSaved(res)
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
            title={isEdit ? "Edit Investment" : "Add New Investment"}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 transition-all">
                <Select
                    label="Investment Type"
                    name="investmentType"
                    register={register}
                    options={[
                        { label: 'Mutual Fund', value: 'mf' },
                        { label: 'Stock', value: 'stock' },
                        { label: 'Fixed Deposit', value: 'fd' }
                    ]}
                />

                <Input
                    label="Investment Name"
                    placeholder="e.g. Quant Flexi Cap, Axis Bank FD"
                    name="investmentName"
                    register={register}
                    rules={{ required: "Name is required" }}
                    error={errors.investmentName?.message}
                />

                {type === 'stock' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Symbol"
                            placeholder="e.g. RELIANCE"
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
                    <div className='grid grid-cols-1 '>
                        <Select
                            label="Pay From Account"
                            placeholder="Select Account (Optional)"
                            name="fromAccount"
                            register={register}
                            options={accountOptions}
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Invested Amount"
                        prefix="₹"
                        type="number"
                        placeholder="0.00"
                        name="investedAmount"
                        register={register}
                        rules={{ required: "Required" }}
                        error={errors.investedAmount?.message}
                    />
                    <Input
                        label="Current Value"
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
                    <Input
                        label="Avg Buy Price"
                        prefix="₹"
                        type="number"
                        placeholder="Optional"
                        name="avgBuyPrice"
                        register={register}
                    />
                )}

                <div className="pt-4 flex gap-4">
                    <Button onClick={onClose} variant="secondary" className="flex-1">Cancel</Button>
                    <Button type="submit" loading={loading} className="flex-1">
                        {isEdit ? "Save Changes" : "Add Investment"}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default InvestmentModal;
