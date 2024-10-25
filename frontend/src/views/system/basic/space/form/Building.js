import { useAxiosIntercepter } from '@utility/hooks/useAxiosInterceptor'

import axios from 'axios'
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router'
import { CardBody } from "reactstrap"
import { ROUTE_SYSTEMMGMT_BASIC_SPACE } from "../../../../../constants"
import { apiObj } from '../data'
import BuildingDetail from './BuildingDetail'
import BuildingForm from './BuildingForm'

const Building = (props) => {
	useAxiosIntercepter()
	const { pageType, setPageType, control, handleSubmit, errors, checkCode, setCheckCode, watch, setValue, rowId } = props
	const [oldCode, setOldCode] = useState()
	const [selectError, setSelectError] = useState({property: false, building: false})
	const [submitResult, setSubmitResult] = useState(false)
	const [detailBackUp, setDetailBackUp] = useState({})

	const navigate = useNavigate()

	// GET
	const getDetail = (id) => {
		axios.get(`${apiObj.building}/${id}`)
		.then(res => {
			setDetailBackUp(res.data)
			setValue('code', res.data.code)
			setValue('name', res.data.name)
			setValue('comments', res.data.comments)
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
		if (submitResult) {
			navigate(ROUTE_SYSTEMMGMT_BASIC_SPACE)
		}
	}, [submitResult])

	return (
		<CardBody>
			{
				(pageType === 'register' || pageType === 'modify') ?
					<BuildingForm
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
					<BuildingDetail
						setPageType={setPageType}
						control={control} 
						rowId={rowId}
						setSubmitResult={setSubmitResult}
					/>
			}
		</CardBody>
	)
}

export default Building