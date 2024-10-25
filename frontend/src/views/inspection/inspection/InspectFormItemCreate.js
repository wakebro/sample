import { PlusCircle } from 'react-feather'
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap'
import '../../../assets/scss/style.scss'
// import { ROUTE_PROMOTION_REGISTER } from '../../../../constants';
import * as yup from 'yup'

const InspectFormItemCreate = (props) => {
	const {items, itemsSet, setResolver, resolver, setValue, setQuestionIndex} = props
	const handleCreate = () => {
		const tempItem = [...items]
		let itemIndex = 0
		if (tempItem.length !== 0) {
			itemIndex = tempItem[tempItem.length - 1] + 1
		}
		tempItem.push(itemIndex)
		itemsSet(tempItem)
		
		const currentResolver = yup.object().shape({
			...resolver.schema,
			...resolver.fields,
			[`checkListName${itemIndex}`]: yup.string().required('점검 항목명을 입력해주세요.').min(1, '1자 이상 입력해주세요')
		})

		setValue(`checkListName${itemIndex}`, '')
		setValue(`middleCategory${itemIndex}`, '')
		setValue(`choiceForm_${itemIndex}0`, true)
		setValue(`qaName_${itemIndex}0`, '')
		setValue(`discription_${itemIndex}0`, false)
		setValue(`timeType${itemIndex}`, false)
		setValue(`timeList${itemIndex}`, {label:'00시', value : 0})
		setValue(`multiChoice_${itemIndex}0`, {label : '점수(1~10)', value : 0})
		
		setQuestionIndex(qaIndex => ({
			...qaIndex,
			[`${itemIndex}`] : [0]
		}))
		setResolver(currentResolver)
		
	}
	return (
		<Card className='custom-create-button mb-5' onClick={() => handleCreate()}>
			<Row className="cursor-pointer">
				<CardHeader>
					<CardBody>
						<Col style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
							<PlusCircle size={45} className='custom-create-button-color custom-opacity' style={{marginRight:'20px'}}/>
							<div className='custom-create-button-color' style={{fontSize:'24px'}}>항목 추가</div>
						</Col>
					</CardBody>
				</CardHeader>
			</Row>
		</Card>
	)
}

export default InspectFormItemCreate