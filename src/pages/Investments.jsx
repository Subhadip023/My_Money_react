import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Button from '../components/shared/Button'
import FloatingCard from '../components/ui/FlotingCard'
import Modal from '../components/ui/Modal'
import investmentService from '../appwrite/investment'
import transactionService from '../appwrite/transaction'
import InvestmentModal from '../components/ui/InvestmentModal'
import toast from 'react-hot-toast'
import { setLoading } from '../redux/uiSlice'

export default function Investments() {
    const [investments, setInvestments] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedInvestment, setSelectedInvestment] = useState(null)
    const user = useSelector((state) => state.auth.user)
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const isSyncing = React.useRef(false);
    const fetchCurrentData = async (symbol, showLoading = true) => {
        try {
            if (showLoading) dispatch(setLoading(true));
            // Automatically append .NS if no exchange is specified
            const querySymbol = symbol.includes('.') ? symbol : `${symbol}.NS`;
            const res = await fetch(`https://69db9d6c003aa1b2bfe1.fra.appwrite.run/?symbol=${querySymbol}`);

            if (!res.ok) throw new Error(`Server Error: ${res.status}`);

            const data = await res.json();
            if (showLoading) dispatch(setLoading(false));
            return data;
        } catch (err) {
            console.error("Fetch Failed:", err.message);
            if (showLoading) dispatch(setLoading(false));
            return null;
        }
    }

    const syncStockPrices = async (stocks) => {
        if (isSyncing.current) return;
        
        const today = new Date().toDateString();
        
        // Identify stocks that haven't been updated today
        const stocksToUpdate = stocks.filter(stock => {
            const lastUpdate = new Date(stock.$updatedAt).toDateString();
            return lastUpdate !== today && stock.symbol && stock.quantity;
        });

        if (stocksToUpdate.length === 0) return;

        isSyncing.current = true;
        const syncToast = toast.loading('Refreshing portfolio values...');
        let updatedCount = 0;
        
        try {
            for (const stock of stocksToUpdate) {
                const data = await fetchCurrentData(stock.symbol, false);
                const price = data?.price || data?.currentPrice || data?.close;
                
                if (price) {
                    const newCurrentValue = Number(price) * Number(stock.quantity);
                    await investmentService.updateInvestment(stock.$id, { 
                        currentValue: newCurrentValue 
                    });
                    updatedCount++;
                }
            }
            
            if (updatedCount > 0) {
                toast.success(`Updated ${updatedCount} portfolio values`, { id: syncToast });
                // We refresh the list to get new $updatedAt values, 
                // but our 'isSyncing' flag will prevent the next fetchInvestments from re-triggering this.
                await fetchInvestments(true); 
            } else {
                toast.dismiss(syncToast);
            }
        } catch (error) {
            console.error("Sync failed:", error);
            toast.error('Failed to update stock prices', { id: syncToast });
        } finally {
            isSyncing.current = false;
        }
    };

    const fetchInvestments = async (skipSync = false) => {
        if (!user) return
        try {
            const res = await investmentService.getInvestments({ userId: user.$id })
            setInvestments(res.documents)
            
            if (!skipSync) {
                // Trigger sync for stocks if it's a new day
                const stocks = res.documents.filter(inv => inv.investmentType === 'stock');
                if (stocks.length > 0) {
                    syncStockPrices(stocks);
                }
            }
        } catch (error) {
            toast.error('Failed to fetch investments')
        }
    }

    useEffect(() => {
        fetchInvestments()
    }, [user])

    const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.investedAmount || 0), 0)
    const totalCurrentValue = investments.reduce((sum, inv) => sum + Number(inv.currentValue || 0), 0)
    const totalReturns = totalCurrentValue - totalInvested
    const returnsPercentage = totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(2) : 0

    const handleInvestmentSaved = () => {
        fetchInvestments()
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this investment? (Linked transaction will also be deleted)")) return
        const success = await investmentService.deleteInvestment(id, transactionService)
        if (success) {
            setInvestments(investments.filter(inv => inv.$id !== id))
            toast.success('Investment deleted')
        } else {
            toast.error('Failed to delete investment')
        }
    }

    const handleEdit = (inv) => {
        setSelectedInvestment(inv)
        setIsModalOpen(true)
    }

    const getTypeColor = (type) => {
        switch(type) {
            case 'mf': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
            case 'stock': return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'
            case 'fd': return 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
            default: return 'bg-neutral-100 text-neutral-600 dark:bg-neutral-500/20 dark:text-neutral-400'
        }
    }

    return (
        <div className='w-full space-y-10'>
            <header className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
                <div className="space-y-2">
                    <h1 className='text-4xl font-black tracking-tight'>Investments</h1>
                    <p className='text-neutral-500 dark:text-neutral-400 font-medium'>
                        Track your portfolio performance across mf, FD, and Stocks .
                    </p>
                </div>
                <div className='flex gap-3'>
                    <Button
                        onClick={() => {
                            setSelectedInvestment(null)
                            setIsModalOpen(true)
                        }}
                        icon={() => (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        )}
                    >
                        Add Portfolio
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Invested', value: `₹${totalInvested.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: '💎', color: 'bg-indigo-500' },
                    { label: 'Current Value', value: `₹${totalCurrentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: '📈', color: 'bg-emerald-500' },
                    { label: 'Overall Returns', value: `${totalReturns >= 0 ? '+' : '-'}₹${Math.abs(totalReturns).toLocaleString('en-IN', { minimumFractionDigits: 2 })} (${returnsPercentage}%)`, icon: '🚀', color: totalReturns >= 0 ? 'bg-emerald-500' : 'bg-rose-500' },
                ].map((stat, i) => (
                    <FloatingCard key={i} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm overflow-hidden relative group">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-[0.03] rounded-bl-full transition-transform group-hover:scale-110`} />
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-sm font-bold uppercase tracking-widest text-neutral-400">{stat.label}</span>
                        </div>
                        <div className={`text-3xl font-black ${stat.label === 'Overall Returns' ? (totalReturns >= 0 ? 'text-emerald-500' : 'text-rose-500') : ''}`}>{stat.value}</div>
                    </FloatingCard>
                ))}
            </div>

            <div className="overflow-x-auto overflow-y-hidden rounded-3xl border border-neutral-100 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/30 backdrop-blur-sm shadow-sm ring-1 ring-black/5 dark:ring-white/5">
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className='bg-neutral-50/50 dark:bg-neutral-800/50'>
                            <th className='px-8 py-5 text-xs font-black uppercase tracking-widest text-neutral-400'>Asset</th>
                            <th className='px-8 py-5 text-xs font-black uppercase tracking-widest text-neutral-400 text-right'>Invested</th>
                            <th className='px-8 py-5 text-xs font-black uppercase tracking-widest text-neutral-400 text-right'>Current Value</th>
                            <th className='px-8 py-5 text-xs font-black uppercase tracking-widest text-neutral-400 text-right'>Returns</th>
                            <th className='px-8 py-5 text-xs font-black uppercase tracking-widest text-neutral-400 text-right'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
                        {investments.map((inv) => {
                            const pnl = inv.currentValue - inv.investedAmount;
                            const pnlPercent = inv.investedAmount > 0 ? ((pnl / inv.investedAmount) * 100).toFixed(2) : 0;
                            return (
                                <tr key={inv.$id} className='hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group'>
                                    <td className='px-8 py-6'>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${getTypeColor(inv.investmentType)}`}>
                                                {(inv.investmentType || '??').slice(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-neutral-900 dark:text-white">
                                                    {inv.investmentName} {inv.investmentType === "stock" && inv.quantity ? `(${inv.quantity} shares)` : ""}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 tracking-wider">
                                                    <span>Avg Price: ₹{inv.avgBuyPrice?.toLocaleString('en-IN') || '0.00'}</span>
                                                    {inv.symbol && (
                                                        <>
                                                            <span className="w-1 h-1 rounded-full bg-neutral-300" />
                                                            <span className="uppercase">{inv.symbol}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-8 py-6 text-right font-bold text-neutral-600 dark:text-neutral-300'>
                                        ₹{inv.investedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className='px-8 py-6 text-right tabular-nums'>
                                        <div className="flex flex-col items-end">
                                            <span className="font-black text-neutral-900 dark:text-white">
                                                ₹{inv.currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </span>
                                            <span className="text-[10px] font-medium text-neutral-400 tracking-tight">
                                                Synced: {new Date(inv.$updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={`px-8 py-6 text-right font-bold ${pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        <div className="flex flex-col items-end">
                                            <span>{pnl >= 0 ? '+' : '-'}₹{Math.abs(pnl).toLocaleString('en-IN')}</span>
                                            <span className="text-xs font-black opacity-80">{pnl >= 0 ? '↑' : '↓'} {Math.abs(pnlPercent)}%</span>
                                        </div>
                                    </td>
                                    <td className='px-8 py-6 text-right'>
                                        <div className="flex gap-2 justify-end">
                                            <Button variant="ghost" size="sm" onClick={() => navigate(`/investments/${inv.$id}`)}>View</Button>
                                            <Button variant="secondary" size="sm" onClick={() => handleEdit(inv)}>Edit</Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(inv.$id)}>Delete</Button>
                                        </div>
                                    </td>

                                </tr>
                            )
                        })}
                        {investments.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-8 py-12 text-center text-neutral-500 font-bold">No investments found. Add some to build your portfolio!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <InvestmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                investment={selectedInvestment}
                onInvestmentSaved={handleInvestmentSaved}
            />
        </div>
    )
}
