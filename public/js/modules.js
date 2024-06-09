let modulesTree = {
	"Middleware": {

	},
	"Bridge": {
		"JNI": {},
		"Native": {},
	},
	"Website": {
		"Server": {

		}
	},
	"Documentation": {
		"Generation": {
			"Javadoc": {

			}
		}
	},
	"Resources": {
		"Attachments": {

		},
		"Notes": {

		}
	},
};


function createModule(e) {
	e.preventDefault()
	e.stopPropagation()
	var form = document.getElementById('create-module-form');
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

	modulesTree[name.value] = {};

	//re render
	document.getElementById('modules').innerHTML = '';
	renderModules();

	//Clear form
	name.value = "";
	description.value = "";
}

function isEmpty(obj) {
	for (const prop in obj) {
		if (Object.hasOwn(obj, prop)) {
			return false;
		}
	}
  
	return true;
}

function toggleArrowShape(self) {
	var arrowEl = self.getElementsByClassName('arrow')[0];
	if (arrowEl.classList.contains('childless'))
		return;
	if (arrowEl.classList.contains('expanded')) {
		arrowEl.src = '/assets/arrow_down.png';
		arrowEl.classList.remove('expanded');
	}
	else {
		arrowEl.src = '/assets/arrow_right.png';
		arrowEl.classList.add('expanded');
	}
}

function renderSubmodule(submodule, parentStr, rootElement, level) {
	for (const [key, value] of Object.entries(submodule)) {
		var hasNoChildren = isEmpty(submodule[key]);
		var newParent = parentStr + key;
		var newEl = `
		<div class="${level > 0 ? 'collapse' : ''}" id="${parentStr}" onclick="toggleArrowShape(this);">
			<button class="btn p-0 d-flex align-items-center gap-2" data-bs-toggle="collapse" data-bs-target="${hasNoChildren ? '' : '#' + newParent}">
				${'<img src="/assets/arrow_none.png" height="20px" />'.repeat(level)}
				<img class="arrow ${hasNoChildren ? 'childless' : ''}" src="${hasNoChildren ? '/assets/arrow_none.png' : '/assets/arrow_down.png'}" height="20px" />
				<img src="/assets/folder.png" height="30px" />
				<div class="text-gray fw-semibold">${key}</div>
			</button>
		</div>
		`
		rootElement.innerHTML += newEl;

		if (!hasNoChildren) {
			renderSubmodule(value, newParent, rootElement, level + 1);
		}
	}
}

function renderModules() {
	var modulesDiv = document.getElementById('modules');

	renderSubmodule(modulesTree, '', modulesDiv, 0);
}

renderModules();