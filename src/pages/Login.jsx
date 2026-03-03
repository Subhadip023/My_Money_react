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
            // Check if there's already an active session
            try {
                const currentUser = await authService.getCurrentUser()
                if (currentUser) {
                    dispatch(setUser(currentUser))
                    toast.success(`Session active. Welcome back, ${currentUser.name}!`)
                    return
                }
            } catch (err) {
                // No session active, safe to login
            }

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
            } else if (error.message?.includes("prohibited when a session is active")) {
                // If somehow it still happens, try to get user again
                const user = await authService.getCurrentUser()
                dispatch(setUser(user))
                toast.success("Welcome back!")
            } else {
                toast.error(error.message || "An unexpected error occurred.")
            }
        } finally {
            dispatch(setLoading(false))
        }
    }

    return (
        <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black tracking-tighter mb-2">Welcome Back</h2>
                <p className="text-neutral-500 dark:text-neutral-400">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold mb-2 ml-1 text-neutral-700 dark:text-neutral-300">
                        Email Address
                    </label>
                    <input
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                        })}
                        className={cn(
                            "w-full px-5 py-4 rounded-2xl bg-white dark:bg-neutral-800 border-2 transition-all outline-none",
                            errors.email
                                ? "border-rose-500/50 focus:border-rose-500"
                                : "border-neutral-100 dark:border-neutral-700 focus:border-indigo-500"
                        )}
                        placeholder="name@example.com"
                    />
                    {errors.email && (
                        <p className="mt-2 ml-1 text-xs font-bold text-rose-500 uppercase tracking-wider">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2 ml-1">
                        <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                            Password
                        </label>
                        <Link to="#" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                            Forgot Password?
                        </Link>
                    </div>
                    <input
                        type="password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Password must be at least 6 characters" }
                        })}
                        className={cn(
                            "w-full px-5 py-4 rounded-2xl bg-white dark:bg-neutral-800 border-2 transition-all outline-none",
                            errors.password
                                ? "border-rose-500/50 focus:border-rose-500"
                                : "border-neutral-100 dark:border-neutral-700 focus:border-indigo-500"
                        )}
                        placeholder="••••••••"
                    />
                    {errors.password && (
                        <p className="mt-2 ml-1 text-xs font-bold text-rose-500 uppercase tracking-wider">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg transition-all active:scale-[0.98] shadow-xl shadow-indigo-600/20 mt-4"
                >
                    Sign In
                </button>
            </form>

            <div className="mt-10 text-center">
                <p className="text-neutral-500 dark:text-neutral-400 font-medium">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-black hover:underline">
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login