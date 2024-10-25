import { TableNoDataComponent } from '@views/Report/ReportData'
import { useDispatch, useSelector } from "react-redux"
import { Input, Table } from "reactstrap"
import { sweetAlert } from '../../../../../../../../../../utility/Utils'

const ModalEmployeeList = (props) => {
	const {width, list, setList, selectList, setSelectList, handleDisabled} = props
	const dispatch = useDispatch()
	const criticalDisaster = useSelector((state) => state.criticalDisaster)


	function handleCheckbox(user) {
		function checkData(element) {
			if (element.id === user.id) {
				return true
			}
		}
		const userList = [...selectList]

		if (!userList.some(checkData) && criticalDisaster.evaluationSelectWorker.length >= 6) {
            sweetAlert('인원을 초과했습니다.', '선택할 수 있는 인원은 6명입니다.', 'warning')
            return
        }

		const copyData = list.map(obj => ({ ...obj }))
		copyData.filter(copyUser => {
			if (copyUser.id === user.id) {
				if (!copyUser.checked) copyUser.checked = true
				else  copyUser.checked = false
			}
		})
		dispatch(setList(copyData))
		
		if (userList.some(checkData) === true) {
			const deleteData = userList.filter(data => data.id !== user.id)
			dispatch(setSelectList(deleteData))
		} else {
			userList.push({id: user.id, name:user.name, position:user.position})
			dispatch(setSelectList(userList))
		}
	}

	return (
		<>
				{
					width >= 1200 ? 
						<>
							<div style={{height:'400px', overflow:'auto'}}>
								<Table className="mb-0">
									<thead className="test-border">
										<tr style={{textAlign:'center', position:'sticky', top:0, width:'100%'}}>
											<th style={{width:'30%'}}>사용자명(ID)</th>
											<th style={{width:'10%'}}>직급</th>
											<th style={{width:'10%'}}>직종</th>
											<th style={{width:'30%', minWidth:'92px'}}>사용자명(ID)</th>
											<th style={{width:'10%'}}>직급</th>
											<th style={{width:'10%'}}>직종</th>
										</tr>
									</thead>
									<tbody>
										{list && 
											list?.length === 0 ?
												<tr>
													<th colSpan={6}>
														<TableNoDataComponent/>
													</th>
												</tr>
											:
											list.map((user, index) => {
												const count = Math.floor((list.length % 2)) === 0 ? Math.floor((list.length / 2) - 1) : Math.ceil((list.length / 2)) - 1
												const count2 =  Math.floor((list.length % 2)) === 0 ? Math.floor((list.length / 2)) : Math.ceil((list.length / 2))
												return (
													index <= count && (
														<>
															<tr style={{ width:'100%'}}>
																<td style={{width:'30%', padding:'1rem'}}>
																	<div className='form-check'>
																		<Input type='checkbox' id={`disaster-checked-${index + 1}`} disabled={handleDisabled(user)} checked={user.checked} readOnly value={user.checked || ''} onClick={() => handleCheckbox(user)}/>
																		{user.name}
																	</div>
																</td>
																<td className="px-0" style={{width:'10%', textAlign:'center'}}>{user.position}</td>
																<td className="px-0" style={{width:'10%', textAlign:'center'}}>{user.employee_class}</td>
																{ list[index + count2] !== undefined ? (
																	<>
																		<td style={{width:'30%', padding:'1rem'}}>
																			<div className='form-check'>
																				<Input type='checkbox' id={`basic-cb-checked-${index + count2}`} disabled={handleDisabled(list[index + count2])} readOnly checked={list[index + count2].checked} value={list[index + count2].checked || ''} onClick={() => handleCheckbox(list[index + count2])}/>
																				{list[index + count2].name}
																			</div>
																		</td>
																		<td className="px-0" style={{width:'10%', textAlign:'center'}}>{list[index + count2].position}</td>
																		<td className="px-0" style={{width:'10%', textAlign:'center'}}>{list[index + count2].employee_class}</td>
																	</>
																	) 
																: <>
																	<td style={{width:'30%'}}></td>
																	<td style={{width:'10%'}}></td>
																	<td style={{width:'10%'}}></td>
																</>
																}
															</tr>
														</>
														)
												)
											})
										}
									</tbody>
								</Table>
							</div>
						</> 
					: 
					<>
						<div style={{height:'400px', overflow:'auto'}}>
							<Table className="mb-0">
								<thead className="test-border">
									<tr style={{textAlign:'center', position:'sticky', top:0, width:'100%'}}>
										<th style={{width:'30%'}}>사용자명(ID)</th>
										<th style={{width:'10%'}}>직급</th>
										<th style={{width:'10%'}}>직종</th>
									</tr>
								</thead>
								<tbody>
									{ list.map((user, index) => (
										<tr style={{ width:'100%'}}>
											<td style={{width:'30%', padding:'1rem'}}>
												<div className='form-check'>
												<Input type='checkbox' id={`disaster-checked-${index}`} disabled={handleDisabled(user)} checked={user.checked} readOnly value={user.checked || ''} onClick={() => handleCheckbox(user)}/>
												{user.name}
												</div>
											</td>
											<td className="px-0" style={{width:'10%', textAlign:'center'}}>{user.position}</td>
											<td className="px-0" style={{width:'10%', textAlign:'center'}}>{user.employee_class}</td>
										</tr>
									))}
									{ list.length === 0 ? 
										<tr>
											<th colSpan={3}>
												<TableNoDataComponent/>
											</th>
										</tr>
										: 
										''
									}
								</tbody>
							</Table>
						</div>
					</>
				}

		</>
	)
}

export default ModalEmployeeList