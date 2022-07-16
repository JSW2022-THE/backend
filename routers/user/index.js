// 사용자 라우터

const userRouter = require("express").Router()
const userController = require("./user.controller")

/**
 * @swagger
 * paths:
 *  /api/user/users:
 *    get:
 *      summary: "유저 데이터 전체조회"
 *      tags: [User]
 *      responses:
 *        "200":
 *          description: 전체 유저 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    users:
 *                      type: object
 *                      example:
 *                          [
 *                            { name: "김응진", age: 18, rate: 5.0, birth: "2005.06.25", id: "1111111" },
 *                            { name: "김홍록", age: 18, rate: 5.0, birth: "2005.01.01", id: "2222222" },
 *                            { name: "박태진", age: 18, rate: 5.0, birth: "2005.04.16", id: "3333333" }
 *                          ]
 */
userRouter.get("/users", userController.getAllUsers)

module.exports = userRouter