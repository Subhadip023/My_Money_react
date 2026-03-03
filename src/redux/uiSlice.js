import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLoading: false,
}

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
    },
})

export const { setLoading } = uiSlice.actions

export default uiSlice.reducer
