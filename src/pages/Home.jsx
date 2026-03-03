import Card from "../components/ui/FlotingCard"
export const Home = () => (
    <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white mb-6 tracking-tight leading-snug">
            Master Your <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">Finances</span> Today
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium transition-colors">
            Your personal finance manager. Track expenses, manage budgets, and achieve your financial goals with ease.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[1, 2, 3].map((i) => (
                <Card key={i}>
                    <div className="mb-4 text-2xl">
                        {i === 1 ? '📊' : i === 2 ? '🔐' : '☁️'}
                    </div>
                    <h3 className="font-bold mb-2">Feature {i}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Lorem ipsum dolor sit amet, conse ctetur adipiscing elit.</p>
                </Card>
            ))}
        </div>
    </div>
)
