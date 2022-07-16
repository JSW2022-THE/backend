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
 *                            { name: "태진마라탕", rate: 5.0, location: "충청북도 청주시 상당구 로로로", id: "11111112" },
 *                            { name: "태진마라샹궈", rate: 5.0, location: "충청북도 청주시 구구구 로로로", id: "22222223" },
 *                            { name: "태진마라마라", rate: 5.0, location: "충청북도 청청청 구구구 로로로", id: "33333334" }
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
 *                          "name": "태진마라탕",
 *                          "location": "충청북도 청주시 상당구 월평로238번길 3-10 (용암동)",
 *                          "rate": 4.5,
 *                          "id": 223545135
 *                        }
 *         404:
 *           description: 잘못된 가게 id
 */
storeRouter.get("/getInfo", storeController.getInfo)

module.exports = storeRouter