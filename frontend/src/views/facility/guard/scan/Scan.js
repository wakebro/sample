import axios from '@utility/AxiosConfig'
import { setValueFormat } from '@utils'
import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import { setId, setPageType, setDetailBackUp } from '@store/module/nfcWorker'

import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import ScanDetail from './ScanDetail'
import { API_FACILITY_GUARD_SCAN, ROUTE_FACILITYMGMT_GUARD } from '../../../../constants'
import { defaultValues } from '../data'
import ScanForm from './ScanForm'

const Scan = () => {
	useAxiosIntercepter()
	const { state } = useLocation()
	const { rowId } = useParams()
	const navigate = useNavigate()
	const nfcWorker = useSelector((state) => state.nfcWorker)
	const dispatch = useDispatch()
	const [show, setShow] = useState(false)

	const {
		control
		, handleSubmit
		, setValue
	} = useForm({
		defaultValues: JSON.parse(JSON.stringify(defaultValues.scan))
	})

	function getDetail(id) {
		axios.get(`${API_FACILITY_GUARD_SCAN}/${id}`)
		.then(res => {
			dispatch(setDetailBackUp(res.data[0]))
			setValueFormat(res.data[0], control._formValues, setValue, null)
			if (res.data[0].description === null) setValue('description', '')
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
		if (nfcWorker.submitResult) navigate(`${ROUTE_FACILITYMGMT_GUARD}/scan-list`)
	}, [nfcWorker.submitResult])
	return (
		<Fragment>
			{
				nfcWorker.pageType === 'modify' ?
					<ScanForm 
						control={control}
						handleSubmit={handleSubmit}/>
				: 
					<>{ show && <ScanDetail control={control}/>}</>
			}
		</Fragment>
	)
}

export default Scan