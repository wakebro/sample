export const monthList = [
    { label: '1월', value: 1 },
    { label: '2월', value: 2 },
    { label: '3월', value: 3 },
    { label: '4월', value: 4 },
    { label: '5월', value: 5 },
    { label: '6월', value: 6 },
    { label: '7월', value: 7 },
    { label: '8월', value: 8 },
    { label: '9월', value: 9 },
    { label: '10월', value: 10 },
    { label: '11월', value: 11 },
    { label: '12월', value: 12 }
]

export const yearList = []

const currentYear = new Date().getFullYear()
const startYear = currentYear - 9

for (let year = currentYear; year >= startYear; year--) {
  yearList.push({ label: `${year}년`, value: year })
}


export const conditionalRowStyles = [
  {
    when: row => row.row_type && row.row_type === 'year',
    style: {
      backgroundColor: '#f8f8f8',
      color: 'gray',
      borderRight:'none'
    }
  }
]