import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/uiSlice'
import { setUser } from '../redux/authSlice'
import { authService } from '../services'
import toast from 'react-hot-toast'
import Button from '../components/shared/Button'
import { Input } from '../components/shared/FormField'

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const dispatch = useDispatch()
    const isLoading = useSelector(state => state.ui.loading)

    const onSubmit = async (data) => {
        dispatch(setLoading(true))
        try {
            // Check for existing session first (Single Responsibility in Service)
            try {
                const currentUser = await authService.getCurrentUser()
                if (currentUser) {
                    dispatch(setUser(currentUser))
                    toast.success(`Welcome back, ${currentUser.name}!`)
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
            const errorMsg = error.code === 401 ? "Invalid credentials." : (error.message || "An unexpected error occurred.")
            toast.error(errorMsg)
        } finally {
            dispatch(setLoading(false))
        }
    }

    return (
        <div className="w-full">
            <header className="mb-8 text-center md:text-left">
                <h2 className="text-3xl font-black tracking-tighter mb-2">Welcome Back</h2>
                <p className="text-neutral-500 dark:text-neutral-400 font-medium text-sm">
                    Sign in to your financial command center.
                </p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    name="email"
                    register={register}
                    rules={{
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                    }}
                    error={errors.email?.message}
                />

                <div className="relative">
                    <div className="absolute top-0 right-1 z-10">
                        <Link to="#" className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline">
                            Forgot?
                        </Link>
                    </div>
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        name="password"
                        register={register}
                        rules={{
                            required: "Password is required",
                            minLength: { value: 6, message: "Min 6 characters" }
                        }}
                        error={errors.password?.message}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full mt-4"
                    size="lg"
                    loading={isLoading}
                >
                    Sign In
                </Button>
            </form>

            <footer className="mt-8 text-center pt-8 border-t border-neutral-100 dark:border-neutral-800">
                <p className="text-neutral-500 dark:text-neutral-400 font-medium text-sm">
                    New here?{' '}
                    <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-black hover:underline transition-all">
                        Create Account
                    </Link>
                </p>
            </footer>
        </div>
    )
}

export default Login;