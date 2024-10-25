import axios from 'axios'
import { isEmptyObject } from 'jquery'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { CardBody } from 'reactstrap'
import { ROUTE_SYSTEMMGMT_BASIC_COMPANY } from '../../../../../constants'
import { checkSelectValueObj, setValueFormat } from '../../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'
import { BasicInfoAPIObj } from '../data'
import PropertyDetail from './PropertyDetail'
import PropertyForm from './PropertyForm'

// const [selectError, setSelectError] = useState({
// 	city1: false,
// 	city2: false,
// 	city3: false
// })
// const {city1, city2, city3} = selectError
const Property = (props) => {
	useAxiosIntercepter()
	const { pageType, setPageType, control, handleSubmit, errors, checkCode, setCheckCode, watch, setValue, rowId } = props
	const [oldCode, setOldCode] = useState()
	
	// Select validation
	const [selectError, setSelectError] = useState({city: false})
	
	const [submitResult, setSubmitResult] = useState(false)
	const [detailBackUp, setDetailBackUp] = useState({})
	const navigate = useNavigate()

	// GET
	const getDetail = (id) => {
		axios.get(`${BasicInfoAPIObj.property}/${id}`)
		.then(res => {
			setDetailBackUp(res.data)
			setValueFormat(res.data, control._formValues, setValue, null)
			setOldCode(res.data.code)
		})
	}

	useEffect(() => {
		if (rowId) getDetail(rowId)
	}, [])

	useEffect(() => {
		setCheckCode(false)
	}, [watch])

	useEffect(() => {
		if (!isEmptyObject(errors)) {
			checkSelectValueObj(control, selectError, setSelectError)
		}
	}, [errors])

	useEffect(() => {
		if (submitResult) {
			navigate(ROUTE_SYSTEMMGMT_BASIC_COMPANY)
			window.location.reload()
		}
	}, [submitResult])

	return (
		<CardBody>
			{
				(pageType === 'register' || pageType === 'modify') ?
					<PropertyForm
						pageType={pageType} 
						setPageType={setPageType} 
						control={control} 
						handleSubmit={handleSubmit} 
						errors={errors} 
						oldCode={oldCode} 
						checkCode={checkCode} 
						setCheckCode={setCheckCode} 
						setValue={setValue} 
						setSubmitResult={setSubmitResult} 
						rowId={rowId}
						selectError={selectError}
						setSelectError={setSelectError}
						detailBackUp={detailBackUp}
					/>
				:
					<PropertyDetail
						setPageType={setPageType} 
						control={control} 
						rowId={rowId}
						setSubmitResult={setSubmitResult}
					/>
			}
		</CardBody>
	)
}

export default Property