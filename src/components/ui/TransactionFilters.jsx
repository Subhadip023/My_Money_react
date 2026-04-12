import React from 'react';
import Button from '../shared/Button';

export default function TransactionFilters({ 
    categories = [], 
    accounts = [], 
    filters, 
    onFilterChange,
    onClear 
}) {
    return (
        <div className="bg-white/50 dark:bg-neutral-800/30 backdrop-blur-sm p-6 rounded-[2rem] border border-neutral-100 dark:border-neutral-700/50 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Search */}
                <div className="flex-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3 ml-1 block">Search</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">🔍</span>
                        <input 
                            type="text"
                            placeholder="Search by label..."
                            className="w-full bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-700 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
                            value={filters.label}
                            onChange={(e) => onFilterChange('label', e.target.value)}
                        />
                    </div>
                </div>

                {/* Type Filter */}
                <div className="w-full md:w-56">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3 ml-1 block">Type</label>
                    <div className="flex bg-neutral-100 dark:bg-neutral-900 p-1 rounded-2xl border border-neutral-100 dark:border-neutral-700">
                        {['all', 'income', 'expense'].map((type) => (
                            <button
                                key={type}
                                onClick={() => onFilterChange('type', type)}
                                className={`flex-1 py-2 px-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                                    filters.type === type 
                                    ? 'bg-white dark:bg-neutral-800 text-indigo-600 shadow-sm' 
                                    : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Category Dropdown */}
                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3 ml-1 block">Category</label>
                    <select 
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-700 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none cursor-pointer"
                        value={filters.category}
                        onChange={(e) => onFilterChange('category', e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.$id} value={cat.$id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* Account Dropdown */}
                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3 ml-1 block">Account</label>
                    <select 
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-700 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none cursor-pointer"
                        value={filters.account}
                        onChange={(e) => onFilterChange('account', e.target.value)}
                    >
                        <option value="all">All Accounts</option>
                        {accounts.map(acc => (
                            <option key={acc.$id} value={acc.$id}>{acc.accountName}</option>
                        ))}
                    </select>
                </div>

                {/* Actions */}
                <div className="flex items-end pb-1">
                    <Button 
                        variant="ghost" 
                        onClick={onClear}
                        className="w-full justify-center h-[52px] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/5 transition-all"
                    >
                        Clear Filters
                    </Button>
                </div>
            </div>
        </div>
    );
}
