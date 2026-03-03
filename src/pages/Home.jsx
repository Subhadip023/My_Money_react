import Card from "../components/ui/FlotingCard"
export const Home = () => (
    <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white mb-6 tracking-tight leading-snug">
            Master Your <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">Finances</span> Today
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium transition-colors">
            Your personal finance manager. Track expenses, manage budgets, and achieve your financial goals with ease.
        </p>

        {/* Main Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            {[
                { title: 'Smart Insights', desc: 'Visualize your wealth with real-time analytics and intuitive spending charts.', icon: '📊' },
                { title: 'Secure Vault', desc: 'Industry-leading encryption ensures your financial data stays private and protected.', icon: '🔐' },
                { title: 'Cloud Sync', desc: 'Your money, everywhere. Seamlessly sync your data across all your devices instantly.', icon: '☁️' }
            ].map((feature, i) => (
                <Card key={i}>
                    <div className="mb-4 text-3xl">
                        {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-neutral-800 dark:text-white">{feature.title}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{feature.desc}</p>
                </Card>
            ))}
        </div>

        {/* Detailed Features Section */}
        <div className="max-w-4xl mx-auto text-left py-12 border-t border-neutral-100 dark:border-neutral-800">
            <h3 className="text-2xl font-black mb-10 text-center text-neutral-900 dark:text-white">
                Everything you need to <span className="text-indigo-600 dark:text-indigo-400">succeed</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {[
                    { title: 'Financial Dashboard', desc: 'Track Total Balance, Monthly Income, and Expenses in real-time.', icon: '🏠' },
                    { title: 'Multi-Account Support', desc: 'Manage Savings, Cash, and Credit Cards in a single unified view.', icon: '💳' },
                    { title: 'Seamless Transfers', desc: 'Move money between accounts with automatic double-entry records.', icon: '🔄' },
                    { title: 'Smart Categorization', desc: 'Organize spending with custom labels like Food, Rent, and Travel.', icon: '🏷️' },
                    { title: 'Deep Transaction History', desc: 'Complete CRUD support to keep your financial records accurate.', icon: '📝' },
                    { title: 'Premium Dark Mode', desc: 'A stunning, high-contrast dark interface designed for eye comfort.', icon: '🌙' }
                ].map((item, i) => (
                    <div key={i} className="flex gap-5 group">
                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xl transition-transform group-hover:scale-110">
                            {item.icon}
                        </div>
                        <div>
                            <h4 className="font-bold text-neutral-900 dark:text-white mb-1">{item.title}</h4>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
)
