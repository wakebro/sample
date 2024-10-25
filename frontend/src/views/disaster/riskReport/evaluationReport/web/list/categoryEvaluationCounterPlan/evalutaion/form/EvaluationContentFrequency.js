/* eslint-disable */
import { Fragment } from "react"
import FrequencyItem from "../FrequencyItem"

const Frequency = (props) => {
	const { 
		type, control, watch, setValue,
		selectList, managerList, dangerSelectList, getValues,
		clickDeleteButton, clickAddButton, itemList
	} = props

	return (
		<>
			{
				itemList && Array.isArray(itemList) && itemList.map((value, idx) => {
					return (
						<Fragment key={value}>
							<FrequencyItem
								idx = {idx}
								indexValue={value}
								itemList={itemList}
								type = {type}
								control = {control}
								dangerSelectList = {dangerSelectList}
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

export { Frequency }

