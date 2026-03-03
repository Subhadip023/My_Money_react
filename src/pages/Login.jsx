import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setLoading } from '../redux/uiSlice'
import { setUser } from '../redux/authSlice'
import { cn } from '../utils'
import authService from '../appwrite/auth'
import toast from 'react-hot-toast'

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const dispatch = useDispatch()

    const onSubmit = async (data) => {
        dispatch(setLoading(true))
        try {
            try {
                const currentUser = await authService.getCurrentUser()
                if (currentUser) {
                    dispatch(setUser(currentUser))
                    toast.success(`Session active. Welcome back, ${currentUser.name}!`)
                    return
                }
            } catch (err) { }

            const session = await authService.login(data)
            if (session) {
                const user = await authService.getCurrentUser()
                dispatch(setUser(user))
                toast.success(`Welcome back, ${user.name}!`)
            }
        } catch (error) {
            console.error("Login Error:", error)
            if (error.code === 401) {
                toast.error("Invalid credentials. Please try again.")
            } else {
                toast.error(error.message || "An unexpected error occurred.")
            }
        } finally {
            dispatch(setLoading(false))
        }
    }

    return (
        <div className="w-full">
            <div className="mb-8 text-center md:text-left">
                <h2 className="text-3xl font-black tracking-tighter mb-2">Welcome Back</h2>
                <p className="text-neutral-500 dark:text-neutral-400 font-medium text-sm">Sign in to your financial command center.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <label className="block text-xs font-black uppercase tracking-widest mb-2 ml-1 text-neutral-500">
                        Email Address
                    </label>
                    <input
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                        })}
                        className={cn(
                            "w-full px-5 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border-2 transition-all outline-none",
                            errors.email ? "border-rose-500/50" : "border-transparent focus:border-indigo-500"
                        )}
                        placeholder="name@example.com"
                    />
                    {errors.email && <p className="mt-1 ml-1 text-[10px] font-bold text-rose-500 uppercase">{errors.email.message}</p>}
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2 ml-1">
                        <label className="block text-xs font-black uppercase tracking-widest text-neutral-500">
                            Password
                        </label>
                        <Link to="#" className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline">
                            Forgot?
                        </Link>
                    </div>
                    <input
                        type="password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Min 6 characters" }
                        })}
                        className={cn(
                            "w-full px-5 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border-2 transition-all outline-none",
                            errors.password ? "border-rose-500/50" : "border-transparent focus:border-indigo-500"
                        )}
                        placeholder="••••••••"
                    />
                    {errors.password && <p className="mt-1 ml-1 text-[10px] font-bold text-rose-500 uppercase">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20 mt-4"
                >
                    Sign In
                </button>
            </form>

            <div className="mt-8 text-center pt-8 border-t border-neutral-100 dark:border-neutral-800">
                <p className="text-neutral-500 dark:text-neutral-400 font-medium text-sm">
                    New here?{' '}
                    <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-black hover:underline">
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login;