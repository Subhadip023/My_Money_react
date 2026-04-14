import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Button from '../components/shared/Button'
import FloatingCard from '../components/ui/FlotingCard'
import loanService from '../appwrite/loans'
import LoanModal from '../components/ui/LoanModal'
import LoanPaymentModal from '../components/ui/LoanPaymentModal'
import LoanAddAmountModal from '../components/ui/LoanAddAmountModal'
import LoanSettleModal from '../components/ui/LoanSettleModal'
import toast from 'react-hot-toast'

export default function Loans() {
    const [loans, setLoans] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
    const [isAddAmountModalOpen, setIsAddAmountModalOpen] = useState(false)
    const [isSettleModalOpen, setIsSettleModalOpen] = useState(false)
    const [selectedLoan, setSelectedLoan] = useState(null)
    const user = useSelector((state) => state.auth.user)

    const fetchLoans = async () => {
        if (!user) return
        try {
            const res = await loanService.getUserLoans(user.$id)
            setLoans(res.documents)
        } catch (error) {
            toast.error('Failed to fetch loans')
        }
    }

    useEffect(() => {
        fetchLoans()
    }, [user])

    const totalPrincipal = loans.reduce((sum, loan) => sum + Number(loan.principalAmount), 0)
    const totalOutstanding = loans.reduce((sum, loan) => sum + Number(loan.outstandingAmount), 0)
    const activeLoans = loans.filter(loan => loan.status === 'active' || loan.status === 'Active').length

    const handleLoanSaved = () => {
        fetchLoans()
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this loan record?")) return
        const success = await loanService.deleteLoan(id)
        if (success) {
            setLoans(loans.filter(loan => loan.$id !== id))
            toast.success('Loan deleted successfully')
        } else {
            toast.error('Failed to delete loan')
        }
    }

    const handleEdit = (loan) => {
        setSelectedLoan(loan)
        setIsModalOpen(true)
    }

    const handlePayment = (loan) => {
        setSelectedLoan(loan)
        setIsPaymentModalOpen(true)
    }

    const handleAddAmount = (loan) => {
        setSelectedLoan(loan)
        setIsAddAmountModalOpen(true)
    }

    const handleSettle = (loan) => {
        setSelectedLoan(loan)
        setIsSettleModalOpen(true)
    }

    const getTypeColor = (type) => {
        switch(type) {
            case 'home': return 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
            case 'personal': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
            case 'education': return 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
            case 'car': return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'
            case 'business': return 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
            default: return 'bg-neutral-100 text-neutral-600 dark:bg-neutral-500/20 dark:text-neutral-400'
        }
    }

    const getStatusStyle = (status) => {
        switch(status.toLowerCase()) {
            case 'active': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20'
            case 'settled': return 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20'
            case 'defaulted': return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20'
            default: return 'bg-neutral-50 text-neutral-600 dark:bg-neutral-500/10'
        }
    }

    return (
        <div className='w-full space-y-10'>
            <header className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
                <div className="space-y-2">
                    <h1 className='text-4xl font-black tracking-tight'>Loans & Mortgages</h1>
                    <p className='text-neutral-500 dark:text-neutral-400 font-medium'>
                        Manage your active liabilities and track repayment progress.
                    </p>
                </div>
                <div className='flex gap-3'>
                    <Button
                        onClick={() => {
                            setSelectedLoan(null)
                            setIsModalOpen(true)
                        }}
                        icon={() => (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        )}
                    >
                        New Loan
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Principal', value: `₹${totalPrincipal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: '📄', color: 'bg-indigo-500' },
                    { label: 'Outstanding Balance', value: `₹${totalOutstanding.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: '📉', color: 'bg-rose-500' },
                    { label: 'Active Loans', value: activeLoans.toString(), icon: '🗓️', color: 'bg-emerald-500' },
                ].map((stat, i) => (
                    <FloatingCard key={i} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm overflow-hidden relative group">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-[0.03] rounded-bl-full transition-transform group-hover:scale-110`} />
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-sm font-bold uppercase tracking-widest text-neutral-400">{stat.label}</span>
                        </div>
                        <div className={`text-3xl font-black ${stat.label === 'Outstanding Balance' ? 'text-rose-500' : ''}`}>{stat.value}</div>
                    </FloatingCard>
                ))}
            </div>

            <div className="overflow-x-auto rounded-3xl border border-neutral-100 dark:border-neutral-700/50 bg-white dark:bg-neutral-800 backdrop-blur-sm shadow-sm ring-1 ring-black/5 dark:ring-white/5">
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className='bg-neutral-50/50 dark:bg-neutral-800/50 border-b border-neutral-100 dark:border-neutral-700'>
                            <th className='px-8 py-5 text-xs font-black uppercase tracking-widest text-neutral-400'>Loan Details</th>
                            <th className='px-8 py-5 text-xs font-black uppercase tracking-widest text-neutral-400 text-right'>Principal</th>
                            <th className='px-8 py-5 text-xs font-black uppercase tracking-widest text-neutral-400 text-right'>Outstanding</th>
                            <th className='px-8 py-5 text-xs font-black uppercase tracking-widest text-neutral-400 text-right'>Interest / Due</th>
                            <th className='px-8 py-5 text-xs font-black uppercase tracking-widest text-neutral-400 text-center'>Status</th>
                            <th className='px-8 py-5 text-xs font-black uppercase tracking-widest text-neutral-400 text-right'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
                        {loans.map((loan) => {
                            const repaymentPercent = loan.principalAmount > 0 
                                ? (((loan.principalAmount - loan.outstandingAmount) / loan.principalAmount) * 100).toFixed(0) 
                                : 0;
                            return (
                                <tr key={loan.$id} className='hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group'>
                                    <td className='px-8 py-6'>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${getTypeColor(loan.loanType)}`}>
                                                {loan.loanType.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <Link to={`/loans/${loan.$id}`} className="font-bold text-neutral-900 dark:text-white uppercase tracking-tight hover:text-indigo-600 transition-colors cursor-pointer">{loan.loanName}</Link>
                                                <div className="text-xs font-medium text-neutral-500 uppercase tracking-widest">{loan.loanType}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-8 py-6 text-right font-bold text-neutral-600 dark:text-neutral-300 tabular-nums'>
                                        ₹{loan.principalAmount.toLocaleString('en-IN')}
                                    </td>
                                    <td className='px-8 py-6 text-right'>
                                        <div className="flex flex-col items-end">
                                            <span className="font-black text-rose-500 tabular-nums">
                                                ₹{loan.outstandingAmount.toLocaleString('en-IN')}
                                            </span>
                                            <div className="w-16 h-1 mt-1 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-emerald-500 rounded-full" 
                                                    style={{ width: `${repaymentPercent}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-black text-emerald-500 mt-0.5">{repaymentPercent}% Paid</span>
                                        </div>
                                    </td>
                                    <td className='px-8 py-6 text-right'>
                                        <div className="flex flex-col items-end">
                                            <span className="font-bold text-neutral-900 dark:text-white">{loan.interestRate || '0'}%</span>
                                            <span className="text-xs text-neutral-500 font-medium">Due: {new Date(loan.dueDate).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className='px-8 py-6 text-center'>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(loan.status)}`}>
                                            {loan.status}
                                        </span>
                                    </td>
                                    <td className='px-8 py-6 text-right'>
                                        <div className="flex gap-2 justify-end transition-opacity">
                                            <Button variant="ghost" size="sm" as={Link} to={`/loans/${loan.$id}`}>View</Button>
                                            {Number(loan.outstandingAmount) > 0 && (
                                              <Button variant="emerald" size="sm" onClick={() => handlePayment(loan)}>Pay</Button>
                                            )}
                                            <Button variant="indigo" size="sm" onClick={() => handleAddAmount(loan)}>Add</Button>
                                            {Number(loan.outstandingAmount) > 0 && (
                                              <Button variant="emerald" size="sm" onClick={() => handleSettle(loan)}>Settle</Button>
                                            )}
                                            <Button variant="secondary" size="sm" onClick={() => handleEdit(loan)}>Edit</Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(loan.$id)}>Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        {loans.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-8 py-16 text-center">
                                    <div className="max-w-xs mx-auto space-y-3">
                                        <div className="text-4xl opacity-20">🏦</div>
                                        <p className="text-neutral-500 font-bold">No loans added yet. Tracking your liabilities is the first step to debt-free living.</p>
                                        <Button size="sm" onClick={() => setIsModalOpen(true)}>Add Your First Loan</Button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <LoanModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedLoan(null)
                }}
                loan={selectedLoan}
                onLoanSaved={handleLoanSaved}
            />

            <LoanPaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => {
                    setIsPaymentModalOpen(false)
                    setSelectedLoan(null)
                }}
                loan={selectedLoan}
                onPaymentSaved={handleLoanSaved}
            />

            <LoanAddAmountModal
                isOpen={isAddAmountModalOpen}
                onClose={() => {
                    setIsAddAmountModalOpen(false)
                    setSelectedLoan(null)
                }}
                loan={selectedLoan}
                onAmountAdded={handleLoanSaved}
            />

            <LoanSettleModal
                isOpen={isSettleModalOpen}
                onClose={() => {
                    setIsSettleModalOpen(false)
                    setSelectedLoan(null)
                }}
                loan={selectedLoan}
                onSettled={handleLoanSaved}
            />
        </div>
    )
}
