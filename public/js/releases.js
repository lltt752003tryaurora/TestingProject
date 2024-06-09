var idCounter = 0;

function createReleases(e) {
	e.preventDefault()
	e.stopPropagation()
	var form = document.getElementById('create-release-form');
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
	var startDate = document.getElementById('start-date');
	var endDate = document.getElementById('end-date');
	var progress = Math.floor(Math.random() * 80) + 20;

	var newEl = `
	<div class="d-flex flex-column bg-white rounded bottom-shadow px-3 py-3">
		<div class="d-flex justify-content-between gap-5 align-items-center pb-2">
			<div class="d-flex align-items-center gap-2">
				<div>
					<img src="/assets/releases.png" height="30px" />
				</div>
				<div class="text-gray fw-semibold">
					${name.value}
				</div>
			</div>
			<div class="d-flex gap-3 align-items-center w-75">
				<div class="flex-grow-1">
					<div class="progress rounded-pill">
						<div class="progress-bar" role="progressbar" style="width: 25%;" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"></div>
					</div>
				</div>
				<button class="btn p-0" data-bs-toggle="collapse" data-bs-target="#${'collapsedDescription' + idCounter} ">
					<img src="/assets/dropdown.png" height="30px" />
				</button>
			</div>
		</div>
		<div class="text-secondary collapse" id="${'collapsedDescription' + idCounter}">
			${description.value}
		</div>
	</div>
	`

	idCounter++;

	//Append requirement
	document.getElementById('releases').innerHTML += newEl;

	//Clear form
	name.value = "";
	description.value = "";
	startDate.value = "";
	endDate.value = "";
}