const { Server } = require("socket.io");
const { Chats } = require("../models");
const uuid = require("uuid");

module.exports = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("a user connected");
    console.log(socket.id);

    socket.on("joinRoom", async (_roomId) => {
      console.log("roomid : " + _roomId);
      socket.join(_roomId);
      const chatData = await Chats.findAll({ where: { room_id: _roomId } });
      socket.emit("getChatData", chatData);
    });

    socket.on("msgSend", async (_data) => {
      await Chats.create({
        chat_id: uuid.v4(),
        room_id: _data.roomId,
        msg: _data.msg,
        sender_id: _data.senderId,
      });
      io.to(_data.roomId).emit("msgSend", _data);
    });
  });
};
