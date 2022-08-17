// 사용자 라우터

const userRouter = require("express").Router();
const userController = require("./user.controller");

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
 *                            {kakao_id: "BIGINT", uuid: "VARCHAR", name: "김응진", agree_terms_of_service: "TINYINT", age: "INT", createdAt: 2022-07-17 06:44:40, updatedAt: 2022-07-17 06:44:40},
 *                            {kakao_id: "BIGINT", uuid: "VARCHAR", name: "김홍록", agree_terms_of_service: "TINYINT", age: "INT", createdAt: 2022-07-17 06:44:40, updatedAt: 2022-07-17 06:44:40},
 *                            {kakao_id: "BIGINT", uuid: "VARCHAR", name: "박태진", agree_terms_of_service: "TINYINT", age: "INT", createdAt: 2022-07-17 06:44:40, updatedAt: 2022-07-17 06:44:40},
 *                          ]
 */
userRouter.get("/users", userController.getAllUsers);

userRouter.post("/resume", userController.resume);

userRouter.get("/getResume", userController.getResume);

userRouter.post("/modifyUserInfo", userController.modifyUserInfo);

//userRouter.get("/predictSalary", userController.predictSalary);

module.exports = userRouter;
