const { Server } = require("socket.io");
const { Chats, ChatRooms } = require("../models");
const { Op } = require("sequelize");
const uuid = require("uuid");

module.exports = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("a user connected : " + socket.id);

    //소켓에 연결 후 방에 대한 권한 인증과 방에 JOIN 처리
    socket.on("joinRoom", async (_data) => {
      console.log("roomid : " + _data.room_id);
      await ChatRooms.findOne({
        attributes: ["people"],
        where: {
          room_id: _data.room_id,
          people: { [Op.substring]: _data.logged_in_user },
        },
      })
        .then((_roomPeopleData) => {
          if (_roomPeopleData) {
            socket.join(_data.room_id);
            Chats.findAll({
              where: { room_id: _data.room_id },
              order: [["createdAt"]],
            }).then((_chatData) => {
              socket.emit("getChatData", _chatData);
            });
          } else {
            socket.emit("errorHandler", {
              status: 403,
              message: "해당 채팅룸에 접근 권한이 없습니다.",
            });
            socket.disconnect();
          }
        })
        .catch((err) => {
          socket.emit("errorHandler", {
            status: 500,
            message: "서버 내부 오류입니다.",
          });
          console.error(err);
        });

      // const parsedRoomPeopleData = JSON.parse(roomPeopleData.dataValues.people);
      // console.log(
      //   parsedRoomPeopleData.includes("5dd3ac68-ee4d-4d23-9ff4-f24c074395e6")
      // );
    });

    // 클라이언트로 부터 메세지 전송을 받았을때 DB에 저장 후 다른 클라이언트에게 전달
    socket.on("msgSend", async (_data) => {
      const chatId = uuid.v4();
      await Chats.create({
        chat_id: chatId,
        room_id: _data.room_id,
        msg: _data.msg,
        sender_id: _data.sender_id,
      });
      io.to(_data.room_id).emit("msgSend", {
        chat_id: chatId,
        room_id: _data.room_id,
        msg: _data.msg,
        sender_id: _data.sender_id,
      });
    });

    // 소켓이 연결이 끊어질때
    socket.on("disconnect", (_data) => {
      console.log("연결해재 : " + socket.id);
    });
  });
};
