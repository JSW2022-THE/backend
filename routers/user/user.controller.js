const db = require("../../models");
const resume = require("../../models/resume");

// 실제 사용자 라우터 처리 로직
const User = require("../../models").User;
const Resume = require("../../models").Resume;

module.exports = {
  getAllUsers: function (req, res) {
    User.findAll({})
      .then(function (queryRes) {
        if (queryRes != "") res.json(queryRes.dataValues);
      })
      .catch(function (err) {
        res.status(404);
      });
  },
  resume: async function (req, res) {
    /**
     * name: DataTypes.STRING,
     * date_or_birth: DataTypes.STRING,
     * address: DataTypes.STRING,
     * etc: DataTypes.STRING(5000),
     */
    var flag = true;

    if (!req.isAuth) {
      // 로그인 필수
      return res.json({
        message: "요청을 처리하는 중 오류가 발생하였습니다.",
      });
    } else {
      if (
        req.body.name == "" ||
        req.body.date_or_birth == "" ||
        req.body.address == "" ||
        req.body.etc == "" ||
        req.body.name == undefined ||
        req.body.date_or_birth == undefined ||
        req.body.address == undefined ||
        req.body.etc == undefined
      ) {
        res.status(400);
        res.json({ message: "입력값중 일부가 비어있거나 잘못되어있습니다." });
        console.log(req.body);
        flag = false;
      }

      if (flag) {
        const dbReqRes = await Resume.findOne({
          where: {
            user_uuid: req.body.userUuid,
          },
        });

        if (dbReqRes == undefined) {
          // 처음 이력서 작성시
          await Resume.create({
            name: req.body.name,
            date_or_birth: req.body.date_or_birth,
            address: req.body.address,
            etc: req.body.etc,
            user_uuid: req.body.userUuid,
          });
          res.status(200);
          res.json({ message: "요청이 잘 수행되었습니다." });
        } else {
          // 기존 유저였다면
          var resumeData = {
            name: dbReqRes.dataValues.name,
            date_or_birth: dbReqRes.dataValues.date_or_birth,
            address: dbReqRes.dataValues.address,
            etc: dbReqRes.dataValues.etc,
          };

          if (dbReqRes.dataValues.name != req.body.name)
            resumeData.name = req.body.name;

          if (dbReqRes.dataValues.date_or_birth != req.body.date_or_birth)
            resumeData.date_or_birth = req.body.date_or_birth;

          if (dbReqRes.dataValues.address != req.body.address)
            resumeData.address = req.body.address;

          if (dbReqRes.dataValues.etc != req.body.etc)
            resumeData.etc = req.body.etc;

          await Resume.update(resumeData, {
            where: {
              user_uuid: req.body.userUuid,
            },
          });
          res.status(200);
          res.json({ message: "요청이 잘 수행되었습니다." });
        }
      }
    }
  },
  getResume: function (req, res) {
    if (!req.isAuth) {
      // 로그인 필수
      return res.json({
        message: "요청을 처리하는 중 오류가 발생하였습니다.",
      });
    }

    if (
      req.query.target_user_uuid != "" ||
      req.query.target_user_uuid != undefined
    ) {
      Resume.findOne({
        where: {
          user_uuid: req.query.target_user_uuid,
        },
      })
        .then(function (queryRes) {
          if (queryRes != null) {
            res.status(200);
            res.json(queryRes.dataValues);
          } else {
            res.status(404);
            res.json({ message: "요청한 데이터를 찾을 수 없습니다." });
          }
        })
        .catch(function (err) {
          res.status(404);
          res.json({ message: "알 수 없는 오류가 발생했습니다." });
        });
    }
  },
  modifyUserInfo: (req, res) => {
    const modifiedData = req.body;
    User.update(
      {
        name: modifiedData.name,
        phone_number: modifiedData.phone_number,
        age: modifiedData.age,
      },
      { where: { uuid: req.userUuid } }
    ).then(() => {
      res.send("유저정보 업데이트 완료");
    });
  },
};
