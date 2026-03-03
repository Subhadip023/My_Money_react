import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/uiSlice'
import accountService from '../appwrite/account'
import AddTransactionModal from '../components/ui/AddTransactionModal'
import transactionService from '../appwrite/transaction'
import FloatingCard from '../components/ui/FlotingCard'
export default function Dashboard() {
    const [totalBalance, setTotalBalance] = useState(0)
    const [monthlyExpences, setMonthlyExpences] = useState(0)
    const [monthlyIncome, setMonthlyIncome] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)

    const calculateTotalBalance = async () => {
        if (!user) return
        try {
            const res = await accountService.getAccountBalance({ userId: user.$id })
            setTotalBalance(res)
        } catch (error) {
            console.error("Failed to calculate balance:", error)
        }
    }
    const calculateMonthlyExpences = async () => {
        if (!user) return
        try {
            const res = await transactionService.monthyExpences({ userId: user.$id })
            setMonthlyExpences(res)
        } catch (error) {
            console.error("Failed to calculate balance:", error)
        }
    }
    const calculateMonthlyIncome = async () => {
        if (!user) return
        try {
            const res = await transactionService.monthyIncome({ userId: user.$id })
            setMonthlyIncome(res)
        } catch (error) {
            console.error("Failed to calculate balance:", error)
        }
    }

    useEffect(() => {
        calculateTotalBalance()
        calculateMonthlyExpences()
        calculateMonthlyIncome()
    }, [user])

    const handleTransactionAdded = () => {
        calculateTotalBalance()
        calculateMonthlyExpences()
        calculateMonthlyIncome()
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Financial Overview</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                >
                    Add Transaction
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Balance', value: `₹${totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: '💰', color: 'bg-emerald-500' },
                    { label: 'Monthly Income', value: `₹${monthlyIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: '📈', color: 'bg-indigo-500' },
                    { label: 'Monthly Expenses', value: `₹${monthlyExpences.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: '📉', color: 'bg-rose-500' },
                ].map((stat, i) => (
                    <FloatingCard key={i} className="p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm overflow-hidden relative group">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-[0.03] rounded-bl-full transition-transform group-hover:scale-110`} />
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-sm font-bold uppercase tracking-widest text-neutral-400">{stat.label}</span>
                        </div>
                        <div className="text-3xl font-black">{stat.value}</div>
                    </FloatingCard>
                ))}
            </div>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTransactionAdded={handleTransactionAdded}
            />
        </div>
    )
}