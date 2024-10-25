import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { CardBody } from 'reactstrap'
import { ROUTE_SYSTEMMGMT_BASIC_COMPANY } from '../../../../../constants'
import { setValueFormat } from '../../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'
import { BasicInfoAPIObj } from '../data'
import CompanyDetail from './CompanyDetail'
import CompanyForm from './CompanyForm'

const Company = (props) => {
	useAxiosIntercepter()
	const { pageType, setPageType, control, handleSubmit, errors, checkCode, setCheckCode, watch, setValue, rowId, property_id } = props
	const [oldCode, setOldCode] = useState()
	const [submitResult, setSubmitResult] = useState(false)
	const [detailBackUp, setDetailBackUp] = useState({})

	const navigate = useNavigate()

	// GET
	const getDetail = (id) => {
		axios.get(`${BasicInfoAPIObj.company}/${id}`)
		.then(res => {
			setDetailBackUp(res.data)
			setValueFormat(res.data, control._formValues, setValue, null)
			setValue('type', {label:res.data.type, value:res.data.type})
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
	}, [watch])

	useEffect(() => {
		if (submitResult) {
			navigate(ROUTE_SYSTEMMGMT_BASIC_COMPANY)
		}
	}, [submitResult])

	return (
		<CardBody>
			{
				(pageType === 'register' || pageType === 'modify') ?
					<CompanyForm 
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
						detailBackUp={detailBackUp}
						property_id={property_id}
					/>
				:
					<CompanyDetail 
						setPageType={setPageType} 
						control={control} 
						rowId={rowId}
						setSubmitResult={setSubmitResult}
					/>
			}
		</CardBody>
	)
}

export default Company