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

function Register() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const dispatch = useDispatch()
    const isLoading = useSelector(state => state.ui.loading)
    const password = watch("password")

    const onSubmit = async (data) => {
        dispatch(setLoading(true))
        try {
            // Check for existing session
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
            <header className="mb-8 text-center md:text-left">
                <h2 className="text-3xl font-black tracking-tighter mb-1">Join MyMoney</h2>
                <p className="text-neutral-500 dark:text-neutral-400 font-medium text-sm">
                    Start your financial freedom journey today.
                </p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        name="name"
                        register={register}
                        rules={{ required: "Required" }}
                        error={errors.name?.message}
                    />
                    <Input
                        label="Email"
                        type="email"
                        placeholder="john@example.com"
                        name="email"
                        register={register}
                        rules={{
                            required: "Required",
                            pattern: { value: /^\S+@\S+$/i, message: "Invalid" }
                        }}
                        error={errors.email?.message}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        name="password"
                        register={register}
                        rules={{
                            required: "Required",
                            minLength: { value: 6, message: "Min 6" }
                        }}
                        error={errors.password?.message}
                    />
                    <Input
                        label="Confirm"
                        type="password"
                        placeholder="••••••••"
                        name="confirmPassword"
                        register={register}
                        rules={{
                            required: "Required",
                            validate: value => value === password || "Mismatch"
                        }}
                        error={errors.confirmPassword?.message}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full mt-4"
                    size="lg"
                    loading={isLoading}
                >
                    Create Account
                </Button>
            </form>

            <footer className="mt-8 text-center pt-8 border-t border-neutral-100 dark:border-neutral-800">
                <p className="text-neutral-500 dark:text-neutral-400 font-medium text-sm">
                    Already registered?{' '}
                    <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-black hover:underline transition-all">
                        Sign In
                    </Link>
                </p>
            </footer>
        </div>
    )
}

export default Register;