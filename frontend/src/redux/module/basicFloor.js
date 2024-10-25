import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	building: null,
	buildings: [],
	dataTable: [],
	totalFloor: null,
	detailBackUp: null,
	pageType : 'detail',
	id: null,
	submitResult: false
}

const basicFloor = createSlice({
	name: 'basicFloor',
	initialState,
	reducers: {
		setSelectList: (state, action) => ({
			...state,
			['buildings']: action.payload
		}),
		setbuilding: (state, action) => ({
			...state,
			['building']: action.payload
		}),
		setDataTable: (state, action) => ({
			...state,
			['dataTable']: action.payload
		}),
		sumTotal: (state, action) => ({
			...state,
			['totalFloor']: action.payload
		}),
		setDetailBackUp: (state, action) => ({
			...state,
			['detailBackUp']: action.payload
		}),
		setPageType: (state, action) => ({
			...state,
			['pageType']: action.payload
		}),
		setId: (state, action) => ({
			...state,
			['id']: action.payload
		}),
		setSubmitResult: (state, action) => ({
			...state,
			['submitResult']: action.payload
		})
	}
})

export const { setSelectList, setbuilding, setDataTable, sumTotal, setDetailBackUp, setPageType, setId, setSubmitResult } = basicFloor.actions
export default basicFloor.reducer