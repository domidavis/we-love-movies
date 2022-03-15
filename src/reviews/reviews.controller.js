const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const res = require("express/lib/response");

async function reviewExists(req, res, next) {
    const foundReview = await service.read(req.params.reviewId);
    if (foundReview) {
        res.locals.review = foundReview;
        return next();
    }
    next({ status: 404, message: `Review cannot be found` });
}

async function list(req, res) {
    const { movieId } = req.params;
    const data = await service.getReviewsByMovie(movieId);
    res.json({ data: data })
}

async function update(req, res) {
    const updatedReview = {
        ...req.body.data,
        review_id: res.locals.review.review_id,
    };
    await service.update(updatedReview);

    const data = await service.readWithCritic(res.locals.review.review_id)
    res.json({ data: data });
}

async function destroy(req, res) {
    const { review } = res.locals;
    await service.delete(review.review_id);
    res.sendStatus(204);
}

module.exports = {
    list: asyncErrorBoundary(list),
    update: [
        asyncErrorBoundary(reviewExists),
        asyncErrorBoundary(update),
    ],
    delete: [
        asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)
    ],
    reviewExists
};