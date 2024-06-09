
function createProject(e) {
	e.preventDefault()
	e.stopPropagation()
	var form = document.getElementById('create-project-form');
	if (!form.checkValidity()) {
		form.classList.add('was-validated')
		return;
	}
	form.classList.remove('was-validated')

	var myModalEl = document.getElementById('modal');
	var modal = bootstrap.Modal.getInstance(myModalEl);
	modal.hide();

	var name = document.getElementById('name');
	var description = document.getElementById('description');

	var newEl = `
	<a href="/dashboard.html" class="text-decoration-none bg-white rounded bottom-shadow" style="width: 25%; height: 200px;">
		<div class="d-flex flex-column p-4 justify-content-between h-100">
			<div class="d-flex justify-content-between align-items-center">
				<div class="text-gray fw-bold fs-5">
					${name.value}
				</div>
				<button class="btn p-0">
					<img src="/assets/more_x.png" height="30px"/>
				</button>
			</div>
			<div class="d-flex align-items-center justify-content-between">
				<div class="d-flex flex-column lh-1">
					<div class="text-secondary fs-6">
						Tests
					</div>
					<div class="text-gray fw-bold">
						0/0
					</div>
				</div>
				<div class="d-flex flex-column lh-1">
					<div class="text-secondary fs-6">
						Runs
					</div>
					<div class="text-gray fw-bold">
						0
					</div>
				</div>
				<div class="d-flex flex-column lh-1">
					<div class="text-secondary fs-6">
						Issues
					</div>
					<div class="text-gray fw-bold">
						0
					</div>
				</div>
			</div>
			<div class="d-flex">
				<div class="d-flex flex-column lh-1">
					<div class="text-secondary fs-6">
						Last Run
					</div>
					<div class="text-gray fw-bold">
						../../....
					</div>
				</div>

			</div>
		</div>
	</a>
	`
	//Append requirement
	document.getElementById('projects').innerHTML += newEl;

	//Clear form
	name.value = "";
	description.value = "";
}