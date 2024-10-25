/* eslint-disable */
import { Fragment, useEffect, useState } from "react"
import { FormFeedback, Input, Table } from "reactstrap"
import Select from 'react-select'
import { Controller } from "react-hook-form"
import * as yup from 'yup'
import { checkSelectValue, checkSelectValueObj, primaryColor } from "../../../../utility/Utils"
import { isEmptyObject } from 'jquery'
import { checkSelectValueCustom } from "./data"
import { PlusCircle, XCircle } from "react-feather"

// 빈도 강도 테이블
export const FrequencyTableHeader = (props) => {
    const { pageType } = props
    return (
        <Fragment>
            <tr style={{borderBottom:'1.5px solid #B9B9C3'}}>
                <th rowSpan={2} className="label risk-report text-normal align-middle">
                    { pageType === 'detail' &&
                        '문항'
                    }
                </th>
                <th rowSpan={2} className="label risk-report text-normal align-middle">
                    세부작업명&nbsp;
                    { pageType !== 'detail' &&
                        <div className='d-inline-block essential_value'/>
                    }
                </th>
                <th rowSpan={2} className="label risk-report text-normal align-middle">
                    위험분류&nbsp;
                    { pageType !== 'detail' &&
                        <div className='d-inline-block essential_value'/>
                    }
                </th>
                <th colSpan={2} className="label risk-report text-normal align-middle">
                    현재 위험성
                </th>
                <th rowSpan={2} className="label risk-report text-normal align-middle">
                    위험발생 상황 및 결과&nbsp;
                    { pageType !== 'detail' &&
                        <div className='d-inline-block essential_value'/>
                    }
                </th>
                <th rowSpan={2} className="label risk-report text-normal align-middle">
                    관련근거(선택)
                </th>
            </tr>
            <tr style={{borderBottom:'1.5px solid #B9B9C3'}}>
                <th className="label risk-report text-normal align-middle">
                    가능성
                </th>
                <th className="label risk-report text-normal align-middle">
                    중대성
                </th>
            </tr>
        </Fragment>
    )
}

// 체크리스트 / 단계 테이블
export const StepCheckTableHeader = (props) => {
    const { pageType } = props
    return (
        <Fragment>
            <tr style={{borderBottom:'1.5px solid #B9B9C3'}}>
                <th className="label risk-report text-normal align-middle">
                    { pageType === 'detail' &&
                        '문항'
                    }
                </th>
                <th className="label risk-report text-normal align-middle">
                    유해 위험요인파악&nbsp;
                    { pageType !== 'detail' &&
                        <div className='d-inline-block essential_value'/>
                    }
                </th>
                <th className="label risk-report text-normal align-middle">
                    위험성 수준
                </th>
                <th className="label risk-report text-normal align-middle">
                    관련근거(선택)
                </th>
            </tr>
        </Fragment>
    )
}

