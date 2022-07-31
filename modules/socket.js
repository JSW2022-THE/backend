const { Server } = require("socket.io");

module.exports = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("a user connected");
    console.log(socket.id);
    socket.on("testSend", (data) => {
      console.log(data);
    });
  });
};
