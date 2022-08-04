const contractRouter = require("express").Router();
const contractController = require("./contract.controller");

contractRouter.get("/getUsersData", contractController.getUsersData);

contractRouter.get("/verify", contractController.verify);

contractController.post("/save", contractController.save);

module.exports = contractRouter;