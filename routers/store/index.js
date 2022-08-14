// 가게 라우터

const storeRouter = require("express").Router();
const storeController = require("./store.controller");

/**
 * @swagger
 * paths:
 *  /api/store/stores:
 *    get:
 *      summary: "가게 데이터 전체조회"
 *      tags: [Store]
 *      responses:
 *        "200":
 *          description: 전체 가게 정보
 *          content:
 *            application/json:
 *              schema:
 *                    type: array
 *                    items:
 *                      oneOf:
 *                      - type: object
 *                        example: {"store_uuid":null,"name":"test1","lat":36.62730948983622,"lon":127.51195958283104,"description":"함께 미래를 만들어 나가는 가게","heart":28,"address":"대한민국 충청북도 청주시","owner_uuid":"","phone_number":null,"createdAt":"2022-07-21T11:28:39.000Z","updatedAt":"2022-07-21T11:28:40.000Z"}
 *                      - type: object
 *                        example: {"store_uuid":null,"name":"test2","lat":36.63010046569394,"lon":127.51671854407964,"description":"서울서울 서울서울서울","heart":777,"address":"대한민국 서울서울서울 서울 경기도","owner_uuid":"5dd3ac68-ee4d-4d23-9ff4-f24c074395e6","phone_number":null,"createdAt":"2022-07-21T11:34:21.000Z","updatedAt":"2022-07-21T11:34:21.000Z"}
 *                      - type: object
 *                        example: {"store_uuid":null,"name":"파리바게트 실리콘밸리점","lat":null,"lon":null,"description":"빵집","heart":1234,"address":"충청북도 청주시 상당구 용정로 35","owner_uuid":"5dd3ac68-ee4d-4d23-9ff4-f24c074395e6","phone_number":null,"createdAt":"2022-07-22T05:28:32.000Z","updatedAt":"2022-07-22T05:28:32.000Z"}
 *                      - type: object
 *                        example: {"store_uuid":"944d0494-4b94-4512-a3ec-a4a8b173de20","name":"태진마라안팔아","lat":1,"lon":2,"description":"마라탕가겐데 진짜로 마라탕 안판다니깐요","heart":0,"address":"대한민국 어딘가","owner_uuid":"9e93a1f6-bee1-4259-9951-0e4b4b919a91","phone_number":"010-0000-0000","createdAt":"2022-07-22T12:50:17.000Z","updatedAt":"2022-07-22T12:51:18.000Z"}
 *                      - type: object
 *                        example: {"store_uuid":null,"name":"carrot","lat":36.62059464826237,"lon":127.4681851469787,"description":"계승·발전과 있을 모든 경우와 국민은.","heart":325,"address":"48964 상읍","owner_uuid":"ea737dea-9ab4-49d9-9a8c-54b5898d6ce2","phone_number":"010-3191-9007","createdAt":"2022-08-08T15:29:24.000Z","updatedAt":"2022-08-08T15:29:24.000Z"}
 *        "500":
 *          description: 알 수 없는 오류 발생
 *          content:
 *            application/json:
 *              schema:
 *                properties:
 *                  message:
 *                    type: string
 *                    example: 알 수 없는 오류가 발생했습니다.
 */
storeRouter.get("/stores", storeController.getAllStores);


/**
 * @swagger
 * paths:
 *  /api/store/getInfo:
 *      get:
 *        summary: "가게 데이터 조회"
 *        tags: [Store]
 *        produces:
 *        - application/json
 *        parameters:
 *          - in: query
 *            name: target_store_uuid
 *            required: true
 *            schema:
 *              type: string
 *              description: 가게 uuid
 *        responses:
 *         200:
 *          description: 가게 정보
 *          content:
 *            application/json:
 *              schema:
 *                properties:
 *                  store_uuid:
 *                    type: string
 *                    example: 944d0494-4b94-4512-a3ec-a4a8b173de20
 *                  name:
 *                    type: string
 *                    example: 태진마라안팔아
 *                  lat:
 *                    type: number
 *                    example: 36.62730948983622
 *                  lon:
 *                    type: number
 *                    example: 127.51195958283104
 *                  description:
 *                    type: string
 *                    example: 마라탕가겐데 진짜로 마라탕 안판다니깐요
 *                  heart:
 *                    type: integer
 *                    example: 28
 *                  address:
 *                    type: string
 *                    example: 대한민국 충청북도 청주시
 *                  owner_uuid:
 *                    type: string
 *                    example: b0547f6f-125a-4051-b56f-dea1132de4d5
 *                  phone_number:
 *                    type: string
 *                    example: 010-0000-0000
 *                  createdAt:
 *                    type: string
 *                    example: 2022-07-21T11:28:39.000Z
 *                  updatedAt:
 *                    type: string
 *                    example: 2022-07-21T11:28:40.000Z
 *         404:
 *           description: 존재하지 않는 가게 uuid
 *           content:
 *             application/json:
 *               schema:
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: 존재하지 않는 가게 id 입니다.
 *         500:
 *           description: 알 수 없는 오류 발생
 *           content:
 *             application/json:
 *               schema:
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: 알 수 없는 오류가 발생했습니다.
 */
