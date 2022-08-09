const chatRouter = require("express").Router();
const chatController = require("./chat.controller");

chatRouter.get("/getChatRooms", chatController.getChatRooms);
chatRouter.post("/createChatRoom", chatController.createChatRoom);
chatRouter.post(
  "/getChatRoomOnlineStatus",
  chatController.getChatRoomOnlineStatus
);

module.exports = chatRouter;
