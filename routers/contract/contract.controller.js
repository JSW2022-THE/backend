const { Store, User, contractStore } = require("../../models");
const contract = require("../../models").Contract;
const jwt = require("jsonwebtoken");
//const { json } = require("sequelize/types");
const uuid = require("uuid");
const crypto = require("../../modules/crypto")
const _crypto = require("crypto")
const axios = require("axios")
const CryptoJS = require("crypto-js");
//솔라피 문자 발송
const { SolapiMessageService } = require("solapi");
const messageService = new SolapiMessageService(process.env.SOLAPI_API_KEY, process.env.SOLAPI_API_SECRET);

module.exports = {
    accessContract: async function (req, res) {
        if (!req.isAuth || req.userUuid == undefined) {
            // 로그인 필수
            return res.json({
                message: "요청을 처리하는 중 오류가 발생하였습니다.",
            });
        }
        let search_store = await Store.findOne({ // 고용주가 가게 여러개 내버리면?
            where: {
                owner_uuid: req.userUuid,
            },
        });
        if (search_store == undefined) {
            return res.json({ message: "요청을 처리하는 중 오류가 발생하였습니다." });
        }
        let search_worker = await User.findOne({
            where: {
                uuid: req.headers.worker_uuid
            }
        })
        if (search_worker == undefined) {
            return res.json({ message: "요청을 처리하는 중 오류가 발생하였습니다." });
        }
        let search_user = await User.findOne({ // 고용주
            where: {
                uuid: req.userUuid
            }
        })

        let token_data = {
            ceo_name: search_user.dataValues.name, // owner == ceo
            worker_name: search_worker.dataValues.name,
            store_name: search_store.dataValues.name,
            address: search_store.dataValues.address,
            phone_number: search_store.dataValues.phone_number,
            owner_uuid: req.userUuid,
            worker_uuid: req.headers.worker_uuid,
            store_uuid: search_store.store_uuid,
        };
        let token = _crypto.randomBytes(20).toString('hex')
        await req.redis_client.set(`contract_access_token_${token}`, crypto.encrypt(JSON.stringify(token_data)))
        await req.redis_client.expire(`contract_access_token_${token}`, 60 * 60 * 24) // 24시간

        res.json({ token: token });
    },
    verify: async function (req, res) { // 계약서 생성 때 사용하는거
        if (!req.isAuth) {
            // 로그인 필수
            return res.json({
                message: "요청을 처리하는 중 오류가 발생하였습니다.",
            });
        } else {
            if (req.headers.contract_token == undefined) {
                return res.json({ message: '요청을 처리하는 중 오류가 발생하였습니다.' })
            }
            let { contract_token } = req.headers
            let token_data = await req.redis_client.get(`contract_access_token_${contract_token}`)
            if (token_data == undefined) {
                console.log(token_data)
                return res.json({ result: false })
            }
            console.log(crypto.decrypt(token_data))
            token_data = JSON.parse(crypto.decrypt(token_data))
            return res.json({ result: true, ...token_data })
        }
    },
    verifyContractUuid: async function (req, res) { // 계약서 확인할 때 사용
        // if (!req.isAuth || req.headers.contract_uuid == undefined) {
        //     // 로그인 필수
        //     return res.json({
        //         message: "요청을 처리하는 중 오류가 발생하였습니다.",
        //     });
        // }

        // @@ 조회는 SMS로 전달받은 인증코드 4자리가 있어야 확인이 가능하므로
        // @@ 사용자 편의성을 위해 로그인 하지 않아도 볼 수 있도록 함.

        let search_contract = await contract.findOne({
            where: {
                contract_uuid: req.headers.contract_uuid
            }
        })
        if (search_contract != undefined) {
            return res.json({ result: true })
        } else {
            return res.json({ result: false })
        }
    },
    confirmContract: async function (req, res) {
        // 로그인 확인 필요 없음
        if (req.body.contract_uuid == undefined) {
            return res.json({
                message: '요청을 처리하는 중 오류가 발생하였습니다.'
            })
        }

        console.log(req.body.secret)
        let findContract = await contract.findOne({
            where: {
                contract_uuid: req.body.contract_uuid,
                secret: crypto.encrypt(req.body.secret)
            },
        })

        if( findContract == undefined) {
            return res.json({
                message: '요청을 처리하는 중 오류가 발생하였습니다.' // 비밀번호, uuid 둘 중 하나라도 안맞으면 전송
            })
        }

        try {
            await contractStore.create({
                store_uuid: findContract.dataValues.company_uuid,
                worker_uuid: req.body.worker_uuid,
                contract_uuid: req.body.contract_uuid
            })

            await contract.update({
                isConfirmed: true,
                worker_sign_data_url: req.body.worker_sign_data_url
            }, {
                where: {
                    contract_uuid: req.body.contract_uuid
                }
            })

            res.json({
                status:'ok'
            })

            // [SMS전송-옵션1] SOLAPI
            let worker_info = await User.findOne({
                where: {
                    uuid: findContract.dataValues.worker_uuid
                }
            })
            let owner_info = await User.findOne({
                where: {
                    uuid: findContract.dataValues.owner_uuid,
                }
            })
            messageService.send([
                {
                    from: process.env.SOLAPI_API_FROM_NUMBER,
                    to: worker_info.phone_number,
                    text: `안녕하세요 근로자님!, 전자근로계약서가 ${findContract.dataValues.worker_name}님 에게 도착했어요. 계약이 방금 [체결] 되었습니다.\r\n\r\n근로계약서 확인: https://jsw2022.hserver.kr/contract/confirm/${req.body.contract_uuid}?check=true`,
                    //subject: "문자 제목" // 제목쓰면 내용이 짧아도 자동으로 LMS로 넘어감. 쓰지마셈.
                },
                // 배열형태로 최대 10,000건까지 동시 전송가능
            ]).then(res => console.log(res.groupInfo.log[1].message + "\n" + res.groupInfo.log[2].message));
            messageService.send([
                {
                    from: process.env.SOLAPI_API_FROM_NUMBER,
                    to: owner_info.phone_number,
                    text: `안녕하세요 사업주ㅎ님!, 전자근로계약서가 ${findContract.dataValues.worker_name}님 에게 도착했어요. 계약이 방금 [체결] 되었습니다.\r\n\r\n근로계약서 확인: https://jsw2022.hserver.kr/contract/confirm/${req.body.contract_uuid}?check=true`,
                    //subject: "문자 제목" // 제목쓰면 내용이 짧아도 자동으로 LMS로 넘어감. 쓰지마셈.
                },
                // 배열형태로 최대 10,000건까지 동시 전송가능
            ]).then(res => console.log(res.groupInfo.log[1].message + "\n" + res.groupInfo.log[2].message));
        } catch (e) {
            return res.json({
                status: 'bad'
            })
        }

    },
    getContract: async function (req, res) {
        // if (!req.isAuth || req.body.code == undefined || req.body.contract_uuid == undefined) {
        //     // 로그인 필수
        //     return res.json({
        //         message: "요청을 처리하는 중 오류가 발생하였습니다.",
        //     });
        // }

        // @@ 조회는 SMS로 전달받은 인증코드 4자리가 있어야 확인이 가능하므로
        // @@ 사용자 편의성을 위해 로그인 하지 않아도 볼 수 있도록 함.
        let find_contract = await contract.findOne({
            where: {
                contract_uuid: req.body.contract_uuid,
                secret: crypto.encrypt(req.body.code)
            }
        })
        if (find_contract == undefined) {
            return res.json({
                verify: false
            })
        } else {
            let db_data = { // 필요한 부분만 암호화 하면 될거같은데
                worker_uuid: find_contract.dataValues.worker_uuid,
                company_uuid: find_contract.dataValues.company_uuid,
                secret: crypto.decrypt(find_contract.dataValues.secret),
                contract_uuid: find_contract.dataValues.contract_uuid,
                company_name: crypto.decrypt(find_contract.dataValues.company_name),
                ceo_name: crypto.decrypt(find_contract.dataValues.ceo_name),
                company_number: crypto.decrypt(find_contract.dataValues.company_number),
                contract_start_date: crypto.decrypt(find_contract.dataValues.contract_start_date),
                contract_end_date: crypto.decrypt(find_contract.dataValues.contract_end_date),
                work_location: crypto.decrypt(find_contract.dataValues.work_location),
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
            };
            delete db_data.secret
            db_data.insurance = {
                goyong: db_data.insurance_goyong,
                gungang: db_data.insurance_gungang,
                kookmin: db_data.insurance_kookmin,
                sanjae: db_data.insurance_sanjae,
            }
            db_data.document = {
                family: db_data.document_family,
                agreement: db_data.document_agreement,
            }
            delete db_data.insurance_goyong
            delete db_data.insurance_gungang
            delete db_data.insurance_kookmin
            delete db_data.insurance_sanjae
            delete db_data.document_family
            delete db_data.document_agreement
            return res.json({
                verify: true,
                ...db_data
            })
        }
    },
    save: async function (req, res) {
        if (!req.isAuth) {
            // 로그인 필수
            return res.json({
                message: "요청을 처리하는 중 오류가 발생하였습니다.",
            });
        } else {
            let contract_body_data = req.body
            let contract_uuid = uuid.v4()
            let contract_secret = Math.floor(1000 + Math.random() * 9000)
            contract_secret = contract_secret.toString()
            let db_data = {
                insurance: {
                    sanjae: false,
                    gungang: false,
                    goyong: false,
                    kookmin: false
                },
                document: {
                    agreement: false,
                    family: false,
                }
            }
            db_data = {
                ...db_data,
                owner_uuid: contract_body_data.ceo_uuid,
                worker_uuid: contract_body_data.worker_uuid,
                company_uuid: contract_body_data.company_uuid,
                secret: crypto.encrypt(contract_secret), // 접근인증번호도 string 형식으로 저장됨
                contract_uuid: contract_uuid, // uuid는 제외
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
                insurance_goyong: contract_body_data.insurance.goyong, // boolean 값이라 암호화 안함
                insurance_sanjae: contract_body_data.insurance.sanjae,
                insurance_kookmin: contract_body_data.insurance.kookmin,
                insurance_gungang: contract_body_data.insurance.gungang,
                sign_data_url: contract_body_data.sign_data_url, // 서명 data url
                rest_start_time: crypto.encrypt(contract_body_data.rest_start_time),
                rest_end_time: crypto.encrypt(contract_body_data.rest_end_time),
                document_family: contract_body_data.document.family, // boolean 값이라 암호화 안함
                document_agreement: contract_body_data.document.agreement,
                worker_name: crypto.encrypt(contract_body_data.worker_name),
                work_rest_day: crypto.encrypt(contract_body_data.work_rest_day),
            };
            await contract.create(db_data);
            // 계약서 redis 정보 삭제
            console.log(`contract_access_token_${req.body.contract_access_token}`)
            await req.redis_client.del(`contract_access_token_${req.body.contract_access_token}`)
            console.log("방근 만들어진 계약서 접속 인증번호: " + contract_secret)
            console.log("그리고 계약서 uuid: " + contract_uuid)
            res.json({ status: 'success' }) // 여기서 요청 보내주고 아래에서 문자는 돌아감.

            let worker_uuid = contract_body_data.worker_uuid;
            let owner_uuid = contract_body_data.ceo_uuid
            let worker_info = await User.findOne({
                where: {
                    uuid: worker_uuid
                }
            })
            let owner_info = await User.findOne({
                where: {
                    uuid: owner_uuid
                }
            })
            // [SMS전송-옵션1] SOLAPI
            messageService.send([
                {
                    from: process.env.SOLAPI_API_FROM_NUMBER,
                    to: worker_info.phone_number,
                    text: `안녕하세요, 전자근로계약서가 ${worker_info.name}님 에게 도착했어요. 아래 주소에서 내용을 확인 후, 동의한다면 동의 버튼을 눌러주세요.\r\n\r\n- 주소: https://jsw2022.pages.dev/contract/confirm/${contract_uuid}\r\n- 접속 인증번호: ${contract_secret}\r\n- 동의 시 계약은 즉시 체결되며, 계약서를 확인할 수 있는 주소를 문자로 보내드립니다.`,
                    //subject: "문자 제목" // 제목쓰면 내용이 짧아도 자동으로 LMS로 넘어감. 쓰지마셈.
                },
                // 배열형태로 최대 10,000건까지 동시 전송가능
            ]).then(res => console.log(res.groupInfo.log[1].message + "\n" + res.groupInfo.log[2].message));


            // [SMS 전송-옵션2] - 네이버 클라우드 플랫폼 이용 // 비용문제로 진짜 테스트하거나 시연할 때 아니면 주석처리.
            // let worker_uuid = contract_body_data.worker_uuid;
            // let owner_uuid = contract_body_data.ceo_uuid
            // let worker_info = await User.findOne({
            //     where: {
            //         uuid: worker_uuid
            //     }
            // })
            // let owner_info = await User.findOne({
            //     where: {
            //         uuid: owner_uuid
            //     }
            // })
            // // very very thanks for https://velog.io/@ssumniee/node.js-서버에-SMS-인증-구현하기
            // let date = Date.now().toString();
            // let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, process.env.NAVER_CLOUD_PLATFORM_SECRET);
            // hmac.update('POST');
            // hmac.update(' ');
            // hmac.update(`/sms/v2/services/${process.env.NAVER_CLOUD_PLATFORM_SMS_ID}/messages`);
            // hmac.update('\n');
            // hmac.update(date);
            // hmac.update('\n');
            // hmac.update(process.env.NAVER_CLOUD_PLATFORM_ACCESS);
            // let hash = hmac.finalize();
            // let signature = hash.toString(CryptoJS.enc.Base64);
            //
            // // 근로자 전송 후 고용주 전송 순서로.
            // axios({
            //     method: 'post',
            //     url: `https://sens.apigw.ntruss.com/sms/v2/services/${process.env.NAVER_CLOUD_PLATFORM_SMS_ID}/messages`,
            //     headers: {
            //         "Content-Type": "application/json; charset=utf-8",
            //         "x-ncp-apigw-timestamp": date,
            //         "x-ncp-iam-access-key": process.env.NAVER_CLOUD_PLATFORM_ACCESS,
            //         "x-ncp-apigw-signature-v2": signature
            //     },
            //     data: {
            //         // type: "SMS"
            //         // type: "LMS", // LMS 너무 비싸.. 실제 사용할 때나 중요할 때 빼고 사용하지 말것...
            //         // contentType: "COMM",
            //         countryCode: "82",
            //         from: process.env.NAVER_CLOUD_PLATFORM_SMS_NUMBER,
            //         subject: "[굿잡] 전자근로계약서가 도착하였습니다.",
            //         content: `안녕하세요, 전자근로계약서가 ${worker_info.name}님 에게 도착했어요. 아래 주소에서 내용을 확인 후, 동의한다면 동의 버튼을 눌러주세요.\r\n\r\n- 주소: https://jsw2022.pages.dev/contract/confirm/${contract_uuid}\r\n- 접속 인증번호: ${contract_secret}\r\n- 동의 시 계약은 즉시 체결되며, 계약서를 확인할 수 있는 주소를 문자로 보내드립니다.`,
            //         messages: [
            //             {to: worker_info.phone_number}
            //         ]
            //     }
            // })
            //     .then(r=>{
            //         console.log(r.data);
            //     })
        }
    },
    confirm: async function (req, res) {
        // if (!req.isAuth || req.body.code == undefined || req.body.contract_uuid == undefined) {
        //     // 로그인 필수
        //     res.status(401);
        //     return res.json({ message: "요청을 처리하는 중 오류가 발생하였습니다." });
        // }
        //req.params.contract_uuid
        if(req.body.choice == true){
            Store.update({isConfirmed: true}, {where:{contract_uuid: req.params.contract_uuid}})
            .then(result => {
                res.status(200);
                res.json({message: "요청이 잘 수행 되었습니다."});
            })
            .catch(err => {
                res.status(500);
                res.json({message: "알 수 없는 오류가 발생했습니다."});
            });
        }
    }
};