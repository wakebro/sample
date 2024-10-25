import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	count: 0
}

const counterSlice = createSlice({
	name: 'counter',
	initialState,
	reducers: {
		increase: (state, action) => ({
			...state,
			count: state.count + action.payload
		}),
		decrease: (state, action) => ({
			...state,
			count: state.count - action.payload
		})
	}
})

export const { increase, decrease } = counterSlice.actions

export default counterSlice.reducer