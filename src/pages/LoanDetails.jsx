import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { loanService, transactionService } from '../services';
import TransactionTable from '../components/ui/TransactionTable';
import toast from 'react-hot-toast';
import FloatingCard from '../components/ui/FlotingCard';
import Button from '../components/shared/Button';

export default function LoanDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const [loan, setLoan] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!user?.$id) return;
            setLoading(true);
            try {
                // Fetch loan details
                const res = await loanService.getLoan(id);
                if (!res || res.userId !== user.$id) {
                    toast.error("Unauthorized or Loan not found");
                    navigate('/loans');
                    return;
                }
                setLoan(res);

                // Fetch transactions linked to this loan
                const txRes = await transactionService.getTransactionsByLoan({ 
                    userId: user.$id, 
                    loanId: id 
                });
                setTransactions(txRes.documents);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load loan details");
                navigate('/loans');
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

    if (!loan) return null;

    const repaymentPercent = loan.principalAmount > 0 
        ? (((loan.principalAmount - loan.outstandingAmount) / loan.principalAmount) * 100).toFixed(2) 
        : 0;

    const getTypeColor = (type) => {
        switch(type) {
            case 'home': return 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
            case 'personal': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
            case 'education': return 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
            case 'car': return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'
            case 'business': return 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
            default: return 'bg-neutral-100 text-neutral-600 dark:bg-neutral-500/20 dark:text-neutral-400'
        }
    }

    const getStatusStyle = (status) => {
        switch(status.toLowerCase()) {
            case 'active': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20'
            case 'settled': return 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20'
            case 'defaulted': return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20'
            default: return 'bg-neutral-50 text-neutral-600 dark:bg-neutral-500/10'
        }
    }

    return (
        <div className='w-full space-y-10'>
            <header className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
                <div className="space-y-2">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/loans')} className="px-2">
                            ← Back
                        </Button>
                        <h1 className='text-4xl font-black tracking-tight capitalize'>{loan.loanName}</h1>
                    </div>
                    <div className="flex items-center gap-3 ml-16">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getTypeColor(loan.loanType)}`}>
                            {loan.loanType} Loan
                        </span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(loan.status)}`}>
                            {loan.status}
                        </span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Principal Amount', value: `₹${loan.principalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: '📄', color: 'bg-indigo-500' },
                    { label: 'Outstanding Balance', value: `₹${loan.outstandingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: '📉', color: 'bg-rose-500' },
                    { 
                        label: 'Repayment Progress', 
                        value: `${repaymentPercent}% Paid`, 
                        icon: '✅', 
                        color: 'bg-emerald-500'
                    },
                ].map((stat, i) => (
                    <FloatingCard key={i} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm overflow-hidden relative group">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-[0.03] rounded-bl-full transition-transform group-hover:scale-110`} />
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-sm font-bold uppercase tracking-widest text-neutral-400">{stat.label}</span>
                        </div>
                        <div className={`text-3xl font-black ${stat.label === 'Outstanding Balance' ? 'text-rose-500' : ''}`}>{stat.value}</div>
                    </FloatingCard>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FloatingCard className="p-6 md:p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm">
                    <h3 className="text-xl font-black mb-6">Loan Information</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between py-3 border-b border-neutral-100 dark:border-neutral-700">
                            <span className="text-neutral-500 font-medium">Interest Rate</span>
                            <span className="font-bold">{loan.interestRate || '0'}%</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-neutral-100 dark:border-neutral-700">
                            <span className="text-neutral-500 font-medium">Due Date</span>
                            <span className="font-bold">{new Date(loan.dueDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                        </div>
                        <div className="flex justify-between py-3">
                            <span className="text-neutral-500 font-medium">Loan Type</span>
                            <span className="font-bold capitalize">{loan.loanType}</span>
                        </div>
                    </div>
                </FloatingCard>

                <FloatingCard className="p-6 md:p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm">
                    <h3 className="text-xl font-black mb-6">Repayment Summary</h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold">
                                <span>Paid: ₹{(loan.principalAmount - loan.outstandingAmount).toLocaleString('en-IN')}</span>
                                <span>Total: ₹{loan.principalAmount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="w-full h-4 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                                    style={{ width: `${repaymentPercent}%` }}
                                />
                            </div>
                        </div>
                        <p className="text-sm text-neutral-500 font-medium">
                            You have repaid {repaymentPercent}% of your principal amount. 
                            {loan.outstandingAmount > 0 ? ` A balance of ₹${loan.outstandingAmount.toLocaleString('en-IN')} is still outstanding.` : ' This loan is fully settled.'}
                        </p>
                    </div>
                </FloatingCard>
            </div>

            <FloatingCard className="p-6 md:p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm overflow-hidden relative group">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black">Repayment & Activity History</h3>
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
