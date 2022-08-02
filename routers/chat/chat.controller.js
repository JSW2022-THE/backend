module.exports = {
  getChatRooms: (req, res) => {
    res.json({ test: "chat test" });
  },
  makeNewChatRoom: (req, res) => {
    console.log("dd");
  },
};
