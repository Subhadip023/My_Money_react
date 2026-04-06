import React from 'react'

export const About = () => {
    return (
        <div className="max-w-6xl mx-auto py-10 md:py-16 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Section */}
            <div className="text-center space-y-6">
                <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mb-2 border border-indigo-100 dark:border-indigo-800/50">
                    Our Mission
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-neutral-900 via-indigo-600 to-violet-600 dark:from-white dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                    Financial Mastery Simplified.
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                    Experience the next generation of personal finance. From daily expense tracking to complex multi-asset portfolios including Investments and Loans, we've built a command center for your entire financial lifecycle.
                </p>
            </div>

            {/* Grid Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                    {
                        title: 'Premium Security',
                        desc: 'Your data is encrypted and managed via Appwrite, ensuring your financial secrets stay yours.',
                        icon: '🛡️'
                    },
                    {
                        title: 'Wealth Analytics',
                        desc: 'Real-time insights into your habitual spending habits with an advanced, intuitive dashboard.',
                        icon: '📊'
                    },
                    {
                        title: 'Investment Portfolio',
                        desc: 'Monitor your diversified assets, from Mutual Funds and Stocks to Fixed Deposits, with up-to-date valuations.',
                        icon: '🏦'
                    },
                    {
                        title: 'Debt & Loans',
                        desc: 'Stay on top of mortgages, personal loans, and credit agreements with automated settlement tracking.',
                        icon: '💰'
                    },
                    {
                        title: 'Multi-Account Sync',
                        desc: 'Unify all your cash accounts, savings, and wallets into a single, cohesive financial command center.',
                        icon: '💳'
                    },
                    {
                        title: 'Advanced Reporting',
                        desc: 'Generate comprehensive monthly financial reports and export your entire history to Excel instantly.',
                        icon: '📋'
                    }
                ].map((item, i) => (
                    <div key={i} className="group p-8 rounded-[32px] bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
                        <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300 inline-block">{item.icon}</div>
                        <h3 className="text-xl font-black mb-3">{item.title}</h3>
                        <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* Quote / Vision */}
            <div className="relative p-8 md:p-12 rounded-[40px] bg-neutral-900 dark:bg-neutral-800 border border-neutral-800 dark:border-neutral-700 text-center space-y-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
                <p className="text-xl md:text-2xl font-bold italic text-neutral-300 dark:text-neutral-100 relative z-10">
                    "The goal isn't just to save money, it's to master it."
                </p>
            </div>

            {/* Beta Version Note */}
            <div className="p-8 rounded-[32px] bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30">
                <div className="flex items-center gap-4 mb-4">
                    <span className="flex h-3 w-3 rounded-full bg-indigo-500 animate-pulse" />
                    <h3 className="text-xl font-black text-indigo-900 dark:text-indigo-100 uppercase tracking-tighter">BETA Version 1.0</h3>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">
                    This is currently a **Beta Release**. We are working hard to bring you more features including advanced AI insights, multi-currency support, and direct bank integrations. Stay tuned as we build the future of finance!
                </p>
            </div>

            {/* Author Credit */}
            <div className="pt-12 border-t border-neutral-100 dark:border-neutral-800 flex flex-col items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 p-[2px] shadow-lg">
                        <div className="w-full h-full rounded-[14px] bg-white dark:bg-neutral-800 flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400 text-xl">
                            S
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-black text-neutral-900 dark:text-white leading-none mb-1">Subhadip Chakraborty</p>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Creative Lead & Developer</p>
                    </div>
                </div>

                <p className="text-neutral-400 dark:text-neutral-500 text-xs font-bold uppercase tracking-widest text-center">
                    Made with passion by Subhadip Chakraborty
                </p>
            </div>
        </div>
    )
}
