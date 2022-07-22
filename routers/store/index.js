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
 *                type: object
 *                properties:
 *                    data:
 *                      type: object
 *                      example:
 *                          [
 *                            { name: "태진마라탕", rate: 100, text_location: "충청북도 청주시 상당구 로로로", lat: 36.63010046569394, lon: 127.51671854407965, description: "미래를 만들어 나가는 가게"},
 *                            { name: "태진마라샹궈", rate: 80, text_location: "충청북도 청주시 구구구 로로로", lat: 36.62730948983622, lon: 127.51195958283104, description: "마라를 만들어 나가는 가게"},
 *                            { name: "태진마라마라", rate: 7777777, text_location: "충청북도 청청청 구구구 로로로", lat: 36.62730948983622, lon: 127.51195958283104, description: "마라만 만들어 나가는 가게"}
 *                          ]
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
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 *              description: 가게 id
 *        responses:
 *         200:
 *          description: 가게 정보
 *          content:
 *            application/json:
 *              schema:
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
 *         404:
 *           description: 잘못된 가게 id
 */
storeRouter.get("/getInfo", storeController.getInfo);
//--------------------------------------------------
storeRouter.get("/getInfoByOwnerId", storeController.getInfoByOwnerId);

/**
 * @swagger
 * paths:
 *  /api/store/add:
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
 *                  - heart
 *                  - address
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
 *        responses:
 *         200:
 *          description: 성공시 response code 200
 *         404:
 *           description: 잘못된 데이터 혹은 빈 데이터
 */
storeRouter.post("/add", storeController.add);

/**
 * @swagger
 * paths:
 *  /api/store/getNearBy:
 *      get:
 *        summary: "주변 1km이내 가게"
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
 *                type: object
 *                properties:
 *                    stores:
 *                      type: object
 *                      example:
 *                        [
 *                          {
 *                            name: "태진마라탕",
 *                            rate: 100,
 *                            text_location: "충청북도 청주시 상당구 로로로",
 *                            lat: 36.63010046569394,
 *                            lon: 127.51671854407965,
 *                            description: "미래를 만들어 나가는 가게"
 *                          },
 *                          {
 *                            name: "태진마라샹궈",
 *                            rate: 777,
 *                            text_location: "충청북도 청주시 상당구 로로로",
 *                            lat: 36.62730948983622,
 *                            lon: 127.51195958283104,
 *                            description: "마라를 만들어 나가는 가게"
 *                          }
 *                      ]
 *         500:
 *           description: 알 수 없는 오류
 */
storeRouter.get("/getNearBy", storeController.getNearBy);

module.exports = storeRouter;
