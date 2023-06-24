import Chart from 'chart.js/auto';
// Chart JS
const ctx = document.getElementById('myChart');


// export const chartResult = (getTotalNutrient) => {
// 	let myChart = new Chart(ctx, {
// 		type: 'pie',
// 		data: {
// 			labels: ['Calories', 'Fat', 'Carbohydrate', 'Protein'],
// 			datasets: [{
// 				label: '9JA Tracker',
// 				data: getTotalNutrient,
// 				borderWidth: 1,
// 				backgroundColor: [
// 					'rgb(255, 99, 132)',
// 					'rgb(75, 192, 192)',
// 					'rgb(255, 205, 86)',
// 					'rgb(201, 203, 207)'
// 				],
// 				hoverOffset: 4
// 			}]
// 		},
// 		options: {
// 		}
// 	});
	
// }

// export const chartResult = (getTotalNutrient) => {
//   const newData = {
//     labels: ['Calories', 'Fat', 'Carbohydrate', 'Protein'],
//     datasets: [{
//       label: '9JA Tracker',
//       data: getTotalNutrient,
//       borderWidth: 1,
//       backgroundColor: [
//         'rgb(255, 99, 132)',
//         'rgb(75, 192, 192)',
//         'rgb(255, 205, 86)',
//         'rgb(201, 203, 207)'
//       ],
//       hoverOffset: 4
//     }]
//   };
//   // addData(newData);
//   // removeData();
// }

// let myChart = new Chart(ctx, {
//   type: 'pie',
//   data: {}
// });

// console.log(myChart);

// function addData(newData) {
//   console.log(newData.datasets[0].data);
//   myChart.data.labels.push(...newData.labels);
//   myChart.data.datasets.forEach((dataset) => {
//     dataset.data.push(...newData.datasets[0].data);
//   });
//   myChart.update();
// }

// function removeData() {
//   myChart.data.labels.pop();
//   myChart.data.datasets.forEach((dataset) => {
//     dataset.data.pop();
//   });
//   myChart.update();
// }

// const ctx = document.getElementById('myChart');



