import Breadcrumbs from '@components/breadcrumbs'
import { yupResolver } from '@hookform/resolvers/yup'
import { Fragment, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useParams } from 'react-router'
import { Card, CardHeader, CardTitle, Row } from "reactstrap"
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'
import { defaultValues, labelObj, validationSchemaObj } from '../data'
import Floor from './Floor'
import Building from './Building'

const SystemBasicSpace = () => {
	useAxiosIntercepter()
	const { state } = useLocation()
	const [pageType, setPageType] = useState(state.pageType)
	const [detailRow] = useState(useParams().id)
	const key = 'key' in state ? state.key : ''
	const [title, setTitle] = useState('')
	const [checkCode, setCheckCode] = useState(false)

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
		setTitle(`${labelObj[key]}`)
	}, [pageType])


	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='공간정보관리' breadCrumbParent='시스템관리' breadCrumbParent2='기본정보' breadCrumbActive='공간정보관리'/>
				</div>
			</Row>
			<Card>
				<CardHeader>
					<CardTitle className="title">
						{title}
					</CardTitle>
				</CardHeader>
				{
					key === 'building' &&
						<Building
							pageType={pageType}
							setPageType={setPageType}
							control={control} 
							handleSubmit={handleSubmit} 
							errors={errors}
							checkCode={checkCode}
							setCheckCode={setCheckCode}
							watch={watch(['code', 'property'])}
							setValue={setValue}
							rowId={detailRow}
						/>
				}
				{
					key === 'floor' &&
						<Floor
							pageType={pageType}
							setPageType={setPageType}
							control={control} 
							handleSubmit={handleSubmit} 
							errors={errors}
							checkCode={checkCode}
							setCheckCode={setCheckCode}
							watch={watch(['code', 'property'])}
							setValue={setValue}
							rowId={detailRow}
						/>
				}
			</Card>
		</Fragment>
	)
}

export default SystemBasicSpace