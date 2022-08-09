const { User, ChatRooms } = require("../../models");
const { Op } = require("sequelize");

module.exports = {
  getChatRooms: (req, res) => {
    const user_uuid = req.userUuid;

    res.send(user_uuid);
  },
  createChatRoom: (req, res) => {
    console.log("dd");
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
