import React from 'react'
import { cn } from '../../utils'

const FormField = ({
    label,
    error,
    children,
    className,
    labelClassName
}) => {
    return (
        <div className={cn("space-y-2 w-full", className)}>
            {label && (
                <label className={cn(
                    "block text-xs font-black uppercase tracking-widest ml-1 text-neutral-500",
                    labelClassName
                )}>
                    {label}
                </label>
            )}
            <div className="relative">
                {children}
            </div>
            {error && (
                <p className="mt-1 ml-1 text-[10px] font-bold text-rose-500 uppercase">
                    {error}
                </p>
            )}
        </div>
    )
}

export const Input = ({
    register,
    name,
    rules,
    error,
    label,
    type = "text",
    placeholder,
    prefix,
    className,
    ...props
}) => {
    return (
        <FormField label={label} error={error} className={className}>
            {prefix && (
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold pointer-events-none">
                    {prefix}
                </span>
            )}
            <input
                type={type}
                {...(register ? register(name, rules) : {})}
                placeholder={placeholder}
                className={cn(
                    "w-full px-5 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-2 transition-all outline-none text-neutral-900 dark:text-white",
                    prefix ? "pl-10" : "px-5",
                    error
                        ? "border-rose-500/50 focus:border-rose-500"
                        : "border-transparent focus:border-indigo-500 dark:border-neutral-800",
                    className
                )}
                {...props}
            />
        </FormField>
    )
}

export const Select = ({
    register,
    name,
    rules,
    error,
    label,
    options = [],
    placeholder,
    className,
    ...props
}) => {
    return (
        <FormField label={label} error={error} className={className}>
            <select
                {...(register ? register(name, rules) : {})}
                className={cn(
                    "w-full px-5 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-2 transition-all outline-none appearance-none text-neutral-900 dark:text-white",
                    error
                        ? "border-rose-500/50 focus:border-rose-500"
                        : "border-transparent focus:border-indigo-500 dark:border-neutral-800",
                    className
                )}
                {...props}
            >
                <option value="">{placeholder || 'Select option'}</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-neutral-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </div>
        </FormField>
    )
}

export default FormField
