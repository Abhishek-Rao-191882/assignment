import express from "express";
// const authRouter = require("./auth");
const userRouter = require("./auth");
const courseRouter = require("./course");
// const activityRouter = require("./activityRouter");

const router = express.Router();

router.use("/", userRouter);
router.use("/courses", courseRouter);

module.exports = router;
