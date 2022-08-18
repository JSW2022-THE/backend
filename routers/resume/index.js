const resumeRouter = require("express").Router();
const resumeController = require("./resume.controller");

resumeRouter.get("/getMyResume", resumeController.getMyResume);
resumeRouter.get(
  "/getStoreReceivedResumes",
  resumeController.getStoreReceivedResumes
);
resumeRouter.post("/submitResume", resumeController.submitResume);
resumeRouter.post(
  "/changeReceivedResumeState",
  resumeController.changeReceivedResumeState
);

module.exports = resumeRouter;
