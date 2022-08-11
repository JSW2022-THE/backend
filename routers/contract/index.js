const contractRouter = require("express").Router();
const contractController = require("./contract.controller");

contractRouter.get("/access", contractController.accessContract);

contractRouter.get("/verify", contractController.verify);

contractRouter.post("/save", contractController.save);

contractRouter.get("/verify/uuid", contractController.verifyContractUuid);

contractRouter.post("/search", contractController.getContract);

module.exports = contractRouter;
