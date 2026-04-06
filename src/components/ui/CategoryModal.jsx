import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../../redux/uiSlice'
import toast from 'react-hot-toast'
import Modal from './Modal'
import { cn } from '../../utils'
import categoryService from '../../appwrite/category'

const CategoryModal = ({ isOpen, onClose, category, onCategorySaved }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const loading = useSelector((state) => state.ui.loading)
    const isEdit = !!category

    useEffect(() => {
        if (isOpen) {
            if (category) {
                reset({
                    name: category.name,
                    type: category.type
                })
            } else {
                reset({
                    name: '',
                    type: 'expense'
                })
            }
        }
    }, [category, reset, isOpen])

    const onSubmit = async (data) => {
        if (loading) return
        dispatch(setLoading(true))
        try {
            let res
            if (isEdit) {
                res = await categoryService.updateCategory(category.$id, {
                    name: data.name,
                    type: data.type
                })
                toast.success("Category updated successfully")
            } else {
                res = await categoryService.createCategory({
                    name: data.name,
                    type: data.type,
                    userId: user.$id
                })
                toast.success("Category added successfully")
            }
            
            if (res) {
                onCategorySaved(res)
                onClose()
            }
        } catch (error) {
            toast.error(error.message || `Failed to ${isEdit ? 'update' : 'add'} category.`)
        } finally {
            dispatch(setLoading(false))
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Category" : "Add New Category"}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold mb-2 ml-1 text-neutral-700 dark:text-neutral-300 " >
                        Category Name
                    </label>
                    <input
                        {...register("name", { required: "Name is required" })}
                        className={cn(
                            "w-full px-5 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border-2 transition-all outline-none dark:text-white",
                            errors.name
                                ? "border-rose-500/50 focus:border-rose-500"
                                : "border-neutral-100 dark:border-neutral-700 focus:border-indigo-500"
                        )}
                        placeholder="e.g., Food, Travel..."
                    />
                    {errors.name && (
                        <p className="mt-2 ml-1 text-xs font-bold text-rose-500 uppercase tracking-wider">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2 ml-1 text-neutral-700 dark:text-neutral-300">
                        Category Type
                    </label>
                    <select
                        {...register("type", { required: "Type is required" })}
                        className={cn(
                            "w-full px-5 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border-2 transition-all outline-none dark:text-white",
                            errors.type
                                ? "border-rose-500/50 focus:border-rose-500"
                                : "border-neutral-100 dark:border-neutral-700 focus:border-indigo-500"
                        )}
                    >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                    {errors.type && (
                        <p className="mt-2 ml-1 text-xs font-bold text-rose-500 uppercase tracking-wider">
                            {errors.type.message}
                        </p>
                    )}
                </div>

                <div className="pt-4 flex gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold transition-all hover:bg-neutral-200 dark:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                            "flex-1 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg transition-all active:scale-[0.98] shadow-xl shadow-indigo-600/20",
                            loading && "opacity-50 cursor-not-allowed "
                        )}
                    >
                        {loading ? 'Processing...' : (isEdit ? 'Save Changes' : 'Create Category')}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default CategoryModal
