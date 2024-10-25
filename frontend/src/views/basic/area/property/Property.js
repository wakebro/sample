import Breadcrumbs from '@components/breadcrumbs'
import { yupResolver } from '@hookform/resolvers/yup'
import { Fragment, useEffect, useState } from "react"
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { useParams } from "react-router-dom"
import { Card, CardHeader, CardTitle, Row } from 'reactstrap'
import { API_SPACE_PROPERTY, ROUTE_BASICINFO_AREA_PROPERTY } from '../../../../constants'
import axios from "../../../../utility/AxiosConfig"
import { setValueFormat } from '../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { defaultValues, validationSchemaObj } from '../data'
import PropertyDetail from './PropertyDetail'
import PropertyForm from './PropertyForm'
import { pageTypeKor } from '../../../system/auth/data'

const Property = () => {
	useAxiosIntercepter()
	const { type } = useParams()
	const [detailBackUp, setDetailBackUp] = useState({})
	const [pageType, setPageType] = useState('detail')
	const [submitResult, setSubmitResult] = useState(false)
	const navigate = useNavigate()

	const {
		control,
		handleSubmit,
		setValue
	} = useForm({
		defaultValues: JSON.parse(JSON.stringify(defaultValues.property)),
		resolver: yupResolver(validationSchemaObj.property)
	})

	// GET
	const getDetail = (id) => {
		axios.get(`${API_SPACE_PROPERTY}/${id}`)
		.then(res => {
			setDetailBackUp(res.data)
			setValueFormat(res.data, control._formValues, setValue, null)
			if (res.data.overdue_daily_rate === undefined || res.data.overdue_daily_rate === null) {
				setValue('overdue_daily_rate', '')
			}
			if (res.data.overdue_monthly_rate === undefined || res.data.overdue_monthly_rate === null) {
				setValue('overdue_monthly_rate', '')
			}
		})
	}

	useEffect(() => {
		getDetail(type)
	}, [])


	useEffect(() => {
		if (submitResult) {
			navigate(ROUTE_BASICINFO_AREA_PROPERTY)
		}
	}, [submitResult])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='사업소정보' breadCrumbParent='기본정보' breadCrumbParent2='공간정보관리' breadCrumbActive='사업소정보' />
				</div>
			</Row>
			<Card>
				<CardHeader>
					<CardTitle className="title">{`사업소 정보${pageTypeKor[pageType]}`}</CardTitle>
				</CardHeader>
				{
					pageType === 'modify' ?
						<PropertyForm
							pageType={pageType}
							setPageType={setPageType} 
							control={control} 
							setValue={setValue}
							handleSubmit={handleSubmit}
							detailBackUp={detailBackUp}
							setSubmitResult={setSubmitResult}
							/>
					:
						<PropertyDetail
							setPageType={setPageType} 
							control={control}
							/>
				}
			</Card>
		</Fragment>
	)
}

export default Property