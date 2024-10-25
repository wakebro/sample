import Breadcrumbs from '@components/breadcrumbs'
import { yupResolver } from '@hookform/resolvers/yup'
import { Fragment, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useParams } from 'react-router'
import { Card, CardHeader, CardTitle, Row } from "reactstrap"
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'
import { BasicInfoLabelObj, defaultValues, validationSchemaObj } from '../data'
import Cookies from 'universal-cookie'
import City from './City'
import Company from './Company'
import Property from './Property'
import Department from './Department'
import PropertyGroup from './PropertyGroup'

const SystemBasicCompany = () => {
	useAxiosIntercepter()
	const { state } = useLocation()
	const [pageType, setPageType] = useState(state.pageType)
	const [detailRow] = useState(useParams().id)
	const key = 'key' in state ? state.key : ''
	const [title, setTitle] = useState('')
	const [checkCode, setCheckCode] = useState(false)
	const cookies = new Cookies()
	const property_id = cookies.get('property').value

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
		watch
	} = useForm({
		defaultValues: JSON.parse(JSON.stringify(defaultValues[key])),
		resolver: yupResolver(validationSchemaObj[key])
	})

	useEffect(() => {
		setTitle(`${BasicInfoLabelObj[key]}`)
	}, [pageType])


	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='회사정보관리' breadCrumbParent='시스템관리' breadCrumbParent2='기본정보' breadCrumbActive='회사정보관리' />
				</div>
			</Row>
			<Card>
				<CardHeader>
					<CardTitle className="title">
						{title}
					</CardTitle>
				</CardHeader>
				{
					key === 'city' &&
					<City
						pageType={pageType}
						setPageType={setPageType}
						control={control} 
						handleSubmit={handleSubmit} 
						errors={errors}
						checkCode={checkCode}
						setCheckCode={setCheckCode}
						watch={watch('code')}
						setValue={setValue}
						rowId={detailRow}
						/>
				}
				{
					key === 'propertyGroup' &&
					<PropertyGroup
						pageType={pageType}
						setPageType={setPageType}
						control={control} 
						handleSubmit={handleSubmit} 
						errors={errors}
						checkCode={checkCode}
						setCheckCode={setCheckCode}
						watch={watch('code')}
						setValue={setValue}
						rowId={detailRow}
						/>
				}
				{
					key === 'property' &&
					<Property
						pageType={pageType}
						setPageType={setPageType}
						control={control} 
						handleSubmit={handleSubmit} 
						errors={errors}
						checkCode={checkCode}
						setCheckCode={setCheckCode}
						watch={watch('code')}
						setValue={setValue}
						rowId={detailRow}
						/>
				}
				{
					key === 'company' &&
					<Company
						pageType={pageType}
						setPageType={setPageType}
						control={control} 
						handleSubmit={handleSubmit} 
						errors={errors}
						checkCode={checkCode}
						setCheckCode={setCheckCode}
						watch={watch('code')}
						setValue={setValue}
						rowId={detailRow}
						property_id={property_id}
					/>
				}
				{
					key === 'department' &&
					<Department
						pageType={pageType}
						setPageType={setPageType}
						control={control} 
						handleSubmit={handleSubmit} 
						errors={errors}
						checkCode={checkCode}
						setCheckCode={setCheckCode}
						watch={watch('code')}
						setValue={setValue}
						rowId={detailRow}
					/>
				}
			</Card>
		</Fragment>
	)
}

export default SystemBasicCompany