const chatRouter = require("express").Router();
const chatController = require("./chat.controller");

chatRouter.get("/getChatRooms", chatController.getChatRooms);
chatRouter.post("/makeNewChatRoom", chatController.makeNewChatRoom);

module.exports = chatRouter;
