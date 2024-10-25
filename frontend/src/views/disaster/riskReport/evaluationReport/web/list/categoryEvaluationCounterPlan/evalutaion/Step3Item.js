/* eslint-disable */
import { Controller } from "react-hook-form"
import { Button, Input } from "reactstrap"
import Select from 'react-select'
import { useEffect, useState } from "react"
import { NOMAL } from "../../../data"
import { setStringDate } from "../../../../../../../../utility/Utils"
import moment from "moment"
import Flatpickr from "react-flatpickr"
import { XCircle } from "react-feather"
import { Korean } from "flatpickr/dist/l10n/ko.js"
import { useDispatch } from 'react-redux'
import { setTabTempSaveCheck } from '@store/module/criticalDisaster'

const Step3Item = (props) => {
    const { 
        idx, indexValue, itemList, control, 
        selectList, managerList, watch, setValue,
        clickDeleteButton, clickAddButton
    } = props

	const dispatch = useDispatch()
    const [disabled, setDisabled] = useState(true)

    function handleDeleteClickButton() {
		clickDeleteButton()
	} // 삭제 버튼 end

	function handleAddClickButton() {
		clickAddButton()
	} // 추가 버튼 end

    useEffect(() => {
		setDisabled(!watch(`multiResult_${indexValue}`) || watch(`multiResult_${indexValue}`) < NOMAL)
	}, [
        watch(`multiResult_${indexValue}`)
    ])

    useEffect(() => {
        const tempFrequency = watch(`frequency_${indexValue}`)
		let numFre = tempFrequency
        if (typeof tempFrequency === 'object') {
            numFre = tempFrequency.value
        }
        if (typeof numFre !== 'number') {
            setValue(`multiResult_${indexValue}`, '')
            return
        }
        setValue(`multiResult_${indexValue}`, numFre)
    }, [
        watch(`frequency_${indexValue}`)
    ])

    return (
		<>
			<tr>
				<td className="risk-report select-p-x text-center">
                    { itemList.length > 1 &&
					    <XCircle style={{cursor:'pointer', color:'red'}} onClick={handleDeleteClickButton}/>
                    }
				</td>
				<td className="risk-report select-p-x">
					<Controller
						name={`inputResult_${indexValue}`}
						control={control}
						render={({ field: { onChange, value } })  => (
							<Input
								id={`inputResult_${indexValue}`}
								onChange={e => {
									onChange(e)
									dispatch(setTabTempSaveCheck(false))
								}}
								value={value}
								type='textarea' rows='1'
							/>
						)}
					/>
				</td>
				<td className="risk-report select-p-x">
					<Controller
						name={`nowAction_${indexValue}`}
						control={control}
						render={({ field: { onChange, value } }) => <Input type='textarea' rows='1'
							onChange={e => {
								onChange(e)
								dispatch(setTabTempSaveCheck(false))
							}}
							value={value}
						/>}
					/>
				</td>
				<td className="risk-report select-p-x">
					<Controller
						name={`frequency_${indexValue}`}
						control={control}
						render={({ field: { onChange, value } })  => (
							<Select
								name={`frequency_${indexValue}`}
								classNamePrefix='select'
								className={`react-select custom-react-select`}
								options={selectList}
								value={value}
								onChange={(e) => {
									setValue(`multiResult_${indexValue}`, e.value)
									onChange(e)
									dispatch(setTabTempSaveCheck(false))
								}}
								placeholder={<span className="custom-placeholder">{'선택'}</span>}
								menuPortalTarget={document.body} 
								styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
							/>
						)}
					/>
				</td>
				<td className="risk-report select-p-x">
					<Controller
						name={`inputReason_${indexValue}`}
						control={control}
						render={({ field: { onChange, value } }) => <Input type='textarea' rows='1'
							onChange={e => {
								onChange(e)
								dispatch(setTabTempSaveCheck(false))
							}}
							value={value}
						/>}
					/>
				</td>
				<td className="risk-report select-p-x">
					<Controller
						name={`counterplan_${indexValue}`}
						control={control}
						render={({ field: { onChange, value } }) => <Input type='textarea' rows='1'
							onChange={e => {
								onChange(e)
								dispatch(setTabTempSaveCheck(false))
							}}
							value={value}
						/>}
					/>
				</td>
				<td className="risk-report select-p-x">
					<Controller
						name={`schedule_${indexValue}`}
						control={control}
						render={({ field : {onChange, value}}) => (
							<Flatpickr
								id='range-picker'
								disabled = {disabled}
								style={{backgroundColor: `${disabled ? '#f2f2f2' : ''}`}}
								className= {`form-control`}
								placeholder={disabled ? '' : moment().format('YYYY-MM-DD')}
								value={value}
								onChange={(data) => {
									const newData = setStringDate(data)[0]
									onChange(newData)
									dispatch(setTabTempSaveCheck(false))
								}}
								options={{
									mode: 'single',
									dateFormat: 'Y-m-d',
									locale: Korean
								}}/>
						)}/>
				</td>
				<td className="risk-report select-p-x">
					<Controller
						name={`complete_${indexValue}`}
						control={control}
						render={({ field : {onChange, value}}) => (
							<Flatpickr
								id='range-picker'
								disabled = {disabled}
								style={{backgroundColor: `${disabled ? '#f2f2f2' : ''}`}}
								className= {`form-control`}
								placeholder={disabled ? '' : moment().format('YYYY-MM-DD')}
								value={value}
								onChange={(data) => {
									const newData = setStringDate(data)[0]
									onChange(newData)
									dispatch(setTabTempSaveCheck(false))
								}}
								options={{
									mode: 'single',
									dateFormat: 'Y-m-d',
									locale: Korean
								}}/>
						)}/>
				</td>
				<td className="risk-report select-p-x">
					<Controller
						name={`manager_${indexValue}`}
						control={control}
						render={({ field: { onChange, value } }) => (
							<Select
								name={`manager_${indexValue}`}
								classNamePrefix='select'
								className={`react-select custom-react-select`}
								value={value}
								options={managerList}
								onChange={e => {
									onChange(e)
									dispatch(setTabTempSaveCheck(false))
								}}
								placeholder={<span className="custom-placeholder">{'선택'}</span>}
								menuPortalTarget={document.body} 
								styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
							/>
						)}/>
				</td>
			</tr>
			{
				idx === (itemList.length - 1) &&
				<tr style={{border:'none'}}>
					<td style={{border:'none'}} className="risk-report detail-p-x detail-p-y text-align-center" colSpan='13'>
						<Button outline color="primary"
							onClick={handleAddClickButton}
						>항목 추가</Button>
					</td>
				</tr>
			}
		</>
    )
}

export default Step3Item