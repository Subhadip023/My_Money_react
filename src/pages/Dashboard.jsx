import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/uiSlice'
import accountService from '../appwrite/account'
import TransactionModal from '../components/ui/TransactionModal'
import TransactionTable from '../components/ui/TransactionTable'
import transactionService from '../appwrite/transaction'
import investmentService from '../appwrite/investment'
import PieChart from '../components/PieChart'
import FloatingCard from '../components/ui/FlotingCard'
import { Link } from 'react-router-dom'
import Button from '../components/shared/Button'
import loanService from '../appwrite/loans'
import InvestmentModal from '../components/ui/InvestmentModal'
import LoanModal from '../components/ui/LoanModal'
export default function Dashboard() {
    const [totalBalance, setTotalBalance] = useState(0)
    const [monthlyExpences, setMonthlyExpences] = useState(0)
    const [monthlyIncome, setMonthlyIncome] = useState(0)
    const [recentTransactions, setRecentTransactions] = useState([])
    const [accounts, setAccounts] = useState([])
    const [investmentStats, setInvestmentStats] = useState({ totalInvested: 0, currentValue: 0 })
    const [investments, setInvestments] = useState([])
    const [loans, setLoans] = useState([])
    const [todaySpent, setTodaySpent] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false)
    const [isLoanModalOpen, setIsLoanModalOpen] = useState(false)
    const user = useSelector((state) => state.auth.user)
    const isPremiumUser = user.labels.includes('premium')

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
            console.error("Failed to calculate monthly expenses:", error)
        }
    }
    const calculateTodaySpent = async () => {
        if (!user) return
        try {
            const res = await transactionService.dailyExpenses({ userId: user.$id })
            setTodaySpent(res)
        } catch (error) {
            console.error("Failed to calculate today spent:", error)
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
            const totalInvested = res.documents.reduce((sum, inv) => sum + Number(inv.investedAmount || 0), 0);
            const currentValue = res.documents.reduce((sum, inv) => sum + Number(inv.currentValue || 0), 0);
            setInvestmentStats({ totalInvested, currentValue });
            setInvestments(res.documents.slice(0, 5));
        } catch (error) {
            console.error("Failed to fetch investment stats:", error);
        }
    };
    const fetchLoans = async () => {
        if (!user) return;
        try {
            const res = await loanService.getUserLoans(user.$id);
            if (res && res.documents) {
                setLoans(res.documents.slice(0, 5));
            }
        } catch (error) {
            console.error("Failed to fetch loans:", error);
        }
    };

    useEffect(() => {
        calculateTotalBalance()
        calculateMonthlyExpences()
        calculateMonthlyIncome()
        fetchRecentTransactions()
        fetchAccounts()
        fetchInvestmentStats()
        fetchLoans()
        calculateTodaySpent()
    }, [user])

    const handleTransactionAdded = () => {
        calculateTotalBalance()
        calculateMonthlyExpences()
        calculateMonthlyIncome()
        fetchRecentTransactions()
        fetchAccounts()
        fetchInvestmentStats()
        fetchLoans()
        calculateTodaySpent()
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
                <div className="flex flex-wrap gap-3">
                    {isPremiumUser && <Button
                        variant="secondary"
                        onClick={() => setIsInvestmentModalOpen(true)}
                        icon={() => (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-emerald-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        )}
                    >
                        Investment
                    </Button>}
                    {isPremiumUser && <Button
                        variant="secondary"
                        onClick={() => setIsLoanModalOpen(true)}
                        icon={() => (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-rose-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        )}
                    >
                        Loan
                    </Button>}
                    <Button
                        id="tour-add-transaction"
                        onClick={() => setIsModalOpen(true)}
                        icon={() => (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        )}
                    >
                        Transaction
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { id: 'tour-balance-card', label: 'Total Balance', value: `₹${totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: '💰', color: 'bg-emerald-500' },
                    { label: 'Monthly Income', value: `₹${monthlyIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: '📈', color: 'bg-indigo-500' },
                    { label: "Today's Spending", value: `₹${todaySpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: '📉', color: 'bg-rose-500' }, {
                        label: 'Portfolio Value',
                        value: `₹${(investmentStats.currentValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
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
                <FloatingCard className="p-6 md:p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm relative group overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black">Recent Transactions</h3>
                        <Link to="/transactions" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">View All →</Link>
                    </div>
                    <TransactionTable
                        transactions={recentTransactions}
                        showActions={false}
                        showAccount={true}
                        showCategory={false}
                    />
                </FloatingCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FloatingCard className="p-6 md:p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm relative group overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black">Top Investments</h3>
                        <Link to="/investments" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">View All →</Link>
                    </div>
                    <div className="space-y-4">
                        {investments.map(inv => (
                            <div key={inv.$id} className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800">
                                <div>
                                    <p className="font-bold text-neutral-900 dark:text-white truncate max-w-[150px]">{inv.investmentName}</p>
                                    <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">{inv.investmentType}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-neutral-900 dark:text-white">₹{inv.currentValue.toLocaleString('en-IN')}</p>
                                    <p className={`text-[10px] font-bold ${inv.currentValue >= inv.investedAmount ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {inv.currentValue >= inv.investedAmount ? '↑' : '↓'} {(((inv.currentValue - inv.investedAmount) / (inv.investedAmount || 1)) * 100).toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        ))}
                        {investments.length === 0 && <p className="text-center py-6 text-neutral-400 font-medium italic">No active investments found.</p>}
                    </div>
                </FloatingCard>

                <FloatingCard className="p-6 md:p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm relative group overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black">Open Loans</h3>
                        <Link to="/loans" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">View All →</Link>
                    </div>
                    <div className="space-y-4">
                        {loans.map(loan => (
                            <div key={loan.$id} className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800">
                                <div>
                                    <p className="font-bold text-neutral-900 dark:text-white truncate max-w-[150px]">{loan.loanName}</p>
                                    <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">{loan.loanType}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-neutral-900 dark:text-white">₹{(loan.outstandingAmount || 0).toLocaleString('en-IN')}</p>
                                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-tighter">O/S Debt</p>
                                </div>
                            </div>
                        ))}
                        {loans.length === 0 && <p className="text-center py-6 text-neutral-400 font-medium italic">No active loans found.</p>}
                    </div>
                </FloatingCard>
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTransactionSaved={handleTransactionAdded}
            />

            <InvestmentModal
                isOpen={isInvestmentModalOpen}
                onClose={() => setIsInvestmentModalOpen(false)}
                onInvestmentSaved={handleTransactionAdded}
            />

            <LoanModal
                isOpen={isLoanModalOpen}
                onClose={() => setIsLoanModalOpen(false)}
                onLoanSaved={handleTransactionAdded}
            />


        </div>
    )
}