/* eslint-disable */
import { Controller } from "react-hook-form"
import { Button, Input } from "reactstrap"
import Select from 'react-select'
import { useEffect, useState } from "react"
import { returnResult } from "../data"
import { NOMAL, getMultiResult, getStrGrade } from "../../../data"
import { setStringDate } from "../../../../../../../../utility/Utils"
import moment from "moment"
import Flatpickr from "react-flatpickr"
import { XCircle } from "react-feather"
import { Korean } from "flatpickr/dist/l10n/ko.js"
import { useDispatch } from 'react-redux'
import { setTabTempSaveCheck } from '@store/module/criticalDisaster'

const FrequencyItem = (props) => {
	const { 
        idx, indexValue, itemList, type, control, dangerSelectList, 
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
		setDisabled(getMultiResult(type, watch(`multiResult_${indexValue}`)) === 'Err' || getMultiResult(type, watch(`multiResult_${indexValue}`)) < NOMAL)
	}, [
        watch(`multiResult_${indexValue}`)
    ])

    useEffect(() => {
        const tempFrequency = watch(`frequency_${indexValue}`)
        const tempStrength = watch(`strength_${indexValue}`)

        let numFre = tempFrequency
        let numStre = tempStrength

        if (typeof tempFrequency === 'object') {
            numFre = tempFrequency.value
        }
        if (typeof tempStrength === 'object') {
            numStre = tempStrength.value
        }

        if (typeof numFre !== 'number' || typeof numStre !== 'number') {
            setValue(`multiResult_${indexValue}`, '')
            return
        }
        setValue(`multiResult_${indexValue}`, numFre * numStre)
    }, [
        watch(`frequency_${indexValue}`),
        watch(`strength_${indexValue}`)
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
                        name={`inputDetail_${indexValue}`}
                        control={control}
                        render={({ field: {onChange, value} }) => <Input type='textarea' rows='1'
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
                        name={`selectDanger_${indexValue}`}
                        control={control}
                        render={({ field: { onChange, value } })  => (
                            <Select
                                name={`selectDanger_${indexValue}`}
                                classNamePrefix='select'
                                className={`react-select custom-react-select`}
                                options={dangerSelectList}
                                onChange={e => {
                                    onChange(e)
                                    dispatch(setTabTempSaveCheck(false))
                                }}
                                value={value}
                                placeholder={<span className="custom-placeholder">{'선택'}</span>}
                                menuPortalTarget={document.body} 
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            />
                        )}
                    />
                </td>
                <td className="risk-report select-p-x">
                    <Controller
                        name={`inputResult_${indexValue}`}
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
                        name={`nowAction_${indexValue}`}
                        control={control}
                        render={({ field: {onChange, value} }) => 
                        <Input 
                            type='textarea' 
                            rows='1'
                            name={`nowAction_${indexValue}`}
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
                        render={({ field: { value } }) => (
                            <Select
                                name={`frequency_${indexValue}`}
                                classNamePrefix='select'
                                className='react-select custom-react-select'
                                value={value}
                                options={selectList}
                                placeholder={<span className="custom-placeholder">{'선택'}</span>}
                                menuPortalTarget={document.body} 
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                onChange={(e) => {
                                    returnResult(indexValue, `frequency_${indexValue}`, `strength_${indexValue}`, e, control, setValue)
                                    dispatch(setTabTempSaveCheck(false))
                                }}
                            />
                        )}
                    />
                </td>
                <td className="risk-report select-p-x">
                    <Controller
                        name={`strength_${indexValue}`}
                        control={control}
                        render={({ field: { value } }) => (
                            <Select
                                name={`strength_${indexValue}`}
                                classNamePrefix='select'
                                className='react-select custom-react-select'
                                value={value}
                                options={selectList}
                                placeholder={<span className="custom-placeholder">{'선택'}</span>}
                                menuPortalTarget={document.body} 
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                onChange={(e) => {
                                    returnResult(indexValue, `strength_${indexValue}`, `frequency_${indexValue}`, e, control, setValue)
                                    dispatch(setTabTempSaveCheck(false))
                                }}
                            />
                        )}
                    />
                </td>
                <td className="risk-report select-p-x">
                    <Controller
                        name={`multiResult_${indexValue}`}
                        control={control}
                        render={({ field: {value} }) => {
                            if (watch(`multiResult_${indexValue}`) === '') return (<div></div>)
                            else return (
                                <div style={{textAlign:'center', border:'none'}}>
                                    {value}{getStrGrade(type, getMultiResult(type, value))}
                                </div>
                            )
                        }}
                    />
                </td>
                <td className="risk-report select-p-x">
                    <Controller
                        name={`inputReason_${indexValue}`}
                        control={control}
                        render={({ field: {onChange, value} }) => <Input type='textarea' rows='1' 
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
                        render={({ field: {onChange, value} }) => <Input type='textarea' rows='1'
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
                        name={`dangerousness_${indexValue}`}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Select
                                isDisabled={ disabled }
                                name={`dangerousness_${indexValue}`}
                                classNamePrefix='select'
                                className='react-select custom-react-select'
                                value={value}
                                options={selectList}
                                onChange={(e) => {
                                    onChange(e)
                                    dispatch(setTabTempSaveCheck(false))
                                }}
                                placeholder={<span className="custom-placeholder">{'선택'}</span>}
                                menuPortalTarget={document.body} 
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            />
                        )}/>
                </td>
                <td className="risk-report select-p-x">
                    <Controller
                        name={`schedule_${indexValue}`}
                        control={control}
                        render={({ field : {onChange, value}}) => (
                            <Flatpickr
                                id='range-picker'
                                disabled = { disabled }
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
                                disabled = { disabled }
                                style={{backgroundColor: `${disabled? '#f2f2f2' : ''}`}}
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
                                onChange={(e) => {
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

export default FrequencyItem