const Resume = require("../../models").Resume;
const ReceivedResumes = require("../../models").ReceivedResumes;
const User = require("../../models").User;
const uuid = require("uuid");

const { SolapiMessageService } = require("solapi");
const messageService = new SolapiMessageService(
  process.env.SOLAPI_API_KEY,
  process.env.SOLAPI_API_SECRET
);

module.exports = {
  getMyResume: async (req, res) => {
    const worker_uuid = req.userUuid;

    const resume = await Resume.findOne({
      where: { worker_uuid: worker_uuid },
    });

    res.json(resume);
  },

  getStoreReceivedResumes: async (req, res) => {
    const store_uuid = req.query.store_uuid;

    const resumes = await ReceivedResumes.findAll({
      where: { store_uuid: store_uuid, state: "open" },
    });

    res.json(resumes);
  },

  submitResume: async (req, res) => {
    const worker_uuid = req.userUuid;
    const resume_data = req.body.resume_data;
    const store_data = req.body.store_data;

    const employer_data = await User.findOne({
      attributes: ["phone_number", "name"],
      where: { uuid: store_data.owner_uuid },
    });

    const worker_phone_number = await User.findOne({
      attributes: ["phone_number"],
      where: { uuid: worker_uuid },
    });

    const receivedResume = await ReceivedResumes.create({
      resume_uuid: resume_data.resume_uuid,
      store_uuid: store_data.store_uuid,
      worker_uuid: worker_uuid,
      name: resume_data.name,
      date_of_birth: resume_data.date_of_birth,
      address: resume_data.address,
      etc: resume_data.etc,
      state: "open",
      phone_number: worker_phone_number.phone_number,
    }).then(() => {
      messageService
        .send([
          {
            from: process.env.SOLAPI_API_FROM_NUMBER,
            to: employer_data.phone_number,
            text: `안녕하세요, ${employer_data.name} 고용주님! ${resume_data.name}님의 이력서가 도착했어요. 받은 이력서는 굿잡을 실행하시고 내 메뉴 - 이력서 보기를 통하여 확인하실 수 있어요.`,
            subject: "[굿잡] 이력서 도착!", // 제목쓰면 내용이 짧아도 자동으로 LMS로 넘어감. 쓰지마셈.
          },
          // 배열형태로 최대 10,000건까지 동시 전송가능
        ])
        .then((res) =>
          console.log(
            res.groupInfo.log[1].message + "\n" + res.groupInfo.log[2].message
          )
        );
    });

    res.json(receivedResume);
  },
  changeReceivedResumeState: (req, res) => {
    const resume_uuid = req.body.resume_uuid;
    ReceivedResumes.update(
      {
        state: "close",
      },
      {
        where: { resume_uuid: resume_uuid },
      }
    ).then(() => {
      res.send("이력서 " + resume_uuid + " 삭제 완료");
    });
  },
};
