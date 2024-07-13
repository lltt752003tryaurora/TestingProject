const pagination = async (req, res, next) => {
	req.page = null;
	req.size = null;

    let { page, size } = req.query;
	page = parseInt(page);
	size = parseInt(size);

	if (size <= 0) size = null;
	if (page <= 0) page = null;
	if (size && page) {
		req.page = page;
		req.size = size;
	}
	next();
}

const filter = async (req, res, next) => {
    let { filter } = req.query;
	req.filter = filter;
	next();
}

const search = async (req, res, next) => {
    let { search } = req.query;
	req.search = search;
	next();
}

const sort = async (req, res, next) => {
	req.sortBy = null;
	req.sortOrder = null;

	let { sortBy, sortOrder } = req.query;
	if (sortBy && sortOrder) {
		req.sortBy = sortBy;
		req.sortOrder = sortOrder;
	}
	next();
}

module.exports = {
    pagination,
	filter,
	search,
	sort,
};