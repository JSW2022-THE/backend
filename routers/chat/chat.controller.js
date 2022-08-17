const { User, ChatRooms, Chats } = require("../../models");
const { Op } = require("sequelize");
const uuid = require("uuid");

module.exports = {
  getChatRooms: async (req, res) => {
    const user_uuid = req.userUuid;
    let resultChatData = [];

    //user_uuid가 포함되어있고, status가 open인 데이터만 쿼리
    const chatRoomData = await ChatRooms.findAll({
      attributes: ["room_id", "people", "recent_msg", "recent_msg_at"],
      where: { people: { [Op.substring]: user_uuid }, status: "open" },
    });

    chatRoomData.map((_data) => {
      let peopleNames = [];
      const parsedChatRoomPeople = JSON.parse(_data.people);
      const filteredChatRoomPeople = parsedChatRoomPeople.filter(
        (i) => i.uuid !== user_uuid
      );
      filteredChatRoomPeople.map((i) => {
        peopleNames.push(i.name);
      });

      resultChatData.push({
        room_id: _data.room_id,
        people_names: peopleNames,
        recent_msg: _data.recent_msg,
        recent_msg_at: _data.recent_msg_at,
      });
    });
    console.log;

    res.json({ status: 200, data: resultChatData });
  },

  createChatRoom: async (req, res) => {
    const createdRoomId = uuid.v4();
    if (!req.isAuth) return res.status(403).send("로그인하고 오세요");

    const user_uuid = req.userUuid;
    const user_name = await User.findOne({
      attributes: ["name"],
      where: { uuid: user_uuid },
    });

    const target_uuid = req.body.target_uuid;
    const target_name = await User.findOne({
      attributes: ["name"],
      where: { uuid: target_uuid },
    });

    const peopleDataStringfy = JSON.stringify([
      { uuid: user_uuid, name: user_name },
      { uuid: target_uuid, name: target_name },
    ]);
    ChatRooms.create({
      room_id: createdRoomId,
      people: peopleDataStringfy,
      status: "open",
      creator: user_uuid,
    }).then(() => {
      res.status(200).json({
        status: 200,
        message: "채팅룸을 잘 만들었습니다.",
        created_chat_room_id: createdRoomId,
      });
    });
  },

  getChatRoomOnlineStatus: async (req, res) => {
    const user_uuid = req.userUuid;
    const room_id = req.body.room_id;
    let chatRoomPeopleUuid = [];

    const chatRoomPeople = await ChatRooms.findOne({
      attributes: ["people"],
      where: { room_id: room_id, people: { [Op.substring]: user_uuid } },
    });
    if (!chatRoomPeople) {
      return res.status(403).json({ status: 403, message: "접근 권한 없음" });
    }
    const parsedChatRoomPeople = JSON.parse(chatRoomPeople.dataValues.people);

    const filteredChatRoomPeople = parsedChatRoomPeople.filter(
      (i) => i.uuid !== user_uuid
    );

    filteredChatRoomPeople.map((i) => {
      chatRoomPeopleUuid.push(i.uuid);
    });

    const onlineStatusArray = await User.findAll({
      attributes: ["uuid", "name", "is_online", "last_online"],
      where: { uuid: chatRoomPeopleUuid },
    });

    res.json({ status: 200, data: onlineStatusArray });
  },
};
