const contractRouter = require("express").Router();
const contractController = require("./contract.controller");

contractRouter.get("/access", contractController.accessContract);

contractRouter.get("/verify", contractController.verify);

contractRouter.post("/save", contractController.save);

contractRouter.get("/verify/uuid", contractController.verifyContractUuid);

contractRouter.post("/search", contractController.getContract);

// 문자내용에는 있는 confirm부분 빠져있길래 대강 이런느낌이겠구나~ 하고 추가 해놓겠음. (테스트 안해봄)
// contractRouter.post("/confirm", contractController.confirm);
// contract 부분 총 변경점은 confirm 부분 추가와 model에서 isConfirmed 하나 추가
// 코드 리뷰하면서 생각난건데 sequelize findOne 쓴 부분에서 가게 주인 uuid로 가게 목록 가져오는데 가게주가
// 여러 가게를 운영할때면 원하지 않는 가게가 나올 수 있음.
/*
여기서부턴 암호화 안해도 되지 않을까 하는 부분을 뒤에 표시함.
                secret: crypto.decrypt(find_contract.dataValues.secret),
                contract_uuid: find_contract.dataValues.contract_uuid,
                company_name: crypto.decrypt(find_contract.dataValues.company_name),                     !!! 차피 가게 정보에서 가져올 수 있지않나?
                ceo_name: crypto.decrypt(find_contract.dataValues.ceo_name),                             !!! 동일
                company_number: crypto.decrypt(find_contract.dataValues.company_number),                 !!! 동일
                contract_start_date: crypto.decrypt(find_contract.dataValues.contract_start_date),
                contract_end_date: crypto.decrypt(find_contract.dataValues.contract_end_date),
                work_location: crypto.decrypt(find_contract.dataValues.work_location),                   !!! 동일
                work_info: crypto.decrypt(find_contract.dataValues.work_info),
                work_week_time: crypto.decrypt(find_contract.dataValues.work_week_time),
                work_type: crypto.decrypt(find_contract.dataValues.work_type),
                work_start_time: crypto.decrypt(find_contract.dataValues.work_start_time),
                work_end_time: crypto.decrypt(find_contract.dataValues.work_end_time),
                wage_type: crypto.decrypt(find_contract.dataValues.wage_type),
                wage_value: crypto.decrypt(find_contract.dataValues.wage_value),
                bonus_percent: crypto.decrypt(find_contract.dataValues.bonus_percent),
                wage_send_type: crypto.decrypt(find_contract.dataValues.wage_send_type),
                insurance_goyong: find_contract.dataValues.insurance_goyong, // boolean 값이라 암호화 안함
                insurance_sanjae: find_contract.dataValues.insurance_sanjae,
                insurance_kookmin: find_contract.dataValues.insurance_kookmin,
                insurance_gungang: find_contract.dataValues.insurance_gungang,
                sign_data_url: find_contract.dataValues.sign_data_url, // 서명 data url
                rest_start_time: crypto.decrypt(find_contract.dataValues.rest_start_time),
                rest_end_time: crypto.decrypt(find_contract.dataValues.rest_end_time),
                document_family: find_contract.dataValues.document_family, // boolean 값이라 암호화 안함
                document_agreement: find_contract.dataValues.document_agreement,
                worker_name: crypto.decrypt(find_contract.dataValues.worker_name),
                work_rest_day: crypto.decrypt(find_contract.dataValues.work_rest_day),
*/
contractRouter.post("/confirm/:contract_uuid", contractController.confirm);

module.exports = contractRouter;
