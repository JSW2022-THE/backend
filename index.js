const express = require("express");
const app = express();
const port = 3000;
const api = require("./routers")
const { swaggerUi, specs } = require("./swagger/swagger");

//Express 4.16.0버전 부터 body-parser의 일부 기능이 익스프레스에 내장 body-parser 연결
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", api);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
    res.send("What are you looking for here?");
});

app.listen(port, () => {
    console.log("jswcup2022 backend is running on port 3000\n");
});