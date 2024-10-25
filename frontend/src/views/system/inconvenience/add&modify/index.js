import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router'
import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { Card, CardHeader, CardTitle, Row } from "reactstrap"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import Cause from './CauseForm'
import Repair from './RepairForm'
import Problem from './ProblemForm'
import Normal from './NormalForm'
import EmployeeClass from './EmployeeClassForm'
import EmployeeLevel from './EmployeeLevelForm'
import License from './LicenseForm'
import { validationSchemaInconv, defaultValues } from '../InconData'

const SystemInconvenience = () => {
	const { state } = useLocation()
	const [checkCode, setCheckCode] = useState(false)
	useAxiosIntercepter()
	
	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
		watch
	} = useForm({
		defaultValues: JSON.parse(JSON.stringify(defaultValues[state.key])),
		resolver: yupResolver(validationSchemaInconv[state.key])
	})

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle={state.title} breadCrumbParent='시스템관리' breadCrumbParent2='시설표준정보' breadCrumbActive='유형별 분류' />
				</div>
			</Row>
			<Card>
				<CardHeader>
					<CardTitle className="title">
						{state.title.replace(' 관리', '')}&nbsp;{state.type === 'register' ? '등록' : '수정'}
					</CardTitle>
				</CardHeader>
				{ state.key === 'cause' &&
					<Cause
						state={state}
						control={control} 
						handleSubmit={handleSubmit} 
						errors={errors}
						setCheckCode={setCheckCode}
						checkCode={checkCode}
						setValue={setValue}
						watch={watch('code')}
						/>
				}
				{ state.key === 'repair' &&
					<Repair
						state={state}
						control={control} 
						handleSubmit={handleSubmit} 
						errors={errors}
						setCheckCode={setCheckCode}
						checkCode={checkCode}
						setValue={setValue}
						watch={watch('code')}
						/>
				}
				{ state.key === 'problem' &&
					<Problem
						state={state}
						control={control} 
						handleSubmit={handleSubmit} 
						errors={errors}
						setCheckCode={setCheckCode}
						checkCode={checkCode}
						setValue={setValue}
						watch={watch('code')}
						/>
				}
				{ state.key === 'normal' &&
					<Normal
						state={state}
						control={control} 
						handleSubmit={handleSubmit} 
						errors={errors}
						setCheckCode={setCheckCode}
						checkCode={checkCode}
						setValue={setValue}
						watch={watch('code')}
						/>
				}
				{ state.key === 'employee_class' &&
					<EmployeeClass
						state={state}
						control={control} 
						handleSubmit={handleSubmit} 
						errors={errors}
						setCheckCode={setCheckCode}
						checkCode={checkCode}
						setValue={setValue}
						watch={watch('code')}
						/>
				}
				{ state.key === 'employee_level' &&
					<EmployeeLevel
						state={state}
						control={control} 
						handleSubmit={handleSubmit} 
						errors={errors}
						setCheckCode={setCheckCode}
						checkCode={checkCode}
						setValue={setValue}
						watch={watch('code')}
						/>
				}
				{ state.key === 'license' &&
					<License
						state={state}
						control={control} 
						handleSubmit={handleSubmit} 
						errors={errors}
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
