const db = require("../../models");

// 실제 사용자 라우터 처리 로직
const User = require("../../models").User;
const Resume = require("../../models").Resume;
const Contract = require("../../models").Contract;

const crypto = require("../../modules/crypto");
const _crypto = require("crypto");
const { query } = require("express");

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
  //아래 기능은 상의 필요
  /*predictSalary: function (req, res) {
    if (!req.isAuth) {
      // 로그인 필수
      return res.status(401).json({
        message: "요청을 처리하는 중 오류가 발생하였습니다.",
      });
    }

    if (req.body.contract_uuid == undefined) {
      return res.status(400).json({ message: "uuid를 받지 못했습니다." });
    }

    Contract.findOne({
      where: {
        contract_uuid: req.body.contract_uuid
      }
    }).then(queryRes => {
      if (queryRes == undefined) {
        return res.status(404).json({ message: "찾을 수 없습니다." });
      }
      
      var work_week_time, work_type, wage_type, wage_value;
      work_week_time = crypto.decrypt(queryRes.dataValues.work_week_time); // 주간 일하는 시간, wage_type이 시급일때 하루 단기알바로 치고 계산하겠음.
      work_type = crypto.decrypt(queryRes.dataValues.work_type).replace(/[^0-9\.]+/g, ""); // "주 n회"라는 규격을 가진다고 가정. n만 추출. 하루단기 알바 제외하고 쓸 예정
      wage_type = crypto.decrypt(queryRes.dataValues.wage_type);// 시급?(단기알바?) 일급 주급 월급 연봉 
      wage_value = crypto.decrypt(query.dataValues.wage_value); // 시간당 급여로 치고 계산하겠음.

      var total_salary = 0;

      switch (wage_type) {
        case "시급":
          total_salary = work_week_time*wage_value;
          break;

        case "일급":
          total_salary = work_week_time*wage_value
          break;

        case "주급":

          break;

        case "월급":

          break;

        case "연봉":

          break;

      
        default:
          break;
      }

    }).catch(err => {
      return res.status(500).json({ message: "알 수 없는 오류가 발생했습니다." });
    })
  }*/

  // high cost and very slow function
  getWorkInfo: function (req, res) {
    if (!req.isAuth) {
      // 로그인 필수
      return res.json({
        message: "요청을 처리하는 중 오류가 발생하였습니다.",
      });
    }

    if (
      req.body.company_name == undefined ||
      req.body.ceo_name == undefined ||
      req.body.worker_name == undefined
    )
      return res
        .status(400)
        .json({ message: "필요한 값들 중 일부가 비어있습니다." });

    //이부분 진짜 맘에 안드네
    Contract.findAll({}).then((reqRes) => {
      for (var i = 0; i < reqRes.length; i++) {
        if (
          crypto.decrypt(reqRes[i].dataValues.company_name) ==
            req.body.company_name &&
          crypto.decrypt(reqRes[i].dataValues.ceo_name) == req.body.ceo_name &&
          crypto.decrypt(reqRes[i].dataValues.worker_name) ==
            req.body.worker_name
        ) {
          var finalData = {
            company_name: crypto.decrypt(reqRes[i].dataValues.company_name),
            wage_value: crypto.decrypt(reqRes[i].dataValues.wage_value),
            work_week_time: crypto.decrypt(reqRes[i].dataValues.work_week_time),
            work_start_time: crypto.decrypt(
              reqRes[i].dataValues.work_start_time
            ),
            work_end_time: crypto.decrypt(reqRes[i].dataValues.work_end_time),
          };

          return res.status(200).json(finalData);
        }
      }
    });
  },
};
