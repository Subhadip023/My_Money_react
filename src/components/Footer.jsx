export default function Footer() {
    return (
        <footer className="mt-5 pl-5 py-5 text-left text-neutral-400 text-sm border-t border-neutral-100 dark:border-neutral-800 transition-colors dark:bg-neutral-900 sticky bottom-0 flex items-center justify-between pr-5">
            <p>© {new Date().getFullYear()} MyMoney App. Built with Passion by Chakraborty Subhadip </p>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Beta v1.0</span>
            </div>
        </footer>
    )
}