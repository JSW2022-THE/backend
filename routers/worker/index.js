const workerRouter = require("express").Router();
const workerController = require("./worker.controller");

workerRouter.post("/createWorkerInfo", workerController.createWorkerInfo);

module.exports = workerRouter;
