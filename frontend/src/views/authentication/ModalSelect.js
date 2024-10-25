import '@styles/react/libs/flatpickr/flatpickr.scss'
import "@styles/react/pages/page-authentication.scss"
import { Fragment } from 'react'
import { Controller } from 'react-hook-form'
import Select from 'react-select'
import { Label } from "reactstrap"


const BasicSelect = (props) => {
	const {yupControl, customId, customName, callback, customOption} = props
	if (yupControl === undefined) return
	return (
		<Fragment>
			<Label className="form-label mb-1" for={customId}>
				{customName}
			</Label>
			<Controller
				control={yupControl}
				id={customId}
				name={customId}
				render={({ field: { onChange, value } })  => <Select
						onChange={e => {
							onChange(e)
							if (callback !== undefined) {
								callback(e)
							}
						}}
						className="react-select"
						classNamePrefix={'select'}
						options={customOption}
						value={value}
						isClearable={false}
				/>}
			/>
		</Fragment>
	)
}

const CustomSelect = (props) => {
	const {yupControl, customId, customName, setCustomValue, customValue, customOption, customState, callback} = props
	if (yupControl === undefined) return
	return (
		<Fragment>
			<Label className='form-label mb-1' for={customId}>
				{customName}
			</Label>
			<Controller
				control={yupControl}
				id={customId}
				name={customId}
				render={() => <Select
						onChange={e => {
							setCustomValue(e)
							if (callback !== undefined) {
								callback(e)
							}
						}}
						className="react-select"
						classNamePrefix={'select'}
						options={customOption}
						value={customValue}
						isClearable={false}
						isDisabled = {customName !== '직종' ? !customState : false}
					/>}
			/>
		</Fragment>
	)
}
export {BasicSelect, CustomSelect}