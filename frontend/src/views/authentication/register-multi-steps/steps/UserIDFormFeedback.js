import { FormFeedback } from 'reactstrap'

// component
const UserIDFormFeedback = (props) => {

    //console.log(props.errors)
    if (props.errors.userId) {
        const userIdFormFeedbackDiv = <FormFeedback>{props.errors.userId.message}</FormFeedback>
        return userIdFormFeedbackDiv
    }

    if (props.errors.idDuplCheck) {
        const dDuplCheckDiv = <FormFeedback>{props.errors.idDuplCheck.message}</FormFeedback>
        return dDuplCheckDiv
    }

    if (props.errors.idDuplCheckResult) {
        const idDuplCheckResultDiv = <FormFeedback>{props.errors.idDuplCheckResult.message}</FormFeedback>
        return idDuplCheckResultDiv
    }

	return (
        <>
        </>
	)
}

export default UserIDFormFeedback
