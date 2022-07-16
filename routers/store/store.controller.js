// 실제 가게 라우터 처리 로직

module.exports = {
    getInfo: function(req,res){
        console.log(req.query.id);
    },
    getAllStores: function(req, res){
        console.log("!");
    }
}