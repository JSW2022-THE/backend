const Reviews = require("../../models").Reviews;
const uuid = require("uuid");

module.exports = {
  createReview: async (req, res) => {
    const userUuid = req.userUuid;
    const review_msg = req.body.review_msg;
    const store_uuid = req.body.store_uuid;

    await Reviews.create({
      review_uuid: uuid.v4(),
      review_msg: review_msg,
      store_uuid: store_uuid,
      creator_uuid: userUuid,
    });

    res.send("리뷰 작성이 완료되었습니다.");
  },
  getReviews: async (req, res) => {
    const store_uuid = req.query.store_uuid;

    const reviews = await Reviews.findAll({
      where: { store_uuid: store_uuid },
    });

    res.json(reviews);
  },
};
