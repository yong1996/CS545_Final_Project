let bmiChart = new Chart($('#bmi-chart'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'BMI',
            backgroundColor: "#475dda",
            borderColor: "#475dda",
            data: [],
            fill: false,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'BMI Trend'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Date'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'BMI'
                }
            }]
        }
    }
});

let weightChart = new Chart($('#weight-chart'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Weight',
            backgroundColor: "#475dda",
            borderColor: "#475dda",
            data: [],
            fill: false,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Weight Trend'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Date'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Weight in lb'
                }
            }]
        }
    }
});