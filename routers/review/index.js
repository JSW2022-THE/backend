const reviewRouter = require("express").Router();
const reviewController = require("./review.controller");

reviewRouter.get("/getReviews", reviewController.getReviews);

module.exports = reviewRouter;
