import { Lock, XCircle } from 'react-feather'
import { useDispatch } from "react-redux"

const ModalSelectEmployee = (props) => {
    const { list, setList, selectList, setSelectList, handleDisabled } = props
	const dispatch = useDispatch()

	function onRemoveUser(user) {
        const copyData = list.map(obj => ({ ...obj }))
		copyData.map(copyUser => {
			if (copyUser.id === user.id) {
				copyUser.checked = false
			}
		})
		dispatch(setList(copyData))
		const deleteData = selectList.filter(data => data.id !== user.id)
		dispatch(setSelectList(deleteData))
	}

	return (
		<div className="mt-1">
			<div className='form-control hidden-scrollbar' style={{ display: 'flex', alignItems: 'center', height:'3.1rem', whiteSpace:'nowrap', overflowX:'scroll'}}>
				{selectList && selectList.map(employee => (
					<div key={employee.name}>
						{employee.name}
						{
							!handleDisabled(employee) ?
							<XCircle className='me-1' size={21} onClick={() => onRemoveUser(employee)} style={{ cursor: 'pointer'}}/>
							:
							<Lock className='me-1' size={21} style={{ cursor: 'pointer'}}/>
						}
					</div>
				))}
			</div>
		</div>
	)
}

export default ModalSelectEmployee