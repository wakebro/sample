/* eslint-disable */
import { Fragment } from "react"
import Step3Item from "../Step3Item"

const Step3 = (props) => {
	const { 
		type, control, watch, setValue, 
		selectList, managerList, getValues,
		clickDeleteButton, clickAddButton, itemList
	} = props

	return (
		<>
			{
				itemList && Array.isArray(itemList) && itemList.map((value, idx) => {
					return (
						<Fragment key={value}>
							<Step3Item
								idx = {idx}
								indexValue={value}
								itemList={itemList}
								type = {type}
								control = {control}
								selectList = {selectList}
								managerList = {managerList}
								watch = {watch}
								setValue = {setValue}
								getValues = {getValues}
								clickDeleteButton={() => {clickDeleteButton(idx)}}
								clickAddButton={() => {clickAddButton(idx)}}
							/>
						</Fragment>
					)
				})
			}
		</>
	)
}

export { Step3 }