// 빈도 강도 테이블
const FrequencyTableBody = (props) => {
    const { 
        control, errors, index, clickDeleteButton, clickAddButton, 
        itemList, dangerSelectList, indexValue, handleSelectError,
        dangerScoreList, selectError
    } = props

    const handleDeleteClickButton = () => {
        clickDeleteButton()
    } // 삭제 버튼 end

    const handleAddClickButton = () => {
        clickAddButton()
    } // 추가 버튼 end

    const handleSelectValidation = (e, event, onChange, index) => {
        handleSelectError(e, event, onChange, index)
    }

    return (
        <Fragment>
            <tr>
                <td className="risk-report select-p-x text-center">
                    <PlusCircle className="risk-report button-mx-half" style={{cursor:'pointer', color:primaryColor}} onClick={handleAddClickButton}/>
                    { itemList?.length > 1 &&
                        <XCircle className="risk-report button-mx-half" style={{cursor:'pointer', color:'red'}} onClick={handleDeleteClickButton}/>
                    }
                </td>
                <td className="risk-report select-p-x">
                    <Controller
                        name={`inputDetail_${indexValue}`}
                        control={control}
                        render={({ field: { onChange, value } })  => (
                        <>
                            <Input
                                id={`inputDetail_${indexValue}`}
                                type="textarea"
                                invalid={errors[`inputDetail_${indexValue}`] && true}
                                onChange={onChange}
                                value={value !== undefined ? value : ''}
                                placeholder="세부 작업명을 입력해주세요."
                            />
                            {errors[`inputDetail_${indexValue}`]&& <FormFeedback>{errors[`inputDetail_${indexValue}`].message}</FormFeedback>}
                        </>
                    )}/>
                </td>
                <td className="risk-report select-p-x">
                    <Controller
                        name={`selectDanger_${indexValue}`}
                        control={control}
                        render={({ field: { onChange, value } })  => (
                        <>
                            <Select
                                id={`selectDanger_${indexValue}`}
                                name={`selectDanger_${indexValue}`}
                                classNamePrefix={'select'}
                                className={`react-select custom-react-select custom-select-selectDanger_${indexValue}`}
                                placeholder={<span className="custom-placeholder">{'위험 분류를 선택해주세요.'}</span>}
                                options={dangerSelectList}
                                onChange={(e, event) => {handleSelectValidation(e, event, onChange, index)}}
                                value={value !== undefined ? value : ''}
                                menuPortalTarget={document.body} 
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            />
                            {selectError[`selectDanger_${indexValue}`] && <div style={{color:'#ea5455', fontSize:'0.857rem'}}>{'위험 분류를 선택해주세요.'}</div>}
                        </>
                    )}/>
                </td>
                <td className="risk-report select-p-x">
                    <Controller
                        name={`frequency_${indexValue}`}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <Select
                                name={`frequency_${indexValue}`}
                                classNamePrefix='select'
                                className='react-select custom-react-select'
								options={dangerScoreList}
								value={value}
								onChange={(e) => {
									onChange(e)
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
                        name={`strength_${indexValue}`}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <Select
                                name={`strength_${indexValue}`}
                                classNamePrefix='select'
                                className='react-select custom-react-select'
								options={dangerScoreList}
								value={value}
								onChange={(e) => {
									onChange(e)
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
                        name={`inputResult_${indexValue}`}
                        control={control}
                        render={({ field: { onChange, value } })  => (
                        <>
                            <Input
                                id={`inputResult_${indexValue}`}
                                type="textarea"
                                invalid={errors[`inputResult_${indexValue}`] && true}
                                onChange={onChange}
                                value={value !== undefined ? value : ''}
                                placeholder="위험 발생 상황 및 결과를 입력해주세요"
                            />
                            {errors[`inputResult_${indexValue}`]&& <FormFeedback>{errors[`inputResult_${indexValue}`].message}</FormFeedback>}
                        </>
                    )}/>
                </td>
                <td className="risk-report select-p-x">
                    <Controller
                        name={`inputReason_${indexValue}`}
                        control={control}
                        render={({ field: { onChange, value } })  => (
                        <>
                            <Input
                                id={`inputReason_${indexValue}`}
                                type="textarea"
                                onChange={onChange}
                                value={value !== undefined ? value : ''}
                                placeholder="관련근거를 입력해주세요."
                            />
                        </>
                    )}/>
                </td>
            </tr>
        </Fragment>
    )
}

// 체크리스트 / 단계 테이블
const StepCheckTableBody = (props) => {
    const { 
        control, errors, index, clickDeleteButton, clickAddButton, itemList, indexValue,
        dangerScoreList
    } = props

    const handleDeleteClickButton = () => {
        clickDeleteButton()
    }

    const handleAddClickButton = () => {
        clickAddButton()
    }

    return (
        <Fragment>
            <tr>
                <td className="risk-report select-p-x text-center">
                    <PlusCircle className="risk-report button-mx-half" style={{cursor:'pointer', color:primaryColor}} onClick={handleAddClickButton}/>
                    { itemList?.length > 1 &&
                        <XCircle className="risk-report button-mx-half" style={{cursor:'pointer', color:'red'}} onClick={handleDeleteClickButton}/>
                    }
                </td>
                <td className="risk-report select-p-x">
                    <Controller
                        name={`inputResult_${indexValue}`}
                        control={control}
                        render={({ field: { onChange, value } })  => (
                        <>
                            <Input
                                id={`inputResult_${indexValue}`}
                                type="textarea"
                                invalid={errors[`inputResult_${indexValue}`] && true}
                                onChange={onChange}
                                value={value !== undefined ? value : ''}
                                placeholder='유해 위험 요인 파악을 입력해주세요'
                            />
                            {errors[`inputResult_${indexValue}`] && <FormFeedback>{errors[`inputResult_${indexValue}`].message}</FormFeedback>}
                        </>
                    )}/>
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
								options={dangerScoreList}
								value={value}
								onChange={(e) => {
									onChange(e)
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
                        render={({ field: { onChange, value } })  => (
                        <>
                            <Input
                                id={`inputReason_${indexValue}`}
                                type="textarea"
                                onChange={onChange}
                                value={value !== undefined ? value : ''}
                                placeholder="관련근거를 입력해주세요."
                            />
                        </>
                    )}/>
                </td>
            </tr>
        </Fragment>
    )
}

// useform unregister func
const itemUnregister = (type, value, unregister, itemsYup, setItemsYup, selectError, setSelectError) => {
    if (type === 'frequency') { // Frequency
		unregister(`inputDetail_${value}`)
		unregister(`selectDanger_${value}`)
		unregister(`inputResult_${value}`)
		unregister(`inputReason_${value}`)

        unregister(`frequency_${value}`)
		unregister(`strength_${value}`)

        const currItemsYup = yup.object().shape({...itemsYup.fields})
        delete currItemsYup.fields[`inputDetail_${value}`]
        delete currItemsYup.fields[`inputResult_${value}`]
        setItemsYup(currItemsYup)
        const tempError = selectError
        delete selectError[`selectDanger_${value}`]
        setSelectError(tempError)
        return
    }
    unregister(`inputResult_${value}`)
    unregister(`inputReason_${value}`)

    unregister(`frequency_${value}`)

    const currItemsYup = yup.object().shape({...itemsYup.fields})
    delete currItemsYup.fields[`inputResult_${value}`]
    setItemsYup(currItemsYup)
    // StepCheckListItem
}

// validationadd func
const addYupMethod = (type, itemsYup, max, setItemsYup, selectError, setSelectError) => {
    if (type === 'frequency') {
        const tempYup = yup.object().shape({ // input validation
            ...itemsYup.fields,
            [`inputDetail_${max}`]: yup.string().required('세부 작업 명을 입력해주세요'),
            [`inputResult_${max}`]: yup.string().required('위험 발생 상황 및 결과를 입력해주세요'),
        })
        setItemsYup(tempYup)

        // select validation
        const copyError = {...selectError}
        copyError[`selectDanger_${max}`] = false
        setSelectError(copyError)
        return
    }
    // step
    const tempYup = yup.object().shape({
        ...itemsYup.fields,
        [`inputResult_${max}`]: yup.string().required('유해 위험 요인 파악을 입력해주세요'),
    })
    setItemsYup(tempYup)
} // addYupMethod end

// 항목 요소 list
const EvaluationItem = (props) => {
    const { 
        control, errors, unregister, itemsYup, 
        setItemsYup, itemList, setItemList, type,
        selectError, setSelectError, setValue, 
        dangerSelectList, dangerScoreList
    } = props // 추후 useForm 내려 받아서 관리

    const [max, setMax] = useState(itemList.length) // id 겹침 방지용

    // insert prototype
    Array.prototype.insert = function (index, ...items) {
        this.splice(index+1, 0, ...items)
    }

    // delete prototype
    Array.prototype.delete = function (index) {
        this.splice(index, 1)
    }

    // item remove 이벤트
    const removeItem = (index) => {
        if (itemList.length > 1) { // 1개 이하로 삭제 불가
            const copyList = [...itemList]
            itemUnregister(type, copyList[index], unregister, itemsYup, setItemsYup, selectError, setSelectError) // useForm unregister
            copyList.delete(index) // 삭제
		    setItemList(copyList)
        }
	}

    // add event
    const addItem = (index) => {
        const copyList = [...itemList]
        const valueMax = max+1
        copyList.insert(index, valueMax) // 요소 증가
        addYupMethod(type, itemsYup, valueMax, setItemsYup, selectError, setSelectError) // yup add
        setItemList(copyList)
        setMax(valueMax)
    }

    // select event
    const handleSelectError = (e, event, onChange, index) => {
        const tempName = event.name.split('_')[0]
        for (const i in itemList) { // 고정값으로 건너뛰기?
            if (i > index) {
                const name = `${tempName}_${itemList[i]}`
                checkSelectValueCustom(e, name, selectError, setSelectError, setValue)
            }
        }// for end
        onChange(e)
        checkSelectValue(e, event, selectError, setSelectError, setValue)
    }

    useEffect(() => {
        setMax(itemList.length)
        let currItemsYup = yup.object().shape({
            ...itemsYup.fields
        })
        const tempSelectError = {}
        if (type === 'frequency') {
            for (const item of itemList) {
                currItemsYup = yup.object().shape({
                    ...currItemsYup.fields,
                    [`inputDetail_${item}`]: yup.string().required('세부 작업 명을 입력해주세요'),
                    [`inputResult_${item}`]: yup.string().required('위험 발생 상황 및 결과를 입력해주세요')
                })
                tempSelectError[`selectDanger_${item}`] = false
            }
            setItemsYup(currItemsYup)
            setSelectError(tempSelectError)
            return
        }// if end

        for (const item of itemList) {
            currItemsYup = yup.object().shape({
                ...currItemsYup.fields,
                [`inputResult_${item}`]: yup.string().required('유해 위험 요인 파악을 입력해주세요')
            })
        }
        setItemsYup(currItemsYup)
    }, [itemList])
    useEffect(() => {
        if (!isEmptyObject(errors)) {
            checkSelectValueObj(control, selectError, setSelectError)
        }
	}, [errors]) // select error 처리
    // useEffect [errors] end

    return (
        <Fragment>
            <Table responsive className="mb-2 electric-table">
                <thead>
                    { type ==='frequency' ? 
                        <FrequencyTableHeader/>
                        :
                        <StepCheckTableHeader/>
                    }
                </thead>
                <tbody>
                    {itemList.map((value, index) => {
                        return (
                            <Fragment key={value}>
                                { type ==='frequency' ? 
                                    <FrequencyTableBody
                                        index={index}
                                        control={control}
                                        errors={errors}
                                        selectError={selectError}
                                        clickDeleteButton={() => {removeItem(index)}}
                                        clickAddButton={() => {addItem(index)}}
                                        indexValue={value}
                                        itemList={itemList}
                                        dangerSelectList={dangerSelectList}
                                        itemsYup={itemsYup}
                                        setItemsYup={setItemsYup}
                                        handleSelectError={handleSelectError}
                                        dangerScoreList={dangerScoreList}
                                    />
                                    :
                                    <StepCheckTableBody
                                        index={index}
                                        control={control}
                                        errors={errors}
                                        clickDeleteButton={() => {removeItem(index)}}
                                        clickAddButton={() => {addItem(index)}}
                                        indexValue={value}
                                        itemList={itemList}
                                        dangerScoreList={dangerScoreList}
                                    />
                                }
                            </Fragment>
                        )
                    })}
                </tbody>
            </Table>
        </Fragment>
    )
}

export default EvaluationItem