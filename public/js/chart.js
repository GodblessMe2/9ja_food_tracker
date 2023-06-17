// Chart JS
const ctx = document.getElementById('myChart');

new Chart(ctx, {
	type: 'pie',
	data: {
		labels: ['Calories', 'Fat', 'Carbohydrate', 'Protein'],
		datasets: [{
			label: '9JA Tracker',
			data: [12, 19, 3, 5],
			borderWidth: 1,
			backgroundColor: [
				'rgb(255, 99, 132)',
				'rgb(75, 192, 192)',
				'rgb(255, 205, 86)',
				'rgb(201, 203, 207)'
			],
			hoverOffset: 4
		}]
	},
	options: {
	}
});