//https://any-ting.tistory.com/105

const swaggerUi = require("swagger-ui-express")
const swaggereJsdoc = require("swagger-jsdoc")

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "jswcup2022 swagger",
      description:
        "jswcup2022 | Node.js Swaager swagger-jsdoc 방식 RestFul API 클라이언트 UI",
    },
    servers: [
      {
        url: "http://localhost:2000", // 요청 URL
      },
    ],
  },
  apis: ["./routers/*.js", "./routers/user/*.js", "./routers/store/*.js", "./routers/auth/*.js", "./routers/chat/*.js"], //Swagger 파일 연동
}
const specs = swaggereJsdoc(options)

module.exports = { swaggerUi, specs }