const show404 = (res, message = null) => {
	res.status(404).render('errors/not_found', {
        message: message,
        hideHeader: true,
        title: "Page not found"
    });
}

const show403 = (res, message = null) => {
    res.status(403).render('errors/forbidden', {
        message: message ?? 'You are not authorized to view this resource',
        hideHeader: true,
        title: "Page not found"
    });
}

const show400 = (res, message = null) => {
    res.status(400).render('errors/bad_request', {
        message: message ?? 'Project does not exist, or user is not a project member.',
        hideHeader: true,
        title: "Page not found"
    });
}

module.exports = {
	show404,
    show403,
    show400,
}