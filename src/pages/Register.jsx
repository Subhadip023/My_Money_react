import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setLoading } from '../redux/uiSlice'
import { setUser } from '../redux/authSlice'
import { cn } from '../utils'
import authService from '../appwrite/auth'
import toast from 'react-hot-toast'

function Register() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const dispatch = useDispatch()
    const password = watch("password")

    const onSubmit = async (data) => {
        dispatch(setLoading(true))
        try {
            try {
                const currentUser = await authService.getCurrentUser()
                if (currentUser) {
                    dispatch(setUser(currentUser))
                    toast.success(`Active session: ${currentUser.name}`)
                    return
                }
            } catch (err) { }

            const user = await authService.createAccount(data)
            if (user) {
                const session = await authService.login(data)
                if (session) {
                    const userData = await authService.getCurrentUser()
                    dispatch(setUser(userData))
                    toast.success("Account created successfully!")
                }
            }
        } catch (error) {
            console.error("Registration Error:", error)
            toast.error(error.message || "Registration failed.")
        } finally {
            dispatch(setLoading(false))
        }
    }

    return (
        <div className="w-full">
            <div className="mb-0 text-center md:text-left">
                <h2 className="text-3xl font-black tracking-tighter mb-1">Join MyMoney</h2>
                <p className="text-neutral-500 dark:text-neutral-400 font-medium text-sm mb-8">Start your financial freedom journey.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest mb-1.5 ml-1 text-neutral-500">
                            Full Name
                        </label>
                        <input
                            type="text"
                            {...register("name", { required: "Required" })}
                            className={cn(
                                "w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border-2 transition-all outline-none",
                                errors.name ? "border-rose-500/50" : "border-transparent focus:border-indigo-500"
                            )}
                            placeholder="John Doe"
                        />
                        {errors.name && <p className="mt-1 ml-1 text-[10px] font-bold text-rose-500 uppercase">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest mb-1.5 ml-1 text-neutral-500">
                            Email
                        </label>
                        <input
                            type="email"
                            {...register("email", {
                                required: "Required",
                                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                            })}
                            className={cn(
                                "w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border-2 transition-all outline-none",
                                errors.email ? "border-rose-500/50" : "border-transparent focus:border-indigo-500"
                            )}
                            placeholder="john@example.com"
                        />
                        {errors.email && <p className="mt-1 ml-1 text-[10px] font-bold text-rose-500 uppercase">{errors.email.message}</p>}
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest mb-1.5 ml-1 text-neutral-500">
                            Password
                        </label>
                        <input
                            type="password"
                            {...register("password", {
                                required: "Required",
                                minLength: { value: 6, message: "Min 6" }
                            })}
                            className={cn(
                                "w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border-2 transition-all outline-none",
                                errors.password ? "border-rose-500/50" : "border-transparent focus:border-indigo-500"
                            )}
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="mt-1 ml-1 text-[10px] font-bold text-rose-500 uppercase">{errors.password.message}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest mb-1.5 ml-1 text-neutral-500">
                            Confirm
                        </label>
                        <input
                            type="password"
                            {...register("confirmPassword", {
                                required: "Required",
                                validate: value => value === password || "Mismatch"
                            })}
                            className={cn(
                                "w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border-2 transition-all outline-none",
                                errors.confirmPassword ? "border-rose-500/50" : "border-transparent focus:border-indigo-500"
                            )}
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && <p className="mt-1 ml-1 text-[10px] font-bold text-rose-500 uppercase">{errors.confirmPassword.message}</p>}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20 mt-4"
                >
                    Create Account
                </button>
            </form>

            <div className="mt-8 text-center pt-8 border-t border-neutral-100 dark:border-neutral-800">
                <p className="text-neutral-500 dark:text-neutral-400 font-medium text-sm">
                    Already registered?{' '}
                    <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-black hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register;