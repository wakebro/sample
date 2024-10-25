import { yupResolver } from '@hookform/resolvers/yup'
import Breadcrumbs from '@components/breadcrumbs'
import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router'
import { Fragment, useState } from 'react'
import { Card, CardHeader, CardTitle, Row } from "reactstrap"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import axios from 'axios'
import Facility from './FacilityForm'
import CostType from './CostTypeForm'
import CostCategoryType from './CostCategoryForm'
import { validationSchemaInconv, EditValidationSchemaInconv, defaultValues, pageTypeKor } from '../../standard/data'
import { sweetAlert } from '../../../../utility/Utils'

const SystemInconvenience = () => {
	const { state } = useLocation()
	const [checkCode, setCheckCode] = useState(false)
	useAxiosIntercepter()
	
	let yubResolver
	if (state.type === 'register') {
		yubResolver = yupResolver(validationSchemaInconv[state.key])
	} else {
		yubResolver = yupResolver(EditValidationSchemaInconv[state.key])
	}

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
		watch
	} = useForm({
		defaultValues: JSON.parse(JSON.stringify(defaultValues[state.key])),
		resolver: yubResolver
	})

	const handleCheckCode = (inputCode) => { //사용 안하는 함수
		if (inputCode === '' || inputCode === undefined) {
			sweetAlert(``, `작성해주세요`, 'warning')
		} else {
			const tempNum = parseInt(inputCode)
			if (tempNum < 0) {
				sweetAlert(``, `Nope`, 'warning')
			} else {
				axios.get(state.API, {
					params: {
						checkCode: true,
						code:inputCode
					}
				})
				.then(res => {
					if (res.data) {
						sweetAlert(``, `사용 가능한 코드`, 'warning')
						setCheckCode(true)
					} else {
						sweetAlert(``, `중복된 코드`, 'warning')
						setCheckCode(false)
					}
				})
			}
		}
	}

    console.log(state.API)
	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='시설표준정보' breadCrumbParent='시스템관리' breadCrumbParent2='시설표준정보' breadCrumbActive={`${state.title}${pageTypeKor[state.type]}`} />
				</div>
			</Row>
			<Card>
				<CardHeader>
					<CardTitle className="title">
						{state.title}&nbsp;{state.type === 'register' ? '등록' : '수정'}
					</CardTitle>
				</CardHeader>
				{ state.key === 'facility' &&
					<Facility
						state={state}
						control={control} 
						handleSubmit={handleSubmit} 
						errors={errors}
						handleCheckCode={handleCheckCode}
						setCheckCode={setCheckCode}
						checkCode={checkCode}
						setValue={setValue}
						watch={watch('code')}
						/>
				}
				{ state.key === 'costType' &&
					<CostType
						state={state}
						control={control} 
						handleSubmit={handleSubmit} 
						errors={errors}
						handleCheckCode={handleCheckCode}
						setCheckCode={setCheckCode}
						checkCode={checkCode}
						setValue={setValue}
						watch={watch('code')}
					/>
				}
				{ state.key === 'costCategory' &&
					<CostCategoryType
					state={state}
					control={control} 
					handleSubmit={handleSubmit} 
					errors={errors}
					handleCheckCode={handleCheckCode}
					setCheckCode={setCheckCode}
					checkCode={checkCode}
					setValue={setValue}
					watch={watch('code')}
				/>
				}
			</Card>
		</Fragment>
	)
}

export default SystemInconvenience
