const reviewRouter = require("express").Router();
const reviewController = require("./review.controller");

reviewRouter.post("/createReview", reviewController.createReview);
reviewRouter.get("/getReviews", reviewController.getReviews);

module.exports = reviewRouter;
