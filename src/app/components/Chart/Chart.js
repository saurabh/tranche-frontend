import React from 'react';
import { Line } from 'react-chartjs-2';
import { ChartWrapper, ChartContent } from './styles/ChartComponents';


function Chart() {
    const options = {
        legend: {
            display: false,
        },
        layout: {
            padding: {
              left: 34,
              right: 34,
              top: 24,
              bottom: 15,
            },
        },
        scales: {
            xAxes: [{
                display: false
            }],
            yAxes: [{
                display: false
            }]
        },
        responsive:true,
        maintainAspectRatio: false
      };
      
      const data = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
        datasets: [
          {
            label: 'Data',
            fill: false,
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#4441CF',
            lineTension: 0.2,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#4441CF',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 13,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#4441CF',
            pointHoverBorderWidth: 3,
            pointRadius: 0,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40, 35, 60, 50, 33, 90, 50, 55, 40, 65, 59, 80, 81, 56, 55, 40, 35, 60, 50, 33, 90, 50, 55, 40, 65, 59, 80, 81, 56, 55, 40, 35, 60, 50, 33, 90, 50, 55, 40, 65, 59, 80, 81, 56, 55, 40, 35, 60, 50, 33, 90, 50, 55, 40]
          }
        ]
      };
  return (
        <ChartWrapper>
            <ChartContent>
                <Line width={100} height={290} data={data} options={options}/>
            </ChartContent>
        </ChartWrapper>
  );
}
export default Chart;
