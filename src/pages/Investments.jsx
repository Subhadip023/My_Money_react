import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Button from '../components/shared/Button'
import FloatingCard from '../components/ui/FlotingCard'
import Modal from '../components/ui/Modal'
import investmentService from '../appwrite/investment'
import toast from 'react-hot-toast'

export default function Investments() {
    const [investments, setInvestments] = useState([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({
        investmentType: 'mf',
        investmentName: '',
        investedAmount: '',
        currentValue: '',
        quantity: '',
        symbol: '',
        avgBuyPrice: ''
    })
    const user = useSelector((state) => state.auth.user)

    const fetchInvestments = async () => {
        if (!user) return
        try {
            const res = await investmentService.getInvestments({ userId: user.$id })
            setInvestments(res.documents)
        } catch (error) {
            toast.error('Failed to fetch investments')
        }
    }

    useEffect(() => {
        fetchInvestments()
    }, [user])

    const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.investedAmount), 0)
    const totalCurrentValue = investments.reduce((sum, inv) => sum + Number(inv.currentValue), 0)
    const totalReturns = totalCurrentValue - totalInvested
    const returnsPercentage = totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(2) : 0

    const handleAddInvestment = async (e) => {
        e.preventDefault()
        if (!formData.investmentName || !formData.investedAmount || !formData.currentValue) {
            toast.error('Please fill all required fields')
            return
        }

        try {
            const avgPrice = formData.avgBuyPrice || (Number(formData.investedAmount) / Number(formData.quantity || 1))
            
            const payload = {
                userId: user.$id,
                ...formData,
                investedAmount: Number(formData.investedAmount),
                currentValue: Number(formData.currentValue),
                quantity: Number(formData.quantity || 0),
                avgBuyPrice: Number(avgPrice)
            }

            if (editingId) {
                await investmentService.updateInvestment(editingId, payload)
                toast.success('Investment updated successfully')
            } else {
                await investmentService.createInvestment(payload)
                toast.success('Investment added successfully')
            }
            
            setIsAddModalOpen(false)
            setEditingId(null)
            setFormData({
                investmentType: 'mf',
                investmentName: '',
                investedAmount: '',
                currentValue: '',
                quantity: '',
                symbol: '',
                avgBuyPrice: ''
            })
            fetchInvestments()
        } catch (error) {
            toast.error(error.message || `Failed to ${editingId ? 'update' : 'add'} investment`)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this investment?")) return
        const success = await investmentService.deleteInvestment(id)
        if (success) {
            setInvestments(investments.filter(inv => inv.$id !== id))
            toast.success('Investment deleted')
        } else {
            toast.error('Failed to delete investment')
        }
    }

    const handleEdit = (inv) => {
        setEditingId(inv.$id)
        setFormData({
            investmentType: inv.investmentType,
            investmentName: inv.investmentName,
            investedAmount: inv.investedAmount,
            currentValue: inv.currentValue,
            quantity: inv.quantity,
            symbol: inv.symbol,
            avgBuyPrice: inv.avgBuyPrice
        })
        setIsAddModalOpen(true)
    }

    const getTypeColor = (type) => {
        switch(type) {
            case 'mf': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
            case 'Stock': return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'
            case 'FD': return 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
            default: return 'bg-neutral-100 text-neutral-600 dark:bg-neutral-500/20 dark:text-neutral-400'
        }
    }

    return (
        <div className='w-full space-y-10'>
            <header className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
                <div className="space-y-2">
                    <h1 className='text-4xl font-black tracking-tight'>Investments</h1>
                    <p className='text-neutral-500 dark:text-neutral-400 font-medium'>
                        Track your portfolio performance across mf, FD, and Stocks (Frontend Demo).
                    </p>
                </div>
                <div className='flex gap-3'>
                    <Button
                        onClick={() => {
                            setEditingId(null)
                            setFormData({
                                investmentType: 'mf',
                                investmentName: '',
                                investedAmount: '',
                                currentValue: '',
                                quantity: '',
                                symbol: '',
                                avgBuyPrice: ''
                            })
                            setIsAddModalOpen(true)
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
                            <th className='px-8 py-5 text-xs font-black uppercase tracking-widest text-neutral-400 text-right'>Qty / Symbol</th>
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
                                                {inv.investmentType.slice(0, 2)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-neutral-900 dark:text-white">{inv.investmentName}</div>
                                                <div className="text-xs font-medium text-neutral-500 tracking-wider">Avg Price: ₹{inv.avgBuyPrice?.toLocaleString('en-IN')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-8 py-6 text-right font-bold text-neutral-600 dark:text-neutral-300'>
                                        <div className="flex flex-col items-end">
                                            <span>{inv.quantity || 0} units</span>
                                            <span className="text-[10px] uppercase tracking-tighter opacity-60">{inv.symbol || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className='px-8 py-6 text-right font-bold text-neutral-600 dark:text-neutral-300'>
                                        ₹{inv.investedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className='px-8 py-6 text-right font-black text-neutral-900 dark:text-white tabular-nums'>
                                        ₹{inv.currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className={`px-8 py-6 text-right font-bold ${pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        <div className="flex flex-col items-end">
                                            <span>{pnl >= 0 ? '+' : '-'}₹{Math.abs(pnl).toLocaleString('en-IN')}</span>
                                            <span className="text-xs font-black opacity-80">{pnl >= 0 ? '↑' : '↓'} {Math.abs(pnlPercent)}%</span>
                                        </div>
                                    </td>
                                    <td className='px-8 py-6 text-right'>
                                        <div className="flex gap-2 justify-end">
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

            <Modal 
                isOpen={isAddModalOpen} 
                onClose={() => {
                    setIsAddModalOpen(false)
                    setEditingId(null)
                }} 
                title={editingId ? "Edit Investment" : "Add Investment"}
            >
                <form onSubmit={handleAddInvestment} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Type</label>
                            <select
                                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                value={formData.investmentType}
                                onChange={(e) => setFormData({...formData, investmentType: e.target.value})}
                            >
                                <option value="mf">Mutual Fund</option>
                                <option value="stock">Stock</option>
                                <option value="fd">Fixed Deposit</option>
                                {/* <option value="Gold">Gold</option> */}
                            </select>
                        </div>
                        {formData.investmentType=='stock' && <div>
                            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Symbol (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. RELIANCE"
                                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                value={formData.symbol}
                                onChange={(e) => setFormData({...formData, symbol: e.target.value})}
                            />
                        </div>}
                    <div>
                        <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Investment Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Quant Flexi Cap, Axis Bank FD"
                            className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                            value={formData.investmentName}
                            onChange={(e) => setFormData({...formData, investmentName: e.target.value})}
                        />
                    </div>
                         {formData.investmentType=='stock' && <div>
                            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Quantity (Optional)</label>
                            <input
                                type="number"
                                min="0"
                                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                value={formData.quantity}
                                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                            />
                        </div>}
                        <div>
                            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Invested Amount (₹)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                value={formData.investedAmount}
                                onChange={(e) => setFormData({...formData, investedAmount: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Current Value (₹)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                value={formData.currentValue}
                                onChange={(e) => setFormData({...formData, currentValue: e.target.value})}
                            />
                        </div>
                         {formData.investmentType=='stock' && <div>
                            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Avg Buy Price (Optional)</label>
                            <input
                                type="number"
                                placeholder="Auto from qty if empty"
                                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                value={formData.avgBuyPrice}
                                onChange={(e) => setFormData({...formData, avgBuyPrice: e.target.value})}
                            />
                        </div>}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            className="flex-1 py-3 px-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold rounded-2xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                            onClick={() => setIsAddModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 px-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-95 transition"
                        >
                            {editingId ? "Update Investment" : "Save Investment"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
