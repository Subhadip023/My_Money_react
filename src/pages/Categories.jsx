import React, { useState, useEffect } from 'react'
import AddCategoryModal from '../components/ui/AddCategoryModal'
import EditCategoryModal from '../components/ui/EditCategoryModal'
import { cn } from '../utils'
import categoryService from '../appwrite/category'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

export default function Categories() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [categories, setCategories] = useState([])
    const user = useSelector((state) => state.auth.user)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryService.getCategories({ userId: user.$id })
                setCategories(res.documents)
            } catch (error) {
                console.log(error)
                toast.error('Failed to fetch categories')
            }
        }
        if (user) fetchCategories()
    }, [user])

    const handleAddCategory = (newCategory) => {
        setCategories((prev) => [...prev, newCategory])
        toast.success('Category added successfully')
    }

    const handleEdit = (category) => {
        setSelectedCategory(category)
        setIsEditModalOpen(true)
    }

    const handleUpdateCategory = (updatedCategory) => {
        setCategories((prev) => prev.map((cat) =>
            cat.$id === updatedCategory.$id ? updatedCategory : cat
        ))
    }

    const handleDelete = async (id) => {
        const ok = window.confirm("Are you sure you want to delete this category? This might affect transactions using this category.");
        if (!ok) return;

        const success = await categoryService.deleteCategory(id);
        if (success) {
            setCategories(categories.filter(c => c.$id !== id));
            toast.success("Category deleted");
        } else {
            toast.error("Failed to delete category");
        }
    }

    return (
        <div className='w-full space-y-10'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
                <div className="space-y-2">
                    <h1 className='text-4xl font-black tracking-tight'>Categories</h1>
                    <p className='text-neutral-500 dark:text-neutral-400 font-medium'>
                        Manage transaction categories to organize your finances.
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className='px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg transition-all active:scale-95 shadow-xl shadow-indigo-600/20 flex items-center gap-2 cursor-pointer'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Category
                </button>
            </div>

            <div className="overflow-hidden rounded-3xl border border-neutral-100 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/30 backdrop-blur-sm shadow-sm">
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className='bg-neutral-50/50 dark:bg-neutral-800/50'>
                            <th className='px-8 py-5 text-sm font-bold uppercase tracking-widest text-neutral-400'>Category Name</th>
                            <th className='px-8 py-5 text-sm font-bold uppercase tracking-widest text-neutral-400'>Type</th>
                            <th className='px-8 py-5 text-sm font-bold uppercase tracking-widest text-neutral-400 text-right'>Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
                        {categories.map((category) => (
                            <tr key={category.$id} className='hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group'>
                                <td className='px-8 py-6'>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black">
                                            {category?.name?.slice(0, 2).toUpperCase() || 'NA'}
                                        </div>
                                        <span className="font-bold text-neutral-900 dark:text-white">{category.name}</span>
                                    </div>
                                </td>
                                <td className='px-8 py-6'>
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                                        category.type === 'income'
                                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                            : "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                                    )}>
                                        {category.type}
                                    </span>
                                </td>
                                <td className='px-8 py-6 text-right'>
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="px-4 py-2 rounded-xl border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white font-bold text-sm transition-all cursor-pointer"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.$id)}
                                            className="px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white font-bold text-sm transition-all cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {categories.length === 0 && (
                    <div className="p-20 text-center text-neutral-500 font-medium">
                        No categories found. Add your first category to get started.
                    </div>
                )}
            </div>

            <AddCategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCategoryAdded={handleAddCategory}
            />

            <EditCategoryModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                category={selectedCategory}
                onCategoryUpdated={handleUpdateCategory}
            />
        </div>
    )
}

