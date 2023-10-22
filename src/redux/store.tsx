import {configureStore} from '@reduxjs/toolkit'
import notesSlice from './slices/notesSlice'

export const store = configureStore({
	reducer: {
		notes: notesSlice
	}
	// devTools: process.env.NODE_ENV !== 'production'
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
