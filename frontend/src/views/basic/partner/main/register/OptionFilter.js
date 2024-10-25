import { Fragment, useEffect, useState } from "react"
import { Button, InputGroup, Input, Row, Col } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { API_BASICINFO_GET_OPTIONS } from '../../../../../constants'
import { Plus, X } from 'react-feather'
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'
import axios from '../../../../../utility/AxiosConfig'
import { primaryColor, sweetAlert } from "../../../../../utility/Utils"

const OptionFilter = (props) => {
	useAxiosIntercepter()
	const {bigOption, setBigOption, midOption, setMidOption, smallOption, setSmallOption, questionIndex, setQuestionIndex, checkIndex
	, itemIndex, deleteBigOption, deleteMidOption, deleteSmallOption } = props
	const [selectBigOptionList, setselectBigOptionList] = useState([{label: '대분류', value:''}])
	const [selectMidOptionList, setselectMidOptionList] = useState([{label: '중분류', value:''}])
	const [selectSmallOptionList, setselectSmallOptionList] = useState([{label: '소분류', value:''}])

	const questionIndexCustom = (data, index) => {
		const tempQA = [...questionIndex]
		const position = tempQA.indexOf(index)
		if (data === 'plus') {
			if (bigOption.value === '' || midOption.value === '' || smallOption.value === '') {
				sweetAlert('', `업체구분을 완료 해주세요.`, 'warning', 'center')
				return false
			}
			setQuestionIndex(prevState => [...prevState, tempQA[tempQA.length - 1] + 1])
		} else {
			setQuestionIndex(prevState => prevState.filter(item => item !== index))
			deleteBigOption(prevState => prevState.filter((_, i) => i !== position))
			deleteMidOption(prevState => prevState.filter((_, i) => i !== position))
			deleteSmallOption(prevState => prevState.filter((_, i) => i !== position))
		}

	}

	const questionState = () => {
		if (questionIndex.length === 1) {
			return <Plus color={primaryColor} className='ms-1 cursor-pointer' onClick={() => questionIndexCustom('plus', itemIndex)}/>
		} else {
			if (questionIndex.length === checkIndex + 1) {
				return <Plus color={primaryColor} className='ms-1 cursor-pointer' onClick={() => questionIndexCustom('plus', itemIndex)}/>
			} else {

				return <X className='ms-1 cursor-pointer' onClick={() => questionIndexCustom('minus', itemIndex)}/>
			}
		}
	}


	useEffect(() => {
		axios.get(API_BASICINFO_GET_OPTIONS)
		.then(res => {
			setselectBigOptionList(res.data.big_option)
		})
		.catch(() => {
		})
	}, [])

	useEffect(() => {	
		axios.get(API_BASICINFO_GET_OPTIONS, { params: {bigOption: bigOption.value}})
		.then(res => {
			setselectMidOptionList(res.data.mid_option)
			if (bigOption.value === '') {
				setMidOption(selectMidOptionList[0])
				setSmallOption(selectSmallOptionList[0])
			}
		})
		.catch(() => {
		})
	}, [bigOption.value])

	useEffect(() => {
		axios.get(API_BASICINFO_GET_OPTIONS, { params: {midOption: midOption.value}})
		.then(res => {
			setselectSmallOptionList(res.data.small_option)
			if (midOption.value === '') {
				setSmallOption(selectSmallOptionList[0])
			}
		})
		.catch(() => {
		})
	}, [midOption.value])


	return (
		<Fragment>
			<Row style={{width:'100%'}}>
				<Col md='3' style={{marginRight:'3%'}}>
				<Select
					// key={selectTableList}
					theme={selectThemeColors}
					className='react-select'
					classNamePrefix='select'
					value={bigOption}
					options={selectBigOptionList}
					onChange={(e) => setBigOption(e)}
					isClearable={false}
					styles={{ menuPortal: base => ({ ...base, zIndex: 9999 })}}
				/>
				</Col>
				<Col md='3' style={{marginRight:'3%'}}>
					<Select
						// key={selectTableList}
						theme={selectThemeColors}
						className='react-select'
						classNamePrefix='select'
						value={midOption}
						options={selectMidOptionList}
						onChange={(e) => setMidOption(e)}
						isClearable={false}
						styles={{ menuPortal: base => ({ ...base, zIndex: 9999 })}}
					/>
				</Col>
				<Col md='3'>
					<Select
						// key={selectTableList}
						theme={selectThemeColors}
						className='react-select'
						classNamePrefix='select'
						value={smallOption}
						options={selectSmallOptionList}
						onChange={(e) => setSmallOption(e)}
						isClearable={false}
						styles={{ menuPortal: base => ({ ...base, zIndex: 9999 })}}
					/>
				</Col>
				<Col className="d-flex justify-content-start align-items-center">	
				{questionState()}
				</Col>

			</Row>
		</Fragment>
	)
}

export default OptionFilter

