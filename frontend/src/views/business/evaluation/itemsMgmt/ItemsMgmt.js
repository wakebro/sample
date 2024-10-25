import Breadcrumbs from '@components/breadcrumbs'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import { setPageType, setSubmitResult } from '@store/module/businessEevaluationItems'
import { Fragment, useEffect } from "react"
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from 'react-router'
import { Row } from 'reactstrap'
import { defaultValues, validationSchemaObj } from '../../data'
// import MaintenanceDetail from './MaintenanceDetail'
import { ROUTE_BUSINESS_EVALUATION } from '../../../../constants'
import ItemsMgmtForm from './ItemsMgmtForm'

const ItemMgmt = () => {
	useAxiosIntercepter()
	const { state } = useLocation()
	// const { rowId } = useParams()
	const businessEevaluationItems = useSelector((state) => state.businessEevaluationItems)
	const dispatch = useDispatch()
	// const navigate = useNavigate()

	// const [title, setTitle] = useState('')

	const {
		control
		, handleSubmit
		, formState: { errors }
		, setValue
		, watch
	} = useForm({
		defaultValues: JSON.parse(JSON.stringify(defaultValues.itemsMgmt)),
		resolver: yupResolver(validationSchemaObj.itemsMgmt)
	})

	// const getDetail = (id) => {
	// 	axios.get(`${API_BUSINESS_COST}/${id}`)
	// 	.then(res => {
    //         console.log(res.data)
	// 		setTitle(res.data.title)
	// 		dispatch(setDetailBackUp(res.data))
	// 		setValueFormat(res.data, control._formValues, setValue, null)
	// 		setValue('lines', res.data.lines)
	// 		const tempDataTable = []
	// 		res.data.lines.map(line => tempDataTable.push(line))
	// 		tempDataTable.push([])
	// 		setValue('dataTable', tempDataTable)
	// 	})
	// }

	useEffect(() => {
        // console.log(state)
		dispatch(setPageType(state.pageType))
		if (state.pageType === 'register') {
			// setTitle(`평가항목 ${pageTypeKor[state.pageType]}`)
		}
	}, [])

	useEffect(() => {
		if (businessEevaluationItems.submitResult) {
			dispatch(setSubmitResult(false))
			navigate(`${ROUTE_BUSINESS_EVALUATION}/items-mgmt`)
		}
	}, [businessEevaluationItems.submitResult])

	// useEffect(() => {
	// 	if (rowId) {
	// 		dispatch(setId(rowId))
	// 		getDetail(rowId)
	// 	}
	// }, [rowId])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='평가항목관리' breadCrumbParent='사업관리' breadCrumbParent2='성과평가' breadCrumbActive='평가항목관리'/>
				</div>
			</Row>
			<Fragment>
				{/* <CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader> */}
				{
					(businessEevaluationItems.pageType === 'register' || businessEevaluationItems.pageType === 'modify') ?
						<ItemsMgmtForm
							control={control}
							handleSubmit={handleSubmit}
							errors={errors}
							setValue={setValue}
							watch={watch}
						/>
					:
                        <div>
                            상세
                        </div>
				}
			</Fragment>
		</Fragment>
	)
}

export default ItemMgmt