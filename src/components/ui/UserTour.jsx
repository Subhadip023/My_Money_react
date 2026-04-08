import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '../../utils';
import Button from '../shared/Button';

const STEPS = [
    {
        title: "Welcome to MyMoney! 👋",
        description: "Let's take a quick tour to help you manage your finances like a pro. It'll only take a minute!",
        target: null, // Center of screen
    },
    {
        title: "Financial Overview",
        description: "This is your command center. Keep track of your total balance, monthly income, and expenses right here.",
        target: "tour-dashboard-header",
    },
    {
        title: "Quick Wealth Addition",
        description: "Got a new transaction? Use this button to quickly record your income or expenses.",
        target: "tour-add-transaction",
    },
    {
        title: "Balance at a Glance",
        description: "Monitor your liquid assets across all accounts. We calculate this automatically for you.",
        target: "tour-balance-card",
    },
    {
        title: "Manage Your Accounts",
        description: "Head over here to add your bank accounts, wallets, or credit cards.",
        target: "tour-sidebar-accounts",
    },
    {
        title: "You're All Set! 🚀",
        description: "You're ready to master your money. Happy tracking!",
        target: null,
    }
];

export default function UserTour() {
    const [currentStep, setCurrentStep] = useState(-1);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
    const [isVisible, setIsVisible] = useState(false);

    const updateCoords = useCallback(() => {
        if (currentStep < 0 || currentStep >= STEPS.length) return;

        const step = STEPS[currentStep];
        if (!step.target) {
            setCoords({ top: window.innerHeight / 2, left: window.innerWidth / 2, width: 0, height: 0, isCenter: true });
            return;
        }

        const element = document.getElementById(step.target);
        if (element) {
            const rect = element.getBoundingClientRect();
            setCoords({ top: rect.top, left: rect.left, width: rect.width, height: rect.height, isCenter: false });
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // Fallback to center if element not found (e.g. sidebar closed)
            setCoords({ top: window.innerHeight / 2, left: window.innerWidth / 2, width: 0, height: 0, isCenter: true });
        }
    }, [currentStep]);

    useEffect(() => {
        // Start tour for first-time visitors
        const hasSeenTour = localStorage.getItem('hasSeenTour');
        if (!hasSeenTour) {
            const timer = setTimeout(() => {
                setCurrentStep(0);
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        updateCoords();
        const handleResize = () => updateCoords();
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleResize, true);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleResize, true);
        };
    }, [updateCoords]);

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handleSkip = () => handleComplete();

    const handleComplete = () => {
        setIsVisible(false);
        setCurrentStep(-1);
        localStorage.setItem('hasSeenTour', 'true');
    };

    if (!isVisible || currentStep === -1) return null;

    const step = STEPS[currentStep];
    const padding = 12;

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden select-none">
            {/* Backdrop with Hole */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-auto transition-all duration-300"
                style={{
                    clipPath: coords.isCenter
                        ? 'none'
                        : `polygon(
                            0% 0%, 
                            0% 100%, 
                            ${coords.left - padding}px 100%, 
                            ${coords.left - padding}px ${coords.top - padding}px, 
                            ${coords.left + coords.width + padding}px ${coords.top - padding}px, 
                            ${coords.left + coords.width + padding}px ${coords.top + coords.height + padding}px, 
                            ${coords.left - padding}px ${coords.top + coords.height + padding}px, 
                            ${coords.left - padding}px 100%, 
                            100% 100%, 
                            100% 0%
                        )`
                }}
            />

            {/* Tooltip */}
            <div
                className={cn(
                    "fixed pointer-events-auto transition-all duration-500 ease-in-out",
                    coords.isCenter
                        ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm"
                        : "w-[320px] max-w-[calc(100vw-32px)]"
                )}
                style={!coords.isCenter ? {
                    top: coords.top + coords.height + 32 > window.innerHeight - 150 ? "auto" : coords.top + coords.height + 24,
                    bottom: coords.top + coords.height + 32 > window.innerHeight - 150 ? window.innerHeight - (coords.top - 24) : "auto",
                    left: Math.min(Math.max(16, coords.left), window.innerWidth - 336)
                } : {}}
            >
                <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 shadow-2xl border border-neutral-100 dark:border-neutral-700 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />

                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-black uppercase tracking-widest text-indigo-500">
                            Step {currentStep + 1} of {STEPS.length}
                        </span>
                        <Button
                            variant="ghost"
                            onClick={handleSkip}
                            className="text-xs text-neutral-400 px-0 py-0 sm:px-0 sm:py-0 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-transparent"
                        >
                            Skip Tour
                        </Button>
                    </div>

                    <h3 className="text-xl font-black mb-2 text-neutral-900 dark:text-white">
                        {step.title}
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed mb-6 font-medium">
                        {step.description}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                            {STEPS.map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "h-1 rounded-full transition-all duration-300",
                                        i === currentStep ? "w-4 bg-indigo-500" : "w-1 bg-neutral-200 dark:bg-neutral-700"
                                    )}
                                />
                            ))}
                        </div>
                        <Button
                            onClick={handleNext}
                            className="px-6 py-2.5 sm:px-6 sm:py-2.5 text-sm"
                        >
                            {currentStep === STEPS.length - 1 ? "Finish" : "Next ✨"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
