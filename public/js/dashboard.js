var ctx = document.getElementById('progress-pie-chart');
var pie_percent = Math.floor(Math.random() * 50) + 25;
document.getElementById('progress-pie-label').innerHTML = pie_percent + '%';

new Chart(ctx, {
	type: 'doughnut',
	data: {
		datasets: [{
			data: [pie_percent, 100 - pie_percent],
			backgroundColor: [
				'#5D84E7',
				'#C3CAD9',
			],
			borderWidth: 0,
			
		}],
	},
	options: {
		cutout: '80%',
		events: [],
		responsive: false,
		plugins: {
			legend: {
				display: false
			},
		}
	}
});

var ctx = document.getElementById('activity-chart');

new Chart(ctx, {
	data: {
		datasets: [{
			type: 'line',
			label: 'Fizz',
			data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 21) + 40),
		}, {
			type: 'line',
			label: 'Buzz',
			data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 21) + 40),
		}, {
			type: 'line',
			label: 'FizzBuzz',
			data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 21) + 40),
		}],
		labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	},
	options: {
		// plugins: {
		// 	legend: {
		// 		display: false
		// 	},
		// }
	}
});

//Form validation
(() => {
	'use strict'
  
	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	const forms = document.querySelectorAll('.needs-validation')
  
	// Loop over them and prevent submission
	Array.from(forms).forEach(form => {
	  form.addEventListener('submit', event => {
		if (!form.checkValidity()) {
		  event.preventDefault()
		  event.stopPropagation()
		}
  
		form.classList.add('was-validated')
	  }, false)
	})
  })()