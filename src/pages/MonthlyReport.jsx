import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setLoading } from '../redux/uiSlice'
import transactionService from '../appwrite/transaction'
import PieChart from '../components/PieChart'
import FloatingCard from '../components/ui/FlotingCard'
import { exportTransactionsToExcel } from '../utils/excelExport'
import toast from 'react-hot-toast'
import TransactionIcon from '../components/ui/TransactionIcon'

/**
 * Monthly Report Page
 * Provides a high-level summary of income, expenses, and category-wise breakdown.
 */
export default function MonthlyReport() {
    const navigate = useNavigate()
    const [transactions, setTransactions] = useState([])
    const [stats, setStats] = useState({
        income: 0,
        expense: 0,
        balance: 0
    })
    const [categoryData, setCategoryData] = useState([])
    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch()

    const fetchReportData = async () => {
        if (!user) return
        dispatch(setLoading(true))
        try {
            const res = await transactionService.getMonthlyTransactions({ userId: user.$id })
            const docs = res.documents
            setTransactions(docs)

            const inc = docs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0)
            const exp = docs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)
            setStats({ income: inc, expense: exp, balance: inc - exp })

            // Category breakdown for expenses
            const catMap = {}
            docs.filter(t => t.type === 'expense').forEach(t => {
                const name = t.categories?.name || 'Uncategorized'
                catMap[name] = (catMap[name] || 0) + t.amount
            })
            setCategoryData(Object.entries(catMap)
                .map(([name, value]) => ({ name, y: value }))
                .sort((a, b) => b.y - a.y)
            )

        } catch (error) {
            console.error("Failed to fetch report data:", error)
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleExport = () => {
        if (transactions.length === 0) {
            toast.error("No data to export for this month!");
            return;
        }
        const ok = exportTransactionsToExcel(transactions, `MyMoney_${monthName}_${now.getFullYear()}.xlsx`);
        if (ok) toast.success("Report Downloaded!");
    }

    useEffect(() => {
        fetchReportData()
    }, [user])

    const now = new Date()
    const monthName = now.toLocaleString('default', { month: 'long' })

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-3 border border-indigo-200 dark:border-indigo-800">
                        Financial Report
                    </div>
                    <h1 className="text-4xl font-black tracking-tight">{monthName} {now.getFullYear()}</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">Deep-dive into your financial performance this month.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={handleExport}
                        className="h-10 px-5 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shadow-xl shadow-neutral-900/10 dark:shadow-white/10"
                    >
                        <span className="text-sm">📄</span>
                        Export Excel
                    </button>

                    <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-2xl border border-neutral-200 dark:border-neutral-700 h-10">
                        <button className="px-4 py-1.5 rounded-xl bg-white dark:bg-neutral-700 shadow-sm text-[10px] font-black uppercase tracking-widest">Monthly</button>
                        <button className="px-4 py-1.5 rounded-xl text-neutral-400 text-[10px] font-black uppercase tracking-widest opacity-50 cursor-not-allowed">Yearly</button>
                    </div>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FloatingCard className="p-8 rounded-3xl bg-neutral-900 dark:bg-neutral-900 border-neutral-800 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full group-hover:scale-110 transition-transform" />
                    <span className="text-2xl mb-4 block">📈</span>
                    <div className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mb-1">Total Income</div>
                    <div className="text-3xl font-black text-white italic">₹{stats.income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                </FloatingCard>

                <FloatingCard className="p-8 rounded-3xl bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-bl-full group-hover:scale-110 transition-transform" />
                    <span className="text-2xl mb-4 block">📉</span>
                    <div className="text-neutral-400 font-bold uppercase tracking-widest text-[10px] mb-1">Total Expenses</div>
                    <div className="text-3xl font-black text-neutral-900 dark:text-white italic text-rose-500">₹{stats.expense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                </FloatingCard>

                <FloatingCard className="p-8 rounded-3xl bg-indigo-600 shadow-lg shadow-indigo-600/20 relative overflow-hidden group">
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-tl-full group-hover:scale-110 transition-transform" />
                    <span className="text-2xl mb-4 block underline-offset-4 underline decoration-white/30 text-white">💰</span>
                    <div className="text-white/70 font-bold uppercase tracking-widest text-[10px] mb-1">Net Savings</div>
                    <div className="text-3xl font-black text-white italic">
                        {stats.balance < 0 ? '-' : ''}₹{Math.abs(stats.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                </FloatingCard>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Spending by Category Chart */}
                <FloatingCard className="p-8 rounded-[2rem] bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black tracking-tighter">Expense Distribution</h3>
                        <div className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-700 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                            By Category
                        </div>
                    </div>
                    {categoryData.length > 0 ? (
                        <div className="min-h-[350px] flex items-center justify-center">
                            <PieChart data={categoryData} title={`${monthName} Expenses`} showTotal={true} />
                        </div>
                    ) : (
                        <div className="h-[350px] flex flex-col items-center justify-center text-neutral-400 border-2 border-dashed border-neutral-100 dark:border-neutral-700/50 rounded-3xl">
                            <span className="text-4xl mb-4 opacity-50">📊</span>
                            <p className="font-bold tracking-tight">No expense data found</p>
                            <p className="text-xs opacity-70">Add some transactions to see your breakdown.</p>
                        </div>
                    )}
                </FloatingCard>

                {/* Significant Movements / Top Expenses */}
                <FloatingCard className="p-8 rounded-[2rem] bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black tracking-tighter">Top Transactions</h3>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest italic">Sorted by Recency</span>
                    </div>
                    <div className="space-y-4">
                        {transactions.slice(0, 6).map((tx, i) => (
                            <div key={tx.$id} className="group flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 hover:border-indigo-500/50 hover:bg-white dark:hover:bg-neutral-700/50 transition-all">
                                <div className="flex items-center gap-4">
                                    <TransactionIcon type={tx.type} className="w-12 h-12 shadow-sm transition-transform group-hover:scale-110" />
                                    <div>
                                        <p className="font-bold text-sm dark:text-white capitalize">{tx.label}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{tx.categories?.name || 'General'}</span>
                                            <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                                            <span className="text-[10px] text-neutral-400 font-medium italic">{new Date(tx.$createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`font-black italic text-lg ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                                </span>
                            </div>
                        ))}
                        {transactions.length === 0 && (
                            <div className="text-center py-20 text-neutral-400 italic">
                                Nothing to see here yet...
                            </div>
                        )}
                        {transactions.length > 6 && (
                            <div className="pt-4 text-center">
                                <button
                                    onClick={() => navigate('/transactions')}
                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-indigo-500 transition-colors cursor-pointer"
                                >
                                    Display All Transactions
                                </button>
                            </div>
                        )}
                    </div>
                </FloatingCard>
            </div>
        </div>
    )
}
