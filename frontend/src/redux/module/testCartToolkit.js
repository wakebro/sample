import { createSlice } from "@reduxjs/toolkit"

const initialState = { 
	lists: [{id: 1, productName: 'nacho', price: 2000 }]
}

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addProduct: (state, action) => {
			state.lists.push(action.payload)
		},
		deleteProduct: (state, action) => {
			state.lists = state.lists.filter((todo) => todo.id !== action.payload)
		}
	}
})

// export const { increase, decrease } = counterSlice.actions
export const { addProduct, deleteProduct } = cartSlice.actions
export default cartSlice.reducer