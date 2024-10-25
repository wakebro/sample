import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	dataTableList: [],
	isOpen: false,
	mainClassList: [],
	midClassList: [],
	mainClass: '',
	midClass: '',
	subClass: '',
	pageType: 'register',
	code: null,
	name: ''
}

const basicPnrClass = createSlice({
	name: 'basicPnrClass',
	initialState,
	reducers: {
		setDataTableList: (state, action) => ({
			...state,
			['dataTableList']: action.payload
		}),
		setPageType: (state, action) => ({
			...state,
			['pageType']: action.payload
		}),
		setCode: (state, action) => ({
			...state,
			['code']: action.payload
		}),
		setName: (state, action) => ({
			...state,
			['name']: action.payload
		}),
		setIsOpen: (state, action) => ({
			...state,
			['isOpen']: action.payload
		}),
		setMainClassList: (state, action) => ({
			...state,
			['mainClassList']: action.payload
		}),
		setMidClassList: (state, action) => ({
			...state,
			['midClassList']: action.payload
		}),
		setMainClass: (state, action) => ({
			...state,
			['mainClass']: action.payload
		}),
		setMidClass: (state, action) => ({
			...state,
			['midClass']: action.payload
		}),
		setSubClass: (state, action) => ({
			...state,
			['subClass']: action.payload
		})
	}
})

export const { setDataTableList, setPageType, setCode, setName, setIsOpen, setMainClassList, setMidClassList, setMainClass, setMidClass, setSubClass } = basicPnrClass.actions
export default basicPnrClass.reducer