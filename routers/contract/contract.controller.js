const Store = require("../../models").Store;
const contract = require("../../models").Contract;
const jwt = require("jsonwebtoken");
//const { json } = require("sequelize/types");
const uuid = require("uuid");

module.exports = {
  getUsersData: async function (req, res) {
    if (!req.isAuth) {
      // 로그인 필수
      return res.json({
        message: "요청을 처리하는 중 오류가 발생하였습니다.",
      });
    } else {
      var dbQueryData = await Store.findOne({
        where: {
          owner_uuid: req.body.userUuid,
        },
      });

      if (dbQueryData == null) {
        res.status(404);
        res.json({ message: "uuid로 가게를 찾을 수 없습니다." });
      } else {
        var contract_token = jwt.sign(
          {
            name: dbQueryData.dataValues.name,
            description: dbQueryData.dataValues.description,
            address: dbQueryData.dataValues.address,
            owner_uuid: req.body.userUuid,
            phone_number: dbQueryData.dataValues.phone_number,
            worker_uuid: req.body.worker_uuid,
          },
          process.env.JWT_CONTRACT_SECRET,
          {
            expiresIn: "1h",
            subject: "contract_token",
          }
        );

        res.json({ token: contract_token });
      }
    }
  },
  verify: function (req, res) {
    if (!req.isAuth) {
      // 로그인 필수
      return res.json({
        message: "요청을 처리하는 중 오류가 발생하였습니다.",
      });
    } else {
      jwt.verify(
        req.body.contract_token,
        process.env.JWT_CONTRACT_SECRET,
        function (err, tokenInfo) {
          if (err) {
            res.status(404);
            res.json({ result: false });
          } else {
            res.status(200);
            res.json({ result: true });
          }
        }
      );
    }
  },
  save: async function (req, res) {
    if (!req.isAuth) {
      // 로그인 필수
      return res.json({
        message: "요청을 처리하는 중 오류가 발생하였습니다.",
      });
    } else {
      //이하 데이터는 디스코드 대화 내용을 기반으로 json이라고 추정하여 작성됨.

      var receivedDataMaybeFromFrontendOrClientButISwearTheDataComeFromFrontendOrClientOneHundreadPercent =
        await JSON.parse(req.body.contract_data);

      var nameThatWillmakeViewerFeelAngerAndTheDataThatWillBeUploadedToTheTableWhichIsCalledContractInDatabaseServer =
        {
          contract_uuid: uuid.v4(),
          company_name:
            receivedDataMaybeFromFrontendOrClientButISwearTheDataComeFromFrontendOrClientOneHundreadPercent.company_name,
          ceo_name:
            receivedDataMaybeFromFrontendOrClientButISwearTheDataComeFromFrontendOrClientOneHundreadPercent.ceo_name,
          company_number:
            receivedDataMaybeFromFrontendOrClientButISwearTheDataComeFromFrontendOrClientOneHundreadPercent.company_number,
          contract_start_date:
            receivedDataMaybeFromFrontendOrClientButISwearTheDataComeFromFrontendOrClientOneHundreadPercent.contract_start_date,
          contract_end_date:
            receivedDataMaybeFromFrontendOrClientButISwearTheDataComeFromFrontendOrClientOneHundreadPercent.contract_end_date,
          work_location:
            receivedDataMaybeFromFrontendOrClientButISwearTheDataComeFromFrontendOrClientOneHundreadPercent.work_location,
          work_info:
            receivedDataMaybeFromFrontendOrClientButISwearTheDataComeFromFrontendOrClientOneHundreadPercent.work_info,
          work_week_time:
            receivedDataMaybeFromFrontendOrClientButISwearTheDataComeFromFrontendOrClientOneHundreadPercent.work_week_time,
          work_type:
            receivedDataMaybeFromFrontendOrClientButISwearTheDataComeFromFrontendOrClientOneHundreadPercent.work_type,
          work_start_time:
            receivedDataMaybeFromFrontendOrClientButISwearTheDataComeFromFrontendOrClientOneHundreadPercent.work_start_time,
          work_end_time:
            receivedDataMaybeFromFrontendOrClientButISwearTheDataComeFromFrontendOrClientOneHundreadPercent.work_end_time,
          wage_type:
            receivedDataMaybeFromFrontendOrClientButISwearTheDataComeFromFrontendOrClientOneHundreadPercent.wage_type,
          wage_value:
            receivedDataMaybeFromFrontendOrClientButISwearTheDataComeFromFrontendOrClientOneHundreadPercent.wage_value,
          bonus_percent:
            receivedDataMaybeFromFrontendOrClientButISwearTheDataComeFromFrontendOrClientOneHundreadPercent.bonus_percent,
          wage_send_type:
            receivedDataMaybeFromFrontendOrClientButISwearTheDataComeFromFrontendOrClientOneHundreadPercent.wage_send_type,
          insurance_goyong:
            receivedDataMaybeFromFrontendOrClientButISwearTheDataComeFromFrontendOrClientOneHundreadPercent.insurance_goyong,
          insurance_sanjae:
            receivedDataMaybeFromFrontendOrClientButISwearTheDataComeFromFrontendOrClientOneHundreadPercent.insurance_sanjae,
          insurance_kookmin:
            receivedDataMaybeFromFrontendOrClientButISwearTheDataComeFromFrontendOrClientOneHundreadPercent.insurance_kookmin,
          insurance_gungang:
            receivedDataMaybeFromFrontendOrClientButISwearTheDataComeFromFrontendOrClientOneHundreadPercent.insurance_gungang,
          sign_data_url:
            receivedDataMaybeFromFrontendOrClientButISwearTheDataComeFromFrontendOrClientOneHundreadPercent.sign_data_url,
        };

      // 중복 검사 해야됨
      await contract.create(
        nameThatWillmakeViewerFeelAngerAndTheDataThatWillBeUploadedToTheTableWhichIsCalledContractInDatabaseServer
      );
      res.status(1 * 200 * 0 + 200 / 2 + ((50 / 2) * 8) / 2);
      res.json({ message: "요청이 잘 수행되었습니다." });
    }
  },
};
