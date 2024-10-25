import Breadcrumbs from '@components/breadcrumbs'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import { setDetailBackUp, setId, setPageType } from '@store/module/basicRoom'
import { setValueFormat } from '@utils'
import axios from 'axios'
import { Fragment, useEffect, useState } from "react"
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, Row } from 'reactstrap'
import { API_SPACE_ROOM, ROUTE_BASICINFO_AREA_ROOM } from '../../../../constants'
import { pageTypeKor } from '../../../system/auth/data'
import { defaultValues, validationSchemaObj } from '../data'
import RoomDetail from './RoomDetail'
import RoomForm from './RoomForm'

const Room = () => {
	useAxiosIntercepter()
	const { state } = useLocation()
	const { rowId } = useParams()
	const basicRoom = useSelector((state) => state.basicRoom)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [show, setShow] = useState(false)

	const {
		control
		, handleSubmit
		, formState: { errors }
		, setValue
		, watch
	} = useForm({
		defaultValues: JSON.parse(JSON.stringify(defaultValues.room)),
		resolver: yupResolver(validationSchemaObj.room)
	})

	const getDetail = (id) => {
		axios.get(`${API_SPACE_ROOM}/${id}`)
		.then(res => {
			dispatch(setDetailBackUp(res.data))
			setValueFormat(res.data, control._formValues, setValue, null)
			setShow(true)
		})
	}

	useEffect(() => {
		dispatch(setPageType(state.pageType))
	}, [])

	useEffect(() => {
		if (rowId) {
			setShow(false)
			dispatch(setId(rowId))
			getDetail(rowId)
		}
	}, [rowId])

	useEffect(() => {
		if (basicRoom.submitResult) navigate(ROUTE_BASICINFO_AREA_ROOM)
	}, [basicRoom.submitResult])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='실정보' breadCrumbParent='기본정보' breadCrumbParent2='공간정보관리' breadCrumbActive='실정보'/>
				</div>
			</Row>
			<Card>
				<CardHeader>
					<CardTitle>{`실정보 ${pageTypeKor[basicRoom.pageType]}`}</CardTitle>
				</CardHeader>
				{
					(basicRoom.pageType === 'register' || basicRoom.pageType === 'modify') ?
						<RoomForm
							control={control}
							handleSubmit={handleSubmit}
							errors={errors}
							setValue={setValue}
							watch={watch}/>
					:
						<Fragment>
							{ show && <RoomDetail control={control}/> }
						</Fragment>
				}
			</Card>
		</Fragment>
	)
}

export default Room