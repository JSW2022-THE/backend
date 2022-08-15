const knowledgeRouter = require("express").Router();
const knowledgeController = require("./knowledge.controller");

knowledgeRouter.get("/getOne", knowledgeController.getOne);

module.exports = knowledgeRouter;