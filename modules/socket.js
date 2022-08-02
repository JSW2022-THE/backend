const { Server } = require("socket.io");

module.exports = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });
  const chatDB = [];

  io.on("connection", (socket) => {
    console.log("a user connected");
    console.log(socket.id);

    socket.on("joinRoom", (_roomId) => {
      console.log("roomid : " + _roomId);
      socket.emit("getChatData", chatDB);
    });

    socket.on("testSend", (data) => {
      chatDB.push(data);
      io.emit("testSend", data);
    });
  });
};
