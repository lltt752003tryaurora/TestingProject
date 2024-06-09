//Form validation
// (() => {
// 	'use strict'
  
// 	// Fetch all the forms we want to apply custom Bootstrap validation styles to
// 	const forms = document.querySelectorAll('.needs-validation')
  
// 	// Loop over them and prevent submission
// 	Array.from(forms).forEach(form => {
// 	  form.addEventListener('submit', event => {
// 		console.log("Hey");
// 		if (!form.checkValidity()) {
// 		  event.preventDefault()
// 		  event.stopPropagation()
// 		}
  
// 	  }, false)
// 	})
//   })()

function createRequirement(e) {
	e.preventDefault()
	e.stopPropagation()
	var form = document.getElementById('create-requirement-form');
	if (!form.checkValidity()) {
		form.classList.add('was-validated')
		return;
	}
	form.classList.remove('was-validated')

	var myModalEl = document.getElementById('modal');
	var modal = bootstrap.Modal.getInstance(myModalEl);
	modal.hide();

	var contentEmpty = document.getElementById('content-empty');
	contentEmpty.classList.add("d-none");

	var name = document.getElementById('name');
	var description = document.getElementById('description');

	var newEl = `
	<div class="d-flex flex-column bg-white rounded bottom-shadow ps-4 pe-2 py-3">
		<div class="d-flex justify-content-between align-items-center pb-2">
			<div class="text-gray fw-semibold fs-5">
				${name.value}
			</div>
			<div class="d-flex gap-1">
				<button class="btn p-0">
					<img src="/assets/url.png" height="20px" />
				</button>
				<button class="btn p-0">
					<img src="/assets/edit.png" height="20px" />
				</button>
				<button class="btn p-0">
					<img src="/assets/trash.png" height="20px" />
				</button>
				<button class="btn p-0">
					<img src="/assets/more.png" height="20px" />
				</button>
			</div>
		</div>
		<div class="text-secondary">
			${description.value}
		</div>
	</div>
	`
	//Append requirement
	document.getElementById('requirements').innerHTML += newEl;

	//Clear form
	name.value = "";
	description.value = "";
}