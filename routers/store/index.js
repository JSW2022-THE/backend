// 가게 라우터

const storeRouter = require("express").Router()
const storeController = require("./store.controller")

/**
 * @swagger
 * paths:
 *  /api/store/getInfo:
 *    get:
 *      summary: "가게 데이터 조회"
 *      description: "Query string으로 요청"
 *      tags: [Stores]
 *      parameters:
 *        - in: query
 *        name: "storeId"
 *        required: true
 *          schema:
 *            type: "string"
 *      responses:
 *        "200":
 *          description: 가게 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  rate:
 *                    type: float
 *                    description: "가게 평점"
 *                  name:
 *                    type: string
 *                    description: "가게 이름"
 *                  location: 
 *                    type: string
 *                    description: "가게 위치"
 *                  needPartTimeJob:
 *                    type: boolean
 *                    description: "알바 구함"
 *                  needShortTermPartTimeJob:
 *                    type: boolean
 *                    description: "단기 알바 구함"
 *                  emptyPartTimeJobCnt:
 *                    type: integer
 *                    description: "알바 자리 남은 수"
 */
storeRouter.get("/getInfo", storeController.getInfo)

module.exports = storeRouter