const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
    const foundMovie = await service.read(req.params.movieId);
    if (foundMovie) {
        res.locals.movie = foundMovie;
        return next();
    }
    next({ status: 404, message: `Movie not found` });
}
async function list(req, res) {
    const { is_showing } = req.query;

    if (is_showing) {
        res.json({ data: await service.listIsShowing()});
    }
    else {
        res.json({ data: await service.list() });
    }
}

async function read(req, res) {
    res.json({ data: res.locals.movie });
}

module.exports = {
    movieExists,
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)]
};