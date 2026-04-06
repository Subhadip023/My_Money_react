import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/uiSlice'
import accountService from '../appwrite/account'
import TransactionModal from '../components/ui/TransactionModal'
import transactionService from '../appwrite/transaction'
import investmentService from '../appwrite/investment'
import PieChart from '../components/PieChart'
import FloatingCard from '../components/ui/FlotingCard'
import { Link } from 'react-router-dom'
export default function Dashboard() {
    const [totalBalance, setTotalBalance] = useState(0)
    const [monthlyExpences, setMonthlyExpences] = useState(0)
    const [monthlyIncome, setMonthlyIncome] = useState(0)
    const [recentTransactions, setRecentTransactions] = useState([])
    const [accounts, setAccounts] = useState([])
    const [investmentStats, setInvestmentStats] = useState({ totalInvested: 0, currentValue: 0 })
    const [isModalOpen, setIsModalOpen] = useState(false)
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
    const fetchRecentTransactions = async () => {
        if (!user) return;
        try {
            const res = await transactionService.getTransactions({ userId: user.$id });
            if (res && res.documents) {
                setRecentTransactions(res.documents.slice(0, 5));
            }
        } catch (error) {
            console.error("Failed to fetch recent transactions:", error);
        }
    };
    const fetchAccounts = async () => {
        if (!user) return;
        try {
            const res = await accountService.getAccounts({ userId: user.$id });
            if (res && res.documents) {
                setAccounts(res.documents);
            }
        } catch (error) {
            console.error("Failed to fetch accounts:", error);
        }
    };
    const fetchInvestmentStats = async () => {
        if (!user) return;
        try {
            const res = await investmentService.getInvestments({ userId: user.$id });
            const totalInvested = res.documents.reduce((sum, inv) => sum + Number(inv.investedAmount), 0);
            const currentValue = res.documents.reduce((sum, inv) => sum + Number(inv.currentValue), 0);
            setInvestmentStats({ totalInvested, currentValue });
        } catch (error) {
            console.error("Failed to fetch investment stats:", error);
        }
    };

    useEffect(() => {
        calculateTotalBalance()
        calculateMonthlyExpences()
        calculateMonthlyIncome()
        fetchRecentTransactions()
        fetchAccounts()
        fetchInvestmentStats()
    }, [user])

    const handleTransactionAdded = () => {
        calculateTotalBalance()
        calculateMonthlyExpences()
        calculateMonthlyIncome()
        fetchRecentTransactions()
        fetchAccounts()
        fetchInvestmentStats()
    }

    const pieChartData = accounts
        .filter(acc => acc.balance > 0)
        .map(acc => ({ name: acc.accountName, y: acc.balance }));

    return (
        <div className="space-y-8">
            <div id="tour-dashboard-header" className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Financial Overview</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="flex gap-4">
                  
                    <button
                        id="tour-add-transaction"
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                    >
                        Add Transaction
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { id: 'tour-balance-card', label: 'Total Balance', value: `₹${totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: '💰', color: 'bg-emerald-500' },
                    { label: 'Monthly Income', value: `₹${monthlyIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: '📈', color: 'bg-indigo-500' },
                    { label: 'Monthly Expenses', value: `₹${monthlyExpences.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: '📉', color: 'bg-rose-500' },{ 
                        label: 'Portfolio Value', 
                        value: `₹${investmentStats.currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 
                        icon: '🏦', 
                        color: 'bg-emerald-500', 
                        returns: investmentStats.currentValue - investmentStats.totalInvested 
                    },
                ].filter(Boolean).map((stat, i) => (
                    <FloatingCard id={stat.id} key={i} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm overflow-hidden relative group">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-[0.03] rounded-bl-full transition-transform group-hover:scale-110`} />
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-sm font-bold uppercase tracking-widest text-neutral-400">{stat.label}</span>
                        </div>
                        <div className="text-3xl font-black">{stat.value}</div>
                        {stat.label === 'Portfolio Value' && (
                            <div className={`text-sm font-bold mt-2 ${stat.returns >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {stat.returns >= 0 ? '↑' : '↓'} ₹{Math.abs(stat.returns).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                <span className="ml-1 opacity-70">Returns</span>
                            </div>
                        )}
                    </FloatingCard>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                    <FloatingCard className="p-6 md:p-8 hidden md:block rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm overflow-hidden relative group">
                        {/* Chat that show the money in account */}
                        <PieChart data={pieChartData} title="Account Balances" showTotal={true} />
                    </FloatingCard>
                    <FloatingCard className="p-6 md:p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm  relative group">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black">Recent Transactions</h3>
                        </div>
                        <div className="space-y-4">
                            {recentTransactions.map((tx) => (
                                <div key={tx.$id} className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'}`}>
                                            {tx.type === 'income' ? '↓' : '↑'}
                                        </div>
                                        <div>
                                            <p className="font-bold truncate max-w-[150px] sm:max-w-[200px]">{tx.label}</p>
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400">{new Date(tx.$createdAt).toLocaleDateString('en-GB')}</p>
                                        </div>
                                    </div>
                                    <div className={`font-black ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                            ))}
                            {recentTransactions.length === 0 && (
                                <div className="text-center text-neutral-500 dark:text-neutral-400 py-8 font-medium">
                                    No recent transactions
                                </div>
                            )}
                        </div>
                    </FloatingCard>
                
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTransactionSaved={handleTransactionAdded}
            />

           
        </div>
    )
}