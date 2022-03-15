const router = require("express").Router({ mergeParams: true });
const theatersRouter = require("../theaters/theaters.router");
const reviewsRouter = require("../reviews/reviews.router");
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/")
    .get(controller.list)
    .all(methodNotAllowed);
    
router.route("/:movieId")
    .get(controller.read)
    .all(methodNotAllowed);

router.use("/:movieId/theaters", controller.movieExists, theatersRouter);

router.use("/:movieId/reviews", controller.movieExists, reviewsRouter);

module.exports = router;