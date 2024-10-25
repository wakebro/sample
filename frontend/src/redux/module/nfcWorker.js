import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	id: null,
	detailBackUp: null,
	pageType: '',
	submitResult: false
}

const nfcWorker = createSlice({
	name: 'nfcWorker',
	initialState,
	reducers: {
		setId: (state, action) => ({
			...state,
			['id']: action.payload
		}),
		setDetailBackUp: (state, action) => ({
			...state,
			['detailBackUp']: action.payload
		}),
		setPageType: (state, action) => ({
			...state,
			['pageType']: action.payload
		}),
		setSubmitResult: (state, action) => ({
			...state,
			['submitResult']: action.payload
		})
	}
})

export const { 
	setId
	, setDetailBackUp
	, setPageType
	, setSubmitResult
} = nfcWorker.actions
export default nfcWorker.reducer