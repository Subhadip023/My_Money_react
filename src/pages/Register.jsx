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
            // Check if there's already an active session
            try {
                const currentUser = await authService.getCurrentUser()
                if (currentUser) {
                    dispatch(setUser(currentUser))
                    toast.success(`You are already logged in as ${currentUser.name}!`)
                    return
                }
            } catch (err) {
                // No session active, safe to register
            }

            const user = await authService.createAccount(data)
            if (user) {
                const session = await authService.login(data)
                if (session) {
                    const userData = await authService.getCurrentUser()
                    dispatch(setUser(userData))
                    toast.success("Account created successfully! Welcome to MyMoney.")
                }
            }
        } catch (error) {
            console.error("Registration Error:", error)
            if (error.message?.includes("prohibited when a session is active")) {
                const userData = await authService.getCurrentUser()
                dispatch(setUser(userData))
                toast.success("You are now logged in.")
            } else {
                toast.error(error.message || "Something went wrong during registration.")
            }
        } finally {
            dispatch(setLoading(false))
        }
    }

    return (
        <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black tracking-tighter mb-2">Join MyMoney</h2>
                <p className="text-neutral-500 dark:text-neutral-400">Start your journey to financial freedom</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold mb-2 ml-1 text-neutral-700 dark:text-neutral-300">
                        Full Name
                    </label>
                    <input
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        className={cn(
                            "w-full px-5 py-4 rounded-2xl bg-white dark:bg-neutral-800 border-2 transition-all outline-none",
                            errors.name
                                ? "border-rose-500/50 focus:border-rose-500"
                                : "border-neutral-100 dark:border-neutral-700 focus:border-indigo-500"
                        )}
                        placeholder="John Doe"
                    />
                    {errors.name && (
                        <p className="mt-2 ml-1 text-xs font-bold text-rose-500 uppercase tracking-wider">
                            {errors.name.message}
                        </p>
                    )}
                </div>

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
                    <label className="block text-sm font-bold mb-2 ml-1 text-neutral-700 dark:text-neutral-300">
                        Password
                    </label>
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

                <div>
                    <label className="block text-sm font-bold mb-2 ml-1 text-neutral-700 dark:text-neutral-300">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        {...register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: value => value === password || "Passwords do not match"
                        })}
                        className={cn(
                            "w-full px-5 py-4 rounded-2xl bg-white dark:bg-neutral-800 border-2 transition-all outline-none",
                            errors.confirmPassword
                                ? "border-rose-500/50 focus:border-rose-500"
                                : "border-neutral-100 dark:border-neutral-700 focus:border-indigo-500"
                        )}
                        placeholder="••••••••"
                    />
                    {errors.confirmPassword && (
                        <p className="mt-2 ml-1 text-xs font-bold text-rose-500 uppercase tracking-wider">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg transition-all active:scale-[0.98] shadow-xl shadow-indigo-600/20 mt-4"
                >
                    Create Account
                </button>
            </form>

            <div className="mt-10 text-center">
                <p className="text-neutral-500 dark:text-neutral-400 font-medium">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-black hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register