import React, { useState, useEffect } from 'react'
import CategoryModal from '../components/ui/CategoryModal'
import { cn } from '../utils'
import { categoryService } from '../services'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import Button from '../components/shared/Button'

export default function Categories() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [categories, setCategories] = useState([])
    const user = useSelector((state) => state.auth.user)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryService.getCategories({ userId: user.$id })
                setCategories(res.documents)
            } catch (error) {
                toast.error('Failed to fetch categories')
            }
        }
        if (user) fetchCategories()
    }, [user])

    const handleCategorySaved = (savedCategory) => {
        setCategories((prev) => {
            const exists = prev.find(c => c.$id === savedCategory.$id)
            if (exists) {
                return prev.map(c => c.$id === savedCategory.$id ? savedCategory : c)
            }
            return [...prev, savedCategory]
        })
    }

    const handleEdit = (category) => {
        setSelectedCategory(category)
        setIsModalOpen(true)
    }


    const handleDelete = async (id) => {
        if (!window.confirm("Delete this category? This might affect existing transactions.")) return
        const success = await categoryService.deleteCategory(id)
        if (success) {
            setCategories(categories.filter(c => c.$id !== id))
            toast.success("Category deleted")
        } else {
            toast.error("Failed to delete category")
        }
    }

    return (
        <div className='w-full space-y-10'>
            <header className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
                <div className="space-y-2">
                    <h1 className='text-4xl font-black tracking-tight'>Categories</h1>
                    <p className='text-neutral-500 dark:text-neutral-400 font-medium'>
                        Manage transaction categories to organize your finances.
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setSelectedCategory(null)
                        setIsModalOpen(true)
                    }}
                    icon={() => (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    )}
                >
                    Add Category
                </Button>
            </header>

            <div className="overflow-x-auto overflow-y-hidden rounded-3xl border border-neutral-100 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/30 backdrop-blur-sm shadow-sm ring-1 ring-black/5 dark:ring-white/5">
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className='bg-neutral-50/50 dark:bg-neutral-800/50'>
                            <th className='px-8 py-5 text-xs font-black uppercase tracking-widest text-neutral-400'>Category Name</th>
                            <th className='px-8 py-5 text-xs font-black uppercase tracking-widest text-neutral-400'>Type</th>
                            <th className='px-8 py-5 text-xs font-black uppercase tracking-widest text-neutral-400 text-right'>Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
                        {categories.map((category) => (
                            <tr key={category.$id} className='hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group'>
                                <td className='px-8 py-6'>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center font-black">
                                            {category?.name?.slice(0, 2).toUpperCase()}
                                        </div>
                                        <span className="font-bold text-neutral-900 dark:text-white capitalize">{category.name}</span>
                                    </div>
                                </td>
                                <td className='px-8 py-6'>
                                    <span className={cn(
                                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                        category.type === 'income'
                                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                            : "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                                    )}>
                                        {category.type}
                                    </span>
                                </td>
                                <td className='px-8 py-6 text-right'>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>Edit</Button>
                                        <Button variant="danger" size="sm" onClick={() => handleDelete(category.$id)}>Delete</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {categories.length === 0 && (
                    <div className="p-20 text-center text-neutral-500 font-medium">
                        No categories found. Start organizing your money!
                    </div>
                )}
            </div>

            <CategoryModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                category={selectedCategory} 
                onCategorySaved={handleCategorySaved} 
            />
        </div>
    )
}
