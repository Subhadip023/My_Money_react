import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { accountService } from '../services';
import transactionService from '../appwrite/transaction';
import TransactionIcon from '../components/ui/TransactionIcon';
import toast from 'react-hot-toast';
import FloatingCard from '../components/ui/FlotingCard';
import Button from '../components/shared/Button';

export default function AccountDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!user?.$id) return;
            setLoading(true);
            try {
                // Fetch account details
                const acc = await accountService.getAccount(id);
                if (acc.userId !== user.$id) {
                    toast.error("Unauthorized");
                    navigate('/accounts');
                    return;
                }
                setAccount(acc);

                // Fetch transactions and filter for this account
                const txRes = await transactionService.getTransactions({ userId: user.$id });
                const accountTxs = txRes.documents.filter(tx => tx.accounts?.$id === id || tx.accounts === id);
                setTransactions(accountTxs);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load account details");
                navigate('/accounts');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, user, navigate]);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
    }

    if (!account) return null;

    const totalIncome = transactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpense = transactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);

    return (
        <div className='w-full space-y-10'>
            <header className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
                <div className="space-y-2">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/accounts')} className="px-2">
                            ← Back
                        </Button>
                        <h1 className='text-4xl font-black tracking-tight capitalize'>{account.accountName}</h1>
                    </div>
                    <p className='text-neutral-500 dark:text-neutral-400 font-medium capitalize ml-16'>
                        {account.accountType} Account
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Current Balance', value: `₹${account.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: '💰', color: 'bg-indigo-500' },
                    { label: 'Total Income', value: `₹${totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: '📈', color: 'bg-emerald-500' },
                    { label: 'Total Expenses', value: `₹${totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: '📉', color: 'bg-rose-500' },
                ].map((stat, i) => (
                    <FloatingCard key={i} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm overflow-hidden relative group">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-[0.03] rounded-bl-full transition-transform group-hover:scale-110`} />
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-sm font-bold uppercase tracking-widest text-neutral-400">{stat.label}</span>
                        </div>
                        <div className="text-3xl font-black">{stat.value}</div>
                    </FloatingCard>
                ))}
            </div>

            <FloatingCard className="p-6 md:p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm overflow-hidden relative group">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black">Transaction History</h3>
                </div>
                <div className="space-y-4">
                    {transactions.map((tx) => (
                        <div key={tx.$id} className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
                            <div className="flex items-center gap-4">
                                <TransactionIcon type={tx.type} className="w-12 h-12 shadow-sm" />
                                <div>
                                    <p className="font-bold truncate max-w-[150px] sm:max-w-[200px]">{tx.label}</p>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                        {new Date(tx.$createdAt).toLocaleDateString('en-GB')} {tx.categories && `• ${tx.categories.name}`}
                                    </p>
                                </div>
                            </div>
                            <div className={`font-black ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                    ))}
                    {transactions.length === 0 && (
                        <div className="text-center text-neutral-500 dark:text-neutral-400 py-8 font-medium">
                            No transactions found for this account.
                        </div>
                    )}
                </div>
            </FloatingCard>
        </div>
    );
}
