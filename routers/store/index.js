// 가게 라우터

const storeRouter = require("express").Router()
const storeController = require("./store.controller")

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
 *                    stores:
 *                      type: object
 *                      example:
 *                          [
 *                            { name: "태진마라탕", rate: 100, text_location: "충청북도 청주시 상당구 로로로", lat: 36.63010046569394, lon: 127.51671854407965, description: "미래를 만들어 나가는 가게"},
 *                            { name: "태진마라샹궈", rate: 80, text_location: "충청북도 청주시 구구구 로로로", lat: 36.62730948983622, lon: 127.51195958283104, description: "마라를 만들어 나가는 가게"},
 *                            { name: "태진마라마라", rate: 7777777, text_location: "충청북도 청청청 구구구 로로로", lat: 36.62730948983622, lon: 127.51195958283104, description: "마라만 만들어 나가는 가게"}
 *                          ]
 */
 storeRouter.get("/stores", storeController.getAllStores)

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
 *                type: object
 *                properties:
 *                    stores:
 *                      type: object
 *                      example:
 *                        {
 *                          name: "태진마라탕", 
 *                          rate: 100, 
 *                          text_location: "충청북도 청주시 상당구 로로로", 
 *                          lat: 36.63010046569394, 
 *                          lon: 127.51671854407965, 
 *                          description: "미래를 만들어 나가는 가게"
 *                        }
 *         404:
 *           description: 잘못된 가게 id
 */
storeRouter.get("/getInfo", storeController.getInfo)

module.exports = storeRouter