storeRouter.get("/getInfo", storeController.getInfo);


/**
 * @swagger
 * paths:
 *  /api/store/getInfoByOwnerId:
 *      get:
 *        summary: "request 요청자 uuid 기반 가게 데이터 조회"
 *        tags: [Store]
 *        produces:
 *        - application/json
 *        responses:
 *         200:
 *          description: 가게 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  store_uuid:
 *                    type: string
 *                    example: 944d0494-4b94-4512-a3ec-a4a8b173de20
 *                  name:
 *                    type: string
 *                    example: 태진마라안팔아
 *                  lat:
 *                    type: number
 *                    example: 36.62730948983622
 *                  lon:
 *                    type: number
 *                    example: 127.51195958283104
 *                  description:
 *                    type: string
 *                    example: 마라탕가겐데 진짜로 마라탕 안판다니깐요
 *                  heart:
 *                    type: integer
 *                    example: 28
 *                  address:
 *                    type: string
 *                    example: 대한민국 충청북도 청주시
 *                  owner_uuid:
 *                    type: string
 *                    example: b0547f6f-125a-4051-b56f-dea1132de4d5
 *                  phone_number:
 *                    type: string
 *                    example: 010-0000-0000
 *                  createdAt:
 *                    type: string
 *                    example: 2022-07-21T11:28:39.000Z
 *                  updatedAt:
 *                    type: string
 *                    example: 2022-07-21T11:28:40.000Z
 *         404:
 *           description: 가게를 찾을 수 없음.
 *           content:
 *             application/json:
 *               schema:
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: 존재하지 않는 가게 입니다.
 *         401:
 *           description: 인증되지 않은 상태에서 접근
 *           content:
 *             application/json:
 *               schema:
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: 요청을 처리하는 중 오류가 발생하였습니다.
 */
storeRouter.get("/getInfoByOwnerId", storeController.getInfoByOwnerId);


/**
 * @swagger
 * paths:
 *  /api/store/registration:
 *      post:
 *        summary: "가게 정보 첫 추가"
 *        tags: [Store]
 *        produces:
 *        - application/json
 *        requestBody:
 *          x-name: body
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                required:
 *                  - name
 *                  - lat
 *                  - lon
 *                  - description
 *                  - address
 *                  - phone_number
 *                properties:
 *                  name:
 *                    type: string
 *                  lat:
 *                    type: number
 *                  lon:
 *                    type: number
 *                  description:
 *                    type: string
 *                  heart:
 *                    type: integer
 *                  address:
 *                    type: string
 *                  phone_number:
 *                    type: string
 *        responses:
 *         200:
 *           description: 성공적인 수행!
 *           content:
 *             application/json:
 *               schema:
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: 요청이 잘 수행되었습니다.
 *         400:
 *           description: 존재하지 않는 가게 uuid
 *           content:
 *             application/json:
 *               schema:
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: 입력값중 일부가 비어있거나 잘못되어있습니다.
 *         401:
 *           description: 인증 되지 않은 상태에서 접근
 *           content:
 *             application/json:
 *               schema:
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: 요청을 처리하는 중 오류가 발생하였습니다.
 */
storeRouter.post("/registration", storeController.registration);

