import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { categoryService, transactionService } from '../services';
import toast from 'react-hot-toast';
import FloatingCard from '../components/ui/FlotingCard';
import Button from '../components/shared/Button';
import { cn } from '../utils';

export default function CategoryDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const [category, setCategory] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!user?.$id) return;
            setLoading(true);
            try {
                // Fetch category details
                const cat = await categoryService.getCategory(id);
                if (cat.userId !== user.$id) {
                    toast.error("Unauthorized");
                    navigate('/categories');
                    return;
                }
                setCategory(cat);

                // Fetch transactions and filter for this category
                const txRes = await transactionService.getTransactions({ userId: user.$id });
                // Assuming transactions have a 'categories' relationship or categoryId field
                // Based on previous views, it likely has categories relationship
                const categoryTxs = txRes.documents.filter(tx => 
                    (tx.categories?.$id === id || tx.categories === id)
                );
                
                // Transactions are already sorted by $createdAt desc in transactionService.getTransactions
                setTransactions(categoryTxs);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load category details");
                navigate('/categories');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, user, navigate]);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
    }

    if (!category) return null;

    const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);

    return (
        <div className='w-full space-y-10'>
            <header className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
                <div className="space-y-2">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/categories')} className="px-2">
                            ← Back
                        </Button>
                        <h1 className='text-4xl font-black tracking-tight capitalize'>{category.name}</h1>
                    </div>
                    <div className="flex items-center gap-2 ml-16">
                        <span className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                            category.type === 'income'
                                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                : "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                        )}>
                            {category.type} Category
                        </span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FloatingCard className="p-6 md:p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500 opacity-[0.03] rounded-bl-full transition-transform group-hover:scale-110" />
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-2xl">📊</span>
                        <span className="text-sm font-bold uppercase tracking-widest text-neutral-400">Total {category.type === 'income' ? 'Income' : 'Spending'}</span>
                    </div>
                    <div className="text-3xl font-black text-neutral-900 dark:text-white tabular-nums">
                        ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                </FloatingCard>
                
                <FloatingCard className="p-6 md:p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500 opacity-[0.03] rounded-bl-full transition-transform group-hover:scale-110" />
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-2xl">📝</span>
                        <span className="text-sm font-bold uppercase tracking-widest text-neutral-400">Transaction Count</span>
                    </div>
                    <div className="text-3xl font-black text-neutral-900 dark:text-white">
                        {transactions.length}
                    </div>
                </FloatingCard>
            </div>

            <FloatingCard className="p-6 md:p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm overflow-hidden relative group">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black">Category History</h3>
                </div>
                <div className="space-y-4">
                    {transactions.map((tx) => (
                        <div key={tx.$id} className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'}`}>
                                    {tx.type === 'income' ? '↓' : '↑'}
                                </div>
                                <div>
                                    <p className="font-bold truncate max-w-[150px] sm:max-w-[200px]">{tx.label}</p>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                        {new Date(tx.$createdAt).toLocaleDateString('en-GB')} {tx.accounts && `• ${tx.accounts.accountName}`}
                                    </p>
                                </div>
                            </div>
                            <div className={`font-black ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                    ))}
                    {transactions.length === 0 && (
                        <div className="text-center text-neutral-500 dark:text-neutral-400 py-12 font-medium">
                            <p className="text-4xl mb-4 opacity-20">📭</p>
                            No transactions found for this category.
                        </div>
                    )}
                </div>
            </FloatingCard>
        </div>
    );
}
