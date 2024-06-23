function getUrlQuery(name) {
	const params = new Proxy(new URLSearchParams(window.location.search), {
		get: (searchParams, prop) => searchParams.get(prop),
	});

	return params[name];
}

function setUrlQuery(name, value) {
	const currentUrl = window.location.href;
	const url = new URL(currentUrl);

	url.searchParams.set(name, value);
	
    window.history.pushState({}, '', url);
}

function parseJwt (token) {
	var base64Url = token.split('.')[1];
	var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));

	return JSON.parse(jsonPayload);
}