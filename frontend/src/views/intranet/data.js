
/** 두개의 Set을 비교하는 함수*/
export function setsAreEqual(set1, set2) {
	if (set1.size !== set2.size) return false
	for (const value of set1) {
		if (!set2.has(value)) return false
	}
	return true
}

export const columns = {
	receiver : [
		{
			name: '직급',
			sortable: true,
			selector: row => row.position,
			width:'25%'
		},
		{
			name: '부서',
			sortable: true,
			selector: row => row.Department
		},
		{
			name: '이름(아이디)',
			sortable: true,
			selector: row => row.name,
			width:'35%'
		}
	]
}