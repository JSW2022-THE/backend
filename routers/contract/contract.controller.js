const Store = require("../../models").Store;
const contract = require("../../models").Contract;
const jwt = require("jsonwebtoken");
//const { json } = require("sequelize/types");
const uuid = require("uuid");
const crypto = require("../../modules/crypto")

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
                res.json({message: "uuid로 가게를 찾을 수 없습니다."});
            } else {
                var contract_token = jwt.sign({
                    name: dbQueryData.dataValues.name,
                    description: dbQueryData.dataValues.description,
                    address: dbQueryData.dataValues.address,
                    owner_uuid: req.body.userUuid,
                    phone_number: dbQueryData.dataValues.phone_number,
                    worker_uuid: req.body.worker_uuid,
                }, process.env.JWT_CONTRACT_SECRET, {
                    expiresIn: "1h", subject: "contract_token",
                });

                res.json({token: contract_token});
            }
        }
    }, verify: function (req, res) {
        if (!req.isAuth) {
            // 로그인 필수
            return res.json({
                message: "요청을 처리하는 중 오류가 발생하였습니다.",
            });
        } else {
            jwt.verify(req.body.contract_token, process.env.JWT_CONTRACT_SECRET, function (err, tokenInfo) {
                if (err) {
                    res.status(404);
                    res.json({result: false});
                } else {
                    res.status(200);
                    res.json({result: true});
                }
            });
        }
    }, save: async function (req, res) {
        if (!req.isAuth) {
            // 로그인 필수
            return res.json({
                message: "요청을 처리하는 중 오류가 발생하였습니다.",
            });
        } else {

            //이하 데이터는 디스코드 대화 내용을 기반으로 json이라고 추정하여 작성됨.

            var contract_body_data = await JSON.parse(req.body.contract_data);

            var db_data = {
                contract_uuid: uuid.v4(),
                company_name: crypto.encrypt(contract_body_data.company_name),
                ceo_name: crypto.encrypt(contract_body_data.ceo_name),
                company_number: crypto.encrypt(contract_body_data.company_number),
                contract_start_date: crypto.encrypt(contract_body_data.contract_start_date),
                contract_end_date: crypto.encrypt(contract_body_data.contract_end_date),
                work_location: crypto.encrypt(contract_body_data.work_location),
                work_info: crypto.encrypt(contract_body_data.work_info),
                work_week_time: crypto.encrypt(contract_body_data.work_week_time),
                work_type: crypto.encrypt(contract_body_data.work_type),
                work_start_time: crypto.encrypt(contract_body_data.work_start_time),
                work_end_time: crypto.encrypt(contract_body_data.work_end_time),
                wage_type: crypto.encrypt(contract_body_data.wage_type),
                wage_value: crypto.encrypt(contract_body_data.wage_value),
                bonus_percent: crypto.encrypt(contract_body_data.bonus_percent),
                wage_send_type: crypto.encrypt(contract_body_data.wage_send_type),
                insurance_goyong: crypto.encrypt(contract_body_data.insurance_goyong),
                insurance_sanjae: crypto.encrypt(contract_body_data.insurance_sanjae),
                insurance_kookmin: crypto.encrypt(contract_body_data.insurance_kookmin),
                insurance_gungang: contract_body_data.insurance_gungang,
                sign_data_url: contract_body_data.sign_data_url,
            };

            // 중복 검사 해야됨
            await contract.create(db_data);
            res.status(200);
            res.json({message: "요청이 잘 수행되었습니다."});
        }
    },
};