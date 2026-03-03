export default function Footer() {
    return (
        <footer className="mt-12 py-8 text-center text-neutral-400 text-sm border-t border-neutral-100 dark:border-neutral-800 transition-colors bg-white dark:bg-neutral-900">
            <p>© {new Date().getFullYear()} MyMoney App. Built with Passion and React. Not for everyone only for financial literate people </p>
        </footer>
    )
}