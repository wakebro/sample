import { createSlice } from "@reduxjs/toolkit"

const initialState = { 
	pageType: '',
	title: '',
	detailRow: null,
	key: ''
}

const authGroupSlice = createSlice({
	name: 'authGroup',
	initialState,
	reducers: {
		changePageType: (state, action) => ({
			...state,
			['pageType']:action.payload
		}),
		changeTitle: (state, action) => ({
			...state,
			['title']: action.payload
		}),
		setDetailRow: (state, action) => ({
			...state,
			['detailRow']: action.payload
		}),
		setKey: (state, action) => ({
			...state,
			['key']: action.payload
		})
	}
})

export const { changePageType, changeTitle, setDetailRow, setKey } = authGroupSlice.actions

export default authGroupSlice.reducer