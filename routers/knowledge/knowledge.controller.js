// 일단 여기 부분은 db 안써도 될듯?  상황보고 추후 추가

var question = null;
var init = false;

(function () {
    if (!init) {
        var fs = require('fs');
        fs.readFile('data.json', 'utf8', function (err, data) {
            if (err) throw err;
            question = JSON.parse(data);
        });
        init = true;
    }
})();

module.exports = {
    getOne: function (req, res) {
        if (!req.isAuth) {
            // 로그인 필수
            res.status(401);
            return res.json({ message: "요청을 처리하는 중 오류가 발생하였습니다.", });
        }
        try {
            var rndIdx = Math.floor(Math.random() * (question.length)); //최댓값은 제외, 최솟값은 포함
            res.status(200);
            res.json({ question: question[rndIdx].question, answer: question[rndIdx].answer, detail: question[rndIdx].detail });  // 나와라! 어지러운 코드!
        } catch (error) {
            console.log(error);
            res.status(500);
            res.json({ message: "알 수 없는 오류가 발생했습니다." });
        }
    }
}