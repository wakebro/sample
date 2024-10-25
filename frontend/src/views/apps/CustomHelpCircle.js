import { useEffect, useState } from 'react'
import { HelpCircle } from 'react-feather'
import { UncontrolledTooltip } from "reactstrap"


const CustomHelpCircle = (props) => { // props 필수 id content
    if (!props.content || !props.id) {
        return
    }

    const [contentStr, setContentStr] = useState(props.content)

    useEffect(() => {
        setContentStr(props.content)
	}, [])
    return (
        <>
            <HelpCircle 
                id={props.id} 
                height='17' 
                width='17' 
                style={{
                    marginLeft:'9px', 
                    fill:props?.outColor ? props?.outColor : '#B6B3C1', 
                    stroke: props?.inColor ? props?.inColor : 'white' 
                }} 
            />
            <UncontrolledTooltip placement='bottom' target={props.id} style={{backgroundColor:'white', color:'black', boxShadow: '1px 1px 10px 1px #D5D6D8', borderRadius: '5px'}}>
                {contentStr}
            </UncontrolledTooltip>
        </>
    )
}
export default CustomHelpCircle