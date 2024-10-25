import { yupResolver } from "@hookform/resolvers/yup"

import { Fragment, useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from 'react-redux'
import * as yup from 'yup'

import { defaultValues } from '../../data'
import CounterPlanForm from "./counterplan/form/CounterPlanForm"
import EvaluationForm from './evalutaion/form/EvaluationForm'

const EvaluationCounterplanForm = () => {
	const criticalDisaster = useSelector((state) => state.criticalDisaster)
	const [itemsYup, setItemsYup] = useState(yup.object().shape({}))

	// 위험성평가&예방대책 동시사용
	const {
		control,
		formState: { errors },
		handleSubmit,
		setValue,
		unregister,
		watch,
		getValues,
		reset
	} = useForm({
		defaultValues : defaultValues.evaluation,
		resolver: yupResolver(itemsYup)
	})

	return (
		<Fragment>
			{
				criticalDisaster.tab === 'evaluation' &&
				<EvaluationForm
					control={control}
					errors={errors}
					handleSubmit={handleSubmit}
					setValue={setValue}
					unregister={unregister}
					watch={watch}
					getValues={getValues}
					reset={reset}
					/>
				}
			{
				criticalDisaster.tab === 'counterplan' &&
				<CounterPlanForm
					control={control}
					errors={errors}
					handleSubmit={handleSubmit}
					setValue={setValue}
					unregister={unregister}
					watch={watch}
					itemsYup={itemsYup}
					setItemsYup={setItemsYup}
				/>
			}
		</Fragment>
	)
}

export default EvaluationCounterplanForm