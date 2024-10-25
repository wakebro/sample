import Breadcrumbs from '@components/breadcrumbs'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import { setDetailBackUp, setPageType } from '@store/module/basicFloor'
import axios from 'axios'
import { Fragment, useEffect } from "react"
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { useParams } from "react-router-dom"
import { Card, CardHeader, CardTitle, Row } from "reactstrap"
import { API_SYSTEMMGMT_BASIC_INFO_FLOOR, ROUTE_BASICINFO_AREA_FLOOR } from '../../../../constants'
import { setId, setSubmitResult } from '../../../../redux/module/basicFloor'
import { setValueFormat } from '../../../../utility/Utils'
import { defaultValues, validationSchemaObj } from '../data'
import FloorDetail from './FloorDetail'
import FloorForm from './FloorForm'
import { pageTypeKor } from '../../../system/auth/data'

const Floor = () => {
	useAxiosIntercepter()
	const { rowId } = useParams()
	const basicFloor = useSelector((state) => state.basicFloor)
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const {
		control,
		handleSubmit,
		setValue,
		trigger,
		formState: {errors}
	} = useForm({
		defaultValues: JSON.parse(JSON.stringify(defaultValues.floor)),
		resolver: yupResolver(validationSchemaObj.floor)
	})

	// GET
	const getDetail = (id) => {
		axios.get(`${API_SYSTEMMGMT_BASIC_INFO_FLOOR}/${id}`)
		.then(res => {
			dispatch(setDetailBackUp(res.data))
			setValueFormat(res.data, control._formValues, setValue, null)
			if (res.data.fl_area === undefined || res.data.fl_area === null) {
				setValue('fl_area', '')
			} else setValue('fl_area', res.data.fl_area)
		})
	}

	useEffect(() => {
		dispatch(setPageType('detail'))
		dispatch(setId(rowId))
		getDetail(rowId)
	}, [])

	useEffect(() => {
		if (basicFloor.submitResult) {
			dispatch(setSubmitResult(false))
			navigate(ROUTE_BASICINFO_AREA_FLOOR)
		}
	}, [basicFloor.submitResult])
	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='층정보' breadCrumbParent='기본정보' breadCrumbParent2='공간정보관리' breadCrumbActive='층정보'/>
				</div>
			</Row>
			<Card>
				<CardHeader>
					<CardTitle className="title">{`층 정보${pageTypeKor[basicFloor.pageType]}`}</CardTitle>
				</CardHeader>
				{
					basicFloor.pageType === 'modify' ?
						<FloorForm
							control={control} 
							setValue={setValue}
							handleSubmit={handleSubmit}
							trigger={trigger}
							errors={errors}
						/>
					:
						<FloorDetail
							control={control}
						/>
				}
			</Card>
		</Fragment>
	)
}

export default Floor