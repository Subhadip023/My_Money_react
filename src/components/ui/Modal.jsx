import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../utils'
import Button from '../shared/Button'

const Modal = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all duration-500">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-neutral-900/60 dark:bg-black/80 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={cn(
                "relative w-full max-w-lg max-h-[90vh] flex flex-col bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden",
                "border border-neutral-100 dark:border-neutral-800 transition-all transform scale-100 animate-in fade-in zoom-in slide-in-from-bottom-8 duration-500 ease-out"
            )}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-100 dark:border-neutral-700 flex-shrink-0">
                    <h3 className="text-xl font-black tracking-tight text-neutral-900 dark:text-white">
                        {title}
                    </h3>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="p-2 sm:px-2 sm:py-2 px-2 py-2 text-neutral-500 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Button>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-6 md:p-8 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    )
}

export default Modal
