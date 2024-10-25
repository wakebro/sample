/* eslint-disable */
import { Fragment, useState } from "react"
import { Button } from "reactstrap"
import AlarmMdal from "./AlarmModal"
import { checkApp } from "../../../utility/Utils"

const EmergencyAlarm = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Fragment>
            <Button className={checkApp ? 'mb-2' : ''} color="danger" size="sm" style={{width:'100px', height: '30px'}} onClick={() => setIsOpen(true)}>긴급알림</Button>
            <AlarmMdal 
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </Fragment>
    )
}
export default EmergencyAlarm