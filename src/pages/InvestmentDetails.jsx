import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { investmentService, transactionService } from '../services';
import TransactionTable from '../components/ui/TransactionTable';
import toast from 'react-hot-toast';
import FloatingCard from '../components/ui/FlotingCard';
import Button from '../components/shared/Button';

export default function InvestmentDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const [investment, setInvestment] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!user?.$id) return;
            setLoading(true);
            try {
                // Fetch investment details
                const inv = await investmentService.getInvestment(id);
                if (inv.userId !== user.$id) {
                    toast.error("Unauthorized");
                    navigate('/investments');
                    return;
                }
                setInvestment(inv);

                // Fetch transactions linked to this investment
                const txRes = await transactionService.getTransactionsByInvestment({ 
                    userId: user.$id, 
                    investmentId: id 
                });
                setTransactions(txRes.documents);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load investment details");
                navigate('/investments');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, user, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!investment) return null;

    const pnl = investment.currentValue - investment.investedAmount;
    const pnlPercent = investment.investedAmount > 0 ? ((pnl / investment.investedAmount) * 100).toFixed(2) : 0;

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
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/investments')} className="px-2">
                            ← Back
                        </Button>
                        <h1 className='text-4xl font-black tracking-tight capitalize'>{investment.investmentName}</h1>
                    </div>
                    <div className="flex items-center gap-3 ml-16">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getTypeColor(investment.investmentType)}`}>
                            {investment.investmentType === 'mf' ? 'Mutual Fund' : investment.investmentType === 'stock' ? 'Stock' : 'Fixed Deposit'}
                        </span>
                        {investment.symbol && (
                            <span className="text-sm font-bold text-neutral-400 uppercase tracking-widest">
                                {investment.symbol}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Invested Amount', value: `₹${investment.investedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: '💰', color: 'bg-indigo-500' },
                    { label: 'Current Value', value: `₹${investment.currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: '📈', color: 'bg-emerald-500' },
                    { 
                        label: 'Total Returns', 
                        value: `${pnl >= 0 ? '+' : '-'}₹${Math.abs(pnl).toLocaleString('en-IN', { minimumFractionDigits: 2 })} (${pnlPercent}%)`, 
                        icon: '🚀', 
                        color: pnl >= 0 ? 'bg-emerald-500' : 'bg-rose-500',
                        textColor: pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'
                    },
                ].map((stat, i) => (
                    <FloatingCard key={i} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm overflow-hidden relative group">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-[0.03] rounded-bl-full transition-transform group-hover:scale-110`} />
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-sm font-bold uppercase tracking-widest text-neutral-400">{stat.label}</span>
                        </div>
                        <div className={`text-3xl font-black ${stat.textColor || ''}`}>{stat.value}</div>
                    </FloatingCard>
                ))}
            </div>

            <FloatingCard className="p-6 md:p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm overflow-hidden relative group">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black">Transaction History</h3>
                </div>
                <TransactionTable 
                    transactions={transactions}
                    showAccount={true}
                    showActions={false}
                />
            </FloatingCard>
        </div>
    );
}
