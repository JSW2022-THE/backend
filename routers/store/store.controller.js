// 실제 가게 라우터 처리 로직
const Store = require("../../models").Store;

module.exports = {
  getInfo: function (req, res) {
    Store.findOne({
      where: {
        id: req.query.target_store_id,
      },
    })
      .then(function (queryRes) {
        if (queryRes != null) res.json(queryRes.dataValues);
        else {
          res.status(404);
          res.json({ message: "존재하지 않는 가게 id 입니다." });
        }
      })
      .catch(function (err) {
        res.status(500);
        res.json({ message: "알 수 없는 오류가 발생했습니다." });
      });
  },
  getInfoByOwnerId: function (req, res) {
    if (!req.isAuth) {
      // 로그인 필수
      return res.status(401).json({
        message: "요청을 처리하는 중 오류가 발생하였습니다.",
      });
    }

    Store.findOne({
      where: { owner_uuid: req.userUuid },
    }).then(function (result) {
      if (result != null) {
        res.json(result);
      } else {
        res.status(404);
        res.json({ message: "존재하지 않는 가게입니다." });
      }
    });
  },
  getAllStores: async function (req, res) {
    Store.findAll({})
      .then(function (queryRes) {
        if (queryRes != "") res.json(queryRes);
      })
      .catch(function (err) {
        res.status(500);
        res.json({ message: "알 수 없는 오류가 발생했습니다." });
      });
  },
  registration: async function (req, res) {
    if (!req.isAuth) {
      // 로그인 필수
      res.status(401);
      return res.json({
        message: "요청을 처리하는 중 오류가 발생하였습니다.",
      });
    }

    var flag = true;

    if (
      req.body.name == "" ||
      req.body.lat == "" ||
      req.body.lon == "" ||
      req.body.description == "" ||
      req.body.address == "" ||
      req.body.name == undefined ||
      req.body.lat == undefined ||
      req.body.lon == undefined ||
      req.body.description == undefined ||
      req.body.address == undefined
    ) {
      res.status(400);
      res.json({ message: "입력값중 일부가 비어있거나 잘못되어있습니다." });
      flag = false;
    }

    if (flag) {
      const dbReqRes = await Store.findOne({
        where: {
          owner_uuid: req.body.userUuid,
        },
      });

      if (dbReqRes == undefined) {
        // 처음 가게 정보 작성시
        await Store.create({
          name: req.body.name,
          lat: req.body.lat,
          lon: req.body.lon,
          description: req.body.description,
          heart: 0,
          address: req.body.address,
          owner_uuid: req.body.userUuid,
        });
        res.status(200);
        res.json({ message: "요청이 잘 수행되었습니다." });
      } else {
        // 이미 존재하는 가게였다면
        var dbReqData = {
          name: dbReqRes.dataValues.name,
          lat: dbReqRes.dataValues.lat,
          lon: dbReqRes.dataValues.lon,
          description: dbReqRes.dataValues.description,
          address: dbReqRes.dataValues.address,
          owner_uuid: dbReqRes.dataValues.userUuid,
        };

        if (dbReqRes.dataValues.name != req.body.name)
          dbReqData.name = req.body.name;

        if (dbReqRes.dataValues.lat != req.body.lat)
          dbReqData.lat = req.body.lat;

        if (dbReqRes.dataValues.lon != req.body.lon)
          dbReqData.lon = req.body.lon;

        if (dbReqRes.dataValues.description != req.body.description)
          dbReqData.description = req.body.description;

        if (dbReqRes.dataValues.address != req.body.address)
          dbReqData.address = req.body.address;

        await Store.update(dbReqData, {
          where: {
            owner_uuid: req.body.userUuid,
          },
        });
        res.status(200);
        res.json({ message: "요청이 잘 수행되었습니다." });
      }
    }
  },
  getNearBy: async function (req, res) {
    if (!req.isAuth) {
      // 로그인 필수
      res.status(401);
      return res.json({
        message: "요청을 처리하는 중 오류가 발생하였습니다.",
      });
    }
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
            Math.pow(Math.sin(deltaLat / 2), 2) +
            Math.cos((userLat * Math.PI) / 180) *
              Math.cos((data.dataValues.lat * Math.PI) / 180) *
              Math.pow(Math.sin(deltaLon / 2));
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
  addHeart: async function (req, res) {
    if (!req.isAuth) {
      // 로그인 필수
      res.status(401);
      return res.json({
        message: "요청을 처리하는 중 오류가 발생하였습니다.",
      });
    }

    if (
      req.body.target_store_id != "" ||
      req.body.target_store_id != undefined
    ) {
      const dbReqRes = await Store.findOne({
        id: req.body.target_store_id,
      });

      if (dbReqRes == undefined) {
        req.status(404);
        req.json({ message: "요청한 가게를 찾을 수 없습니다." });
      } else {
        Store.increment(
          {
            heart: 1,
          },
          {
            where: {
              id: req.body.target_store_id,
            },
          }
        )
          .then(function (result) {
            res.status(200);
            res.json({ message: "요청이 잘 수행되었습니다." });
          })
          .catch(function (err) {
            res.status(500);
            res.json({ message: "알 수 없는 오류가 발생했습니다." });
          });
      }
    }
  },
  modifyStoreInfo: async (req, res) => {
    const modifiedData = req.body;
    Store.update(
      {
        name: modifiedData.name,
        phone_number: modifiedData.phone_number,
        description: modifiedData.description,
        address: modifiedData.address,
        collect_activate: modifiedData.collect_activate,
        collect_money: modifiedData.collect_money,
        collect_desc: modifiedData.collect_desc,
        collect_position: modifiedData.collect_position,
        collect_time: modifiedData.collect_time,
        collect_person_cnt: modifiedData.collect_person_cnt,
      },
      { where: { store_uuid: modifiedData.store_uuid } }
    ).then(() => {
      res.send("스토어정보 업데이트 완료");
    });
  },
};
