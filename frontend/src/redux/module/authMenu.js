import { createSlice } from "@reduxjs/toolkit"

const initialState = { 
	progress: false,
	authMenuTabList: [],
	list: []
}

const authMenuSlice = createSlice({
	name: 'authMenu',
	initialState,
	reducers: {
		changeList: (state, action) => ({
			...state,
			['list']:action.payload
		}),
		changeAuthMenuTabListList: (state, action) => ({
			...state,
			['authMenuTabList']:action.payload
		}),
		changeProgress: (state, action) => ({
			...state,
			['progress']: action.payload
		})
	}
})

export const { changeList, changeAuthMenuTabListList, changeProgress } = authMenuSlice.actions

export default authMenuSlice.reducer
