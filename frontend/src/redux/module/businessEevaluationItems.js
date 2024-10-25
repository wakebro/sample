import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	id: null,
	pageType: '',
	submitResult: false,
	dataList : [],
	detailBackUp: null,
	isOpen: false,
	modalPageType: ''
}

const businessEevaluationItems = createSlice({
	name: 'businessEevaluationItems',
	initialState,
	reducers: {
		setId: (state, action) => ({
			...state,
			['id']: action.payload
		}),
		setPageType: (state, action) => ({
			...state,
			['pageType']: action.payload
		}),
		setSubmitResult: (state, action) => ({
			...state,
			['submitResult']: action.payload
		}),
		setDataList: (state, action) => ({
			...state,
			['dataList']: action.payload
		}),
		setDetailBackUp: (state, action) => ({
			...state,
			['detailBackUp']: action.payload
		}),
		setIsOpen: (state, action) => ({
			...state,
			['isOpen']: action.payload
		}),
		setModalPageType: (state, action) => ({
			...state,
			['modalPageType']: action.payload
		})
	}
})

export const { setId, setPageType, setSubmitResult, setDataList, setDetailBackUp, setIsOpen, setModalPageType } = businessEevaluationItems.actions
export default businessEevaluationItems.reducer