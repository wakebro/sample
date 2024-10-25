import { Fragment } from "react"
import { PlusCircle } from "react-feather"
import { CardBody, Col, ModalBody, Row } from "reactstrap"

const ItemLineCreate = (props) => {
	const {
		lines
		, setLines
		, itemId
		, items
		, maxNum
		// , // setValue,
		// , resolver
		// , setResolver
	} = props

	const addLine = () => {
		console.log(items)
		console.log(lines)

		let key = itemId
		if (key === undefined || key === null) key = String(maxNum)
		console.log(key)
		
		let tempLines = []
		if (Object.keys(lines).includes(key)) {
			console.log('true')
			console.log(lines[key])
			tempLines = lines[key]
		}
		
		let itemIndex = 0
		if (tempLines.length !== 0) itemIndex = tempLines[tempLines.length - 1] + 1
		// console.log(itemIndex)
		tempLines.push(itemIndex)
		console.log(tempLines)
		setLines({
			...lines,
			[`${key}`]:[tempLines]
		})

		// console.log(resolver.fields)
		// const currentResolver = yup.object().shape({
		// 	...resolver.fields,
		// 	[]
		// })
	}
	return (
		<Fragment>
			<ModalBody className='promotion-create-button' onClick={() => addLine()}>
				<Row className="cursor-pointer">
					<CardBody>
						<Col style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
							<PlusCircle size={45} className='promotion-create-button-color promotion-opacity' style={{marginRight:'20px'}}/>
							<div className='promotion-create-button-color' style={{fontSize:'24px'}}>항목 추가</div>
						</Col>
					</CardBody>
				</Row>
			</ModalBody>
		</Fragment>
	)
}

export default ItemLineCreate