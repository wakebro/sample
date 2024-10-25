// 라인 차트 옵션
export const options = {
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: false
          },
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                boxWidth: 15,
                padding: 10,
                usePointStyle: true
            }
        },
        tooltip:{
            callbacks:{
                label: (context) => {
                    console.log(context)
                    const label = context.dataset.label
                    return `${label} : ${context.formattedValue} K`
                }
            }
        }
    },
    scales: {
        x: {
            display: true
        },
        y: {
            ticks: {
                callback: function(value) {
                    return `${value} K`
                }
            }
        }
    }   
}

// 라인 차트 옵션
export const electricOptions = {
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: false
          },
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                boxWidth: 15,
                padding: 10,
                usePointStyle: true
            }
        },
        tooltip:{
            callbacks:{
                label: (context) => {
                    console.log(context)
                    const label = context.dataset.label
                    return `${label} : ${context.formattedValue} kWh`
                }
            }
        }
    },
    scales: {
        x: {
            display: true
        },
        y: {
            ticks: {
                callback: function(value) {
                    return `${value} kWh`
                }
            }
        }
    }   
}


// 라인 차트 옵션
export const solidOptions = {
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: false
          },
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                boxWidth: 15,
                padding: 10,
                usePointStyle: true
            }
        },
        tooltip:{
            callbacks:{
                label: (context) => {
                    console.log(context)
                    const label = context.dataset.label
                    return `${label} : ${context.formattedValue} Nm³`
                }
            }
        }
    },
    scales: {
        x: {
            display: true
        },
        y: {
            ticks: {
                callback: function(value) {
                    return `${value} Nm³`
                }
            }
        }
    }   
}
// 라인 차트 옵션
export const waterOptions = {
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: false
          },
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                boxWidth: 15,
                padding: 10,
                usePointStyle: true
            }
        },
        tooltip:{
            callbacks:{
                label: (context) => {
                    console.log(context)
                    const label = context.dataset.label
                    return `${label} : ${context.formattedValue} m³`
                }
            }
        }
    },
    scales: {
        x: {
            display: true
        },
        y: {
            ticks: {
                callback: function(value) {
                    return `${value} m³`
                }
            }
        }
    }   
}

// 라인 차트 옵션
export const utilitiesOptions = {
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: false
          },
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                boxWidth: 15,
                padding: 10,
                usePointStyle: true
            }
        },
        tooltip:{
            callbacks:{
                label: (context) => {
                    console.log(context)
                    const label = context.dataset.label
                    return `${label} : ${context.formattedValue}`
                }
            }
        }
    },
    scales: {
        x: {
            display: true
        },
        y: {
            ticks: {
                callback: function(value) {
                    return `${value}`
                }
            }
        }
    }   
}