import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './themeSlice'
import authReducer from './authSlice'
import uiReducer from './uiSlice'

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        auth: authReducer,
        ui: uiReducer,
    },
})
