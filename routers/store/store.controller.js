// 실제 가게 라우터 처리 로직
const Store = require("../../models").Store;
const uuid = require("uuid");
const jwt = require("jsonwebtoken");

module.exports = {
  getInfo: function (req, res) {
    Store.findOne({
      where: {
        id: req.query.id,
      },
    })
      .then(function (queryRes) {
        if (queryRes != null) res.json(queryRes);
        else {
          res.status(404);
          res.json({ message: "존재하지 않는 가게 id 입니다." });
        }
      })
      .catch(function (err) {
        res.status(404);
        res.json({ message: "알 수 없는 오류가 발생했습니다." });
      });
  },
  getInfoByOwnerId: (req, res) => {
    const userAccessToken = req.cookies.access_token;
    const decoded = jwt.decode(userAccessToken);
    const user_uuid = decoded.user_uuid;
    Store.findAll({
      where: { owner_uuid: user_uuid },
    }).then((result) => {
      if (result != null) {
        res.json(result);
      } else {
        res.status(404).json({ message: "존재하지 않는 가게입니다." });
      }
    });
  },
  getAllStores: async function (req, res) {
    Store.findAll({})
      .then(function (queryRes) {
        if (queryRes != "") res.json(queryRes);
      })
      .catch(function (err) {
        res.status(404);
      });
  },
  add: async function (req, res) {
    console.log("DODODODODODODO");
  },
  getNearBy: async function (req, res) {
    var flag = true;
    var favoriteDistance = 1.0; // 기본 1km
    var nearByStoresContainer = new Array();

    if (req.query.lat == undefined || req.query.lon == undefined) flag = false;
    if (req.query.dis != undefined) favoriteDistance = req.query.dis;

    if (flag) {
      let userLat = Number(req.query.lat);
      let userLon = Number(req.query.lon);
      const queryRes = await Store.findAll({});

      if (queryRes != null) {
        await queryRes.forEach(function (data) {
          var x1 = userLat - data.dataValues.lat;
          var x2 = userLon - data.dataValues.lon;
          var deltaLat = (x1 * Math.PI) / 180;
          var deltaLon = (x2 * Math.PI) / 180;
          var a =
            Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos((userLat * Math.PI) / 180) *
              Math.cos((data.dataValues.lat * Math.PI) / 180) *
              Math.sin(deltaLon / 2) *
              Math.sin(deltaLon / 2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          var d = 6371 * c;

          if (d < favoriteDistance) {
            nearByStoresContainer.push(data);
          }
        });
      }
    }
    await res.json(nearByStoresContainer);
  },
};
