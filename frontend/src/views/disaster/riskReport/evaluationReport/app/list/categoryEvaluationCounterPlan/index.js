// import { yupResolver } from "@hookform/resolvers/yup"
import { Fragment } from "react"
import { useForm } from "react-hook-form"
import { defaultValues } from "../../../web/data"
import EvaluationAppDetail from "./EvaluationAppDetail"

const EvaluationAppDefault = () => {
	// const criticalDisaster = useSelector((state) => state.criticalDisaster)
	// const [itemsYup, setItemsYup] = useState(yup.object().shape({}))

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
		defaultValues : defaultValues.evaluation
        // ,resolver: yupResolver(itemsYup)
	})

	return (
		<Fragment>
			<EvaluationAppDetail
				control={control}
				errors={errors}
				handleSubmit={handleSubmit}
				setValue={setValue}
				unregister={unregister}
				watch={watch}
				getValues={getValues}
				reset={reset}
				// setItemsYup={setItemsYup}
			/>
		</Fragment>
	)
}

export default EvaluationAppDefault