/**
 * @swagger
 * paths:
 *  /api/store/getNearBy:
 *      get:
 *        summary: "주변 n km이내 가게 정보 가져오기. 기본 1km"
 *        tags: [Store]
 *        produces:
 *        - application/json
 *        parameters:
 *          - in: query
 *            name: lat
 *            required: true
 *            schema:
 *              type: number
 *              description: 사용자 위도
 *          - in: query
 *            name: lon
 *            required: true
 *            schema:
 *              type: number
 *              description: 사용자 경도
 *          - in: query
 *            name: dis
 *            required: false
 *            schema:
 *              type: number
 *              description: 가져올 최대 거리(km)
 *        responses:
 *         200:
 *          description: 조회된 데이터
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  oneOf:
 *                  - type: object
 *                    example: {"store_uuid":null,"name":"test1","lat":36.62730948983622,"lon":127.51195958283104,"description":"함께 미래를 만들어 나가는 가게","heart":28,"address":"대한민국 충청북도 청주시","owner_uuid":"","phone_number":null,"createdAt":"2022-07-21T11:28:39.000Z","updatedAt":"2022-07-21T11:28:40.000Z"}
 *                  - type: object
 *                    example: {"store_uuid":null,"name":"test2","lat":36.63010046569394,"lon":127.51671854407964,"description":"서울서울 서울서울서울","heart":777,"address":"대한민국 서울서울서울 서울 경기도","owner_uuid":"5dd3ac68-ee4d-4d23-9ff4-f24c074395e6","phone_number":null,"createdAt":"2022-07-21T11:34:21.000Z","updatedAt":"2022-07-21T11:34:21.000Z"}
 *                  - type: object
 *                    example: {"store_uuid":null,"name":"파리바게트 실리콘밸리점","lat":null,"lon":null,"description":"빵집","heart":1234,"address":"충청북도 청주시 상당구 용정로 35","owner_uuid":"5dd3ac68-ee4d-4d23-9ff4-f24c074395e6","phone_number":null,"createdAt":"2022-07-22T05:28:32.000Z","updatedAt":"2022-07-22T05:28:32.000Z"}
 *                  - type: object
 *                    example: {"store_uuid":"944d0494-4b94-4512-a3ec-a4a8b173de20","name":"태진마라안팔아","lat":1,"lon":2,"description":"마라탕가겐데 진짜로 마라탕 안판다니깐요","heart":0,"address":"대한민국 어딘가","owner_uuid":"9e93a1f6-bee1-4259-9951-0e4b4b919a91","phone_number":"010-0000-0000","createdAt":"2022-07-22T12:50:17.000Z","updatedAt":"2022-07-22T12:51:18.000Z"}
 *                  - type: object
 *                    example: {"store_uuid":null,"name":"carrot","lat":36.62059464826237,"lon":127.4681851469787,"description":"계승·발전과 있을 모든 경우와 국민은.","heart":325,"address":"48964 상읍","owner_uuid":"ea737dea-9ab4-49d9-9a8c-54b5898d6ce2","phone_number":"010-3191-9007","createdAt":"2022-08-08T15:29:24.000Z","updatedAt":"2022-08-08T15:29:24.000Z"}
 *         401:
 *           description: 인증 되지 않은 상태에서 접근
 *           content:
 *             application/json:
 *               schema:
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: 요청을 처리하는 중 오류가 발생하였습니다.
 */
storeRouter.get("/getNearBy", storeController.getNearBy);


/**
 * @swagger
 * paths:
 *  /api/store/addHeart:
 *      post:
 *        summary: "가게 평점 추가"
 *        tags: [Store]
 *        produces:
 *        - application/json
 *        parameters:
 *          - in: query
 *            name: target_store_id
 *            required: true
 *            schema:
 *              type: string
 *              description: 가게 uuid
 *        responses:
 *         200:
 *          description: 가게 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: 잘 수행되었습니다.
 *         404:
 *           description: 요청한 가게를 찾을 수 없음
 *           content:
 *             application/json:
 *               schema:
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: 요청한 가게를 찾을 수 없습니다.
 *         401:
 *           description: 인증 되지 않은 상태에서 접근
 *           content:
 *             application/json:
 *               schema:
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: 요청을 처리하는 중 오류가 발생하였습니다.
 *         500:
 *           description: 알 수 없는 오류 발생
 *           content:
 *             application/json:
 *               schema:
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: 알 수 없는 오류가 발생했습니다.
 */
storeRouter.post("/addHeart", storeController.addHeart);

module.exports = storeRouter;
