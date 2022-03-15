const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");
const reduceProperties = require("../utils/reduce-properties");

const addCritic = mapProperties({
    organization_name: "critic.organization_name",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
});

const reduceCritic = reduceProperties("review_id", {
    preferred_name: ["critic", "preferred_name"],
    surname: ["critic", "surname"],
    organization_name: ["critic", "organization_name"]
})

function read(review_id) {
    return knex("reviews").select("*").where({ review_id }).first();
}

function readWithCritic(review_id) {
    return knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select("r.*", "c.*")
        .where({ "r.review_id": review_id })
        .first()
        .then(addCritic);
}

function getReviewsByMovie(movie_id) {
    return knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select("r.*", "c.*")
        .where({ "r.movie_id": movie_id })
        .then(reduceCritic);
}

function update(updatedReview) {
    return knex("reviews")
        .select("*")
        .where({ review_id: updatedReview.review_id })
        .update(updatedReview, "*");
}

function destroy(review_id) {
    return knex("reviews").where({ review_id }).del();
}

module.exports = {
    read,
    readWithCritic,
    getReviewsByMovie,
    update,
    delete: destroy
};