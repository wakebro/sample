import { useEffect, useState } from "react"
import { useNavigate } from 'react-router'
import { CardBody } from "reactstrap"
import { ROUTE_SYSTEMMGMT_BASIC_COMPANY } from "../../../../../constants"
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'
import DepartmentForm from "./DepartmentForm"
import { isEmptyObject } from "jquery"
import { checkSelectValueObj, setValueFormat } from "../../../../../utility/Utils"
import DepartmentDetail from "./DepartmentDetail"
import axios from "axios"
import { BasicInfoAPIObj } from "../data"

const Department = (props) => {
	useAxiosIntercepter()
	const { pageType, setPageType, control, handleSubmit, errors, checkCode, setCheckCode, watch, setValue, rowId } = props
	const [oldCode, setOldCode] = useState()
	const [submitResult, setSubmitResult] = useState(false)
	const [detailBackUp, setDetailBackUp] = useState({})
	const [code, setCode] = useState('')
	const [selectCompany, setSelectCompany] = useState({label: '전체', value:''})

	// Select validation
	const [selectError, setSelectError] = useState({company: false})

	const navigate = useNavigate()

	// GET
	const getDetail = (id) => {
		axios.get(`${BasicInfoAPIObj.department}/${id}`)
		.then(res => {
			console.log(res.data)
			setDetailBackUp(res.data)
			setValueFormat(res.data, control._formValues, setValue, null)
			setValue('company', {label:res.data.company.name, value:res.data.company.id})
			setOldCode(res.data.code)
			setCode(res.data.code)
			setSelectCompany({label:res.data.company.name, value:res.data.company.id})
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
		if (!isEmptyObject(errors)) {
			checkSelectValueObj(control, selectError, setSelectError)
		}
	}, [errors])

	useEffect(() => {
		if (submitResult) {
			navigate(ROUTE_SYSTEMMGMT_BASIC_COMPANY)
		}
	}, [submitResult])

	return (
		<CardBody>
			{
				(pageType === 'register' || pageType === 'modify') ?
					<DepartmentForm
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
						code={code}
						setCode={setCode}
						selectCompany={selectCompany}
						setSelectCompany={setSelectCompany}
					/>
				:
					<DepartmentDetail
						setPageType={setPageType} 
						control={control} 
						rowId={rowId}
						setSubmitResult={setSubmitResult}
					/>
			}
		</CardBody>
	)
}

export default Department