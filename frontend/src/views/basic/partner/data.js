export const partnerClassList = [
	{label: '대분류', value: 'main_0'},
	{label: '중분류', value: 'mid_1'},
	{label: '소분류', value: 'sub_2'}
]

export const checkCategory = (bigOption, midOption) => {
	const allBigOptionFilled = bigOption.every(option => option.value !== '' && option.value !== undefined)
	const allMidOptionFilled = midOption.every(option => option.value !== '' && option.value !== undefined)
	if (allBigOptionFilled && allMidOptionFilled) return true
	else return false
}

export const FIRST_HALF = 0
export const SECOND_HALF = 1

export const durationList = [
    {label: '상반기', value:FIRST_HALF},
    {label: '하반기', value:SECOND_HALF}
]
