import { createSlice } from "@reduxjs/toolkit"

const initialState = { 
	menuList: [],
	property: undefined,
	isManager: false
}

const loginAuth = createSlice({
	name: 'loginAuth',
	initialState,
	reducers: {
		setMenuList: (state, action) => ({
			...state,
			['menuList']:action.payload
		}),
		setProperty: (state, action) => ({
			...state,
			['property']:action.payload
		}),
		setIsManager: (state, action) => ({
			...state,
			['isManager']: action.payload
		})
	}
})

export const { setMenuList, setProperty, setIsManager } = loginAuth.actions

export default loginAuth.reducer
