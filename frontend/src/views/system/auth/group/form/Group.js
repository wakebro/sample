import { yupResolver } from '@hookform/resolvers/yup'
import { Fragment, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { CardBody } from "reactstrap"
import { ROUTE_SYSTEMMGMT_AUTH_GROUP } from '../../../../../constants'
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'
import { authAPIObj, authDefaultValues, authValidationSchemaObj } from '../../data'
import GroupDetail from './GroupDetail'
import GroupForm from './GroupForm'
import axios from 'axios'
import { setValueFormat } from '../../../../../utility/Utils'

const Group = () => {
	useAxiosIntercepter()
	const authGroup = useSelector((state) => state.authGroup)
	const [submitResult, setSubmitResult] = useState(false)
	const [detailBackUp, setDetailBackUp] = useState({})
	const navigate = useNavigate()

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue
	} = useForm({
		defaultValues: JSON.parse(JSON.stringify(authDefaultValues['group'])),
		resolver: yupResolver(authValidationSchemaObj['group'])
	})

	useEffect(() => {
		if (submitResult) {
			navigate(ROUTE_SYSTEMMGMT_AUTH_GROUP)
		}
	}, [submitResult])

	useEffect(() => {
		if (authGroup.detailRow !== undefined) {
			axios.get(`${authAPIObj.group}/${authGroup.detailRow}`)
			.then(res => {
				setDetailBackUp(res.data)
				setValueFormat(res.data, control._formValues, setValue, null)
			})
		}
	}, [authGroup])

	return (
		<CardBody >
			{
				authGroup.pageType !== '' && 
					<Fragment>
						{
							authGroup && (authGroup.pageType === 'register' || authGroup.pageType === 'modify') ?
								<GroupForm
									control={control} 
									handleSubmit={handleSubmit} 
									errors={errors}
									setValue={setValue}
									setSubmitResult={setSubmitResult}
									detailBackUp={detailBackUp}
								/>
							:
								<GroupDetail
									control={control} 
									setSubmitResult={setSubmitResult}
								/>
						}
					</Fragment>
			}
		</CardBody>
	)
}

export { Group }
