import React from 'react'
import { cn } from '../../utils'

const Button = ({
    children,
    onClick,
    type = "button",
    variant = "primary", // primary, secondary, outline, ghost, danger
    size = "md", // sm, md, lg
    className,
    disabled,
    loading = false,
    icon: Icon,
    as: Component = "button",
    ...props
}) => {
    const variants = {
        primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20",
        secondary: "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700",
        outline: "bg-transparent border-2 border-neutral-100 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800",
        ghost: "bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-500",
        danger: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-500/20",
        violet: "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-600/20",
        emerald: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
    }

    const sizes = {
        sm: "px-4 py-2 text-xs rounded-xl",
        md: "px-6 py-4 text-sm rounded-2xl",
        lg: "px-8 py-5 text-lg rounded-2xl"
    }

    return (
        <Component
            type={Component === 'button' ? type : undefined}
            onClick={onClick}
            disabled={disabled || loading}
            className={cn(
                "font-black tracking-tight transition-all active:scale-[0.98] flex items-center justify-center gap-2",
                variants[variant],
                sizes[size],
                (disabled || loading) && "opacity-50 cursor-not-allowed",
                className
            )}
            {...props}
        >
            {loading ? (
                <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing...</span>
                </div>
            ) : (
                <>
                    {Icon && <Icon className="w-5 h-5" />}
                    {children}
                </>
            )}
        </Component>
    )
}

export default Button
