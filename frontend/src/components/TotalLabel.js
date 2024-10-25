import { Fragment } from "react"
import { Col } from "reactstrap"

const TotalLabel = (props) => {
    const {num, data, unit = '건'} = props

    return (
        <Fragment>
            <Col md={num} className='total-display mb-1'>
                합계 : {data} {unit}
            </Col>
        </Fragment>
    )
}

export default TotalLabel