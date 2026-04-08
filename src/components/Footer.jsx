export default function Footer() {
    return (
        <footer className="mt-5 pl-5 py-5 text-left text-neutral-400 text-sm border-t border-neutral-100 dark:border-neutral-800 transition-colors dark:bg-neutral-900 sticky bottom-0 flex items-center justify-between pr-5 z-10 bg-white dark:bg-neutral-900">
            <div className="flex items-center gap-4">
                <p>© {new Date().getFullYear()} MyMoney App.</p>
                <a href="mailto:subhadip240420@gmail.com" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold flex items-center gap-1.5 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    Contact
                </a>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Beta v1.0</span>
            </div>
        </footer>
    )
}