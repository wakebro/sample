import Breadcrumbs from '@components/breadcrumbs'
import { Fragment } from 'react'
import { Row } from 'reactstrap'

const ImportRegister = () => {
    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='자재현황' breadCrumbParent='시설관리' breadCrumbParent2='자재관리' breadCrumbActive='자재정보' />
                </div>
            </Row>
        </Fragment>
    )
}

export default ImportRegister