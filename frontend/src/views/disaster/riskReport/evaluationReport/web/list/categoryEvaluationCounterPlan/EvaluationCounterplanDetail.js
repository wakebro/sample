import { Fragment, useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from 'react-redux'

import { checkApp } from "@utils"
import EvaluationDetailApp from "../../../app/list/categoryEvaluationCounterPlan"
import { defaultValues } from '../../data'
import CounterPlanDetail from "./counterplan/detail/CounterPlanDetail"
import EvaluationDetail from './evalutaion/detail/EvaluationDetail'

const EvaluationCounterplanDetail = () => {
	const criticalDisaster = useSelector((state) => state.criticalDisaster)

	// 위험성평가&예방대책 동시사용
	const {
		control,
		formState: { errors },
		handleSubmit,
		setValue,
		watch
	} = useForm({
		defaultValues : defaultValues.evaluation
	})

	// button auth
	const [isSign, setIsSign] = useState(false) // 결재 버튼을 보여줄건지
	const [isInCharge, setIsInCharge] = useState(false) // 담당자인지 

	return (
		<Fragment>
		{/* app */}
			{
				criticalDisaster.tab === 'evaluation' && 
				<>
					{
						!checkApp ? 
							<EvaluationDetail
								control={control}
								errors={errors}
								handleSubmit={handleSubmit}
								setValue={setValue}
								watch={watch}
								isSign={isSign}
								setIsSign={setIsSign}
								isInCharge={isInCharge}
								setIsInCharge={setIsInCharge}
							/>
						:
							<EvaluationDetailApp/>
					}
				</>
			}
			{
				criticalDisaster.tab === 'counterplan' &&
				<CounterPlanDetail
					control={control}
					errors={errors}
					handleSubmit={handleSubmit}
					setValue={setValue}
					watch={watch}
					isSign={isSign}
					setIsSign={setIsSign}
					isInCharge={isInCharge}
					setIsInCharge={setIsInCharge}
					isChargeSign={false}
				/>
			}
		</Fragment>
	)
}

export default EvaluationCounterplanDetail