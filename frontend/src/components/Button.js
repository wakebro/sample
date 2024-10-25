import { useEffect } from "react"
import { Button, Col } from "reactstrap"

export const RepeatButton = (props) => {
	const {
		list,
		checkedArr,
		setCheckedArr,
		limit
	} = props

	const settingCheckArr = (e, checkArr) => {
		checkArr(arr => [...arr, e.value.toString()])
	}
	const changeCheckedArr = (e, checkArr, setCheckArr) => {
		if (checkArr.includes(e.target.id)) {
			setCheckArr(checkArr.filter(el => el !== e.target.id))
		} else {
			setCheckArr([...checkArr, e.target.id])
		}
	}
	const changeAllCheckArr = (list, checkArr, setCheckArr) => {
		if (list.length === checkArr.length) {
			setCheckArr([])
		} else {
			setCheckArr([])
			list.map((e) => settingCheckArr(e, setCheckArr))
		}
	}

	useEffect(() => {
		if (checkedArr.length === 0) {
			changeAllCheckArr(list, checkedArr, setCheckedArr)
		}
	}, [checkedArr])
	return (
		<Col>
			<Button style={{marginRight:'5px', marginBottom: '5px', fontSize: '16px', padding: '10px', width:'75px'}} className='round' color="primary" 
				onClick={() => changeAllCheckArr(list, checkedArr, setCheckedArr)} id='all'
				// eslint-disable-next-line
				outline={checkedArr.length === list.length ? false : true}>
				전체
			</Button>
		{list.map((data, index) => {
			if (index + 1 <= limit) {
			return (
				<Button key={index} style={{marginRight:'5px', marginBottom: '5px', fontSize: '16px', padding: '10px', width:'75px'}} className='round' color="primary" 
				onClick={(e) => changeCheckedArr(e, checkedArr, setCheckedArr)} id={data.value}
				// eslint-disable-next-line
				outline={checkedArr.includes(data.value.toString()) ? false : true}>
				{data.label}
				</Button>
			)
		}
		})}
		</Col>
	)
}