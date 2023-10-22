import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Note} from '../../models/note'

const initialState: Note[] = []

const notesSlice = createSlice({
	name: 'notes',
	initialState: initialState,
	reducers: {
		setNotes: (_state, action: PayloadAction<Note[]>) => {
			return [...initialState, ...action.payload]
		},
		addNote: (state, action: PayloadAction<Note>) => {
			state.push(action.payload)
		},
		updateNote: (state, action: PayloadAction<Note>) => {
			return state.map(note => {
				if (note.id === action.payload.id) {
					return action.payload
				} else {
					return note
				}
			})
		},
		removeNote: (state, action: PayloadAction<string>) => {
			return state.filter(item => item.id !== action.payload)
		},
		refreshNotes: (state, action: PayloadAction<string>) => {
			return state.map(note => {
				return note
			})
		},
		resetNotes: () => {
			return initialState
		}
	}
})

export const {
	setNotes,
	addNote,
	removeNote,
	updateNote,
	resetNotes,
	refreshNotes
} = notesSlice.actions

export default notesSlice.reducer
