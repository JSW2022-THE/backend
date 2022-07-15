// 실제 가게 라우터 처리 로직

module.exports = {
    getInfo: function(req,res){
        res.send(req.body);
        console.log(req.params.storeId);
    }
}