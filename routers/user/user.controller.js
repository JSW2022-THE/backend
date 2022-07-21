// 실제 사용자 라우터 처리 로직
const User = require("../../models").User;

module.exports = {
    getAllUsers: function(req,res){
        User.findAll({})
            .then(function (queryRes) {
                if (queryRes != "") res.json(queryRes);
            })
            .catch(function (err) {
                res.status(404);
            });
    }
}