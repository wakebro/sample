import axios from 'axios'
import { isEmptyObject } from "jquery"
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router'
import { CardBody } from "reactstrap"
import { ROUTE_SYSTEMMGMT_BASIC_SPACE } from "../../../../../constants"
import { checkSelectValueObj } from '../../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'
import { apiObj } from '../data'
import FloorDetail from './FloorDetail'
import FloorForm from "./FloorForm"

const Floor = (props) => {
	useAxiosIntercepter()
	const { pageType, setPageType, control, handleSubmit, errors, checkCode, setCheckCode, watch, setValue, rowId } = props
	const [oldCode, setOldCode] = useState()
	const [selectError, setSelectError] = useState({property: false, building: false})
	const [submitResult, setSubmitResult] = useState(false)
	const [detailBackUp, setDetailBackUp] = useState({})

	const navigate = useNavigate()

	// GET
	const getDetail = (id) => {
		axios.get(`${apiObj.floor}/${id}`)
		.then(res => {
            console.log(res.data)
			setDetailBackUp(res.data)
			setValue('code', res.data.code)
			setValue('name', res.data.name)
			if (res.data.building !== null) {
				setValue('building', {label:res.data.building.name, value:res.data.building.id})
			}
			if (res.data.property !== null) {
				setValue('property', {label:res.data.property.name, value:res.data.property.id})
			}
			setOldCode(res.data.code)
		})
	}

	useEffect(() => {
		if (rowId) {
			getDetail(rowId)
		}
	}, [])

	useEffect(() => {
		setCheckCode(false)
	}, [watch[0]])

	useEffect(() => {
		if (!isEmptyObject(errors)) {
			checkSelectValueObj(control, selectError, setSelectError)
		}
	}, [errors])

	useEffect(() => {
		if (submitResult) {
			navigate(ROUTE_SYSTEMMGMT_BASIC_SPACE)
		}
	}, [submitResult])

	return (
		<CardBody>
			{
				(pageType === 'register' || pageType === 'modify') ?
					<FloorForm
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
						watch={watch[1]}
						detailBackUp={detailBackUp}
					/>
				:
					<FloorDetail
						setPageType={setPageType}
						control={control} 
						rowId={rowId}
						setSubmitResult={setSubmitResult}
					/>
			}
		</CardBody>
	)
}

export default Floor