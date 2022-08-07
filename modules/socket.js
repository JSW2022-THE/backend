const { Server } = require("socket.io");
const { User, Chats, ChatRooms, sequelize } = require("../models");
const { Op } = require("sequelize");
const uuid = require("uuid");

module.exports = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    let user_uuid;
    let isChecker = false;

    console.log("a user connected : " + socket.id);

    //소켓에 연결 후 방에 대한 권한 인증과 방에 JOIN 처리
    socket.on("joinRoom", (_data) => {
      console.log(
        "joinRoom 요청: " +
          "room_id: " +
          _data.room_id +
          " user_uuid: " +
          _data.user_uuid
      );
      user_uuid = _data.user_uuid;
      //joinRoom 이벤트를 보낸 사람의 UUID가 해당 채팅룸에 접근 권한이 있나 쿼리
      ChatRooms.findOne({
        attributes: ["people"],
        where: {
          room_id: _data.room_id,
          people: { [Op.substring]: _data.user_uuid },
        },
      })
        .then((_roomPeopleData) => {
          if (_roomPeopleData) {
            //권한이 있다면
            socket.join(_data.room_id);
            Chats.findAll({
              where: { room_id: _data.room_id },
              order: [["createdAt"]],
            }).then((_chatData) => {
              socket.emit("getChatData", _chatData);
            });
          } else {
            //권한이 없다면 바로 소켓 끊어버리기~
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

    socket.on("onlineChecker", async (_uuid) => {
      user_uuid = _uuid;
      isChecker = true;
      User.update(
        { is_online: true, last_online: null },
        { where: { uuid: _uuid } }
      );
    });

    // 소켓이 연결이 끊어질때
    socket.on("disconnect", (_data) => {
      if (isChecker) {
        User.update(
          { is_online: false, last_online: sequelize.fn("NOW") },
          { where: { uuid: user_uuid } }
        );
      }
      console.log(
        "해당 소켓이 연결이 끊어졌습니다 : " +
          "socket_id: " +
          socket.id +
          " user_uuid: " +
          user_uuid +
          isChecker
      );
    });
  });
};
