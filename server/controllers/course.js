import Course from "../models/course";
import User from "../models/user";

export const addCourse = async (req, res) => {
  try {
    const { name, syllabus } = req.body;
    if (!name) {
      return res.status(400).send(`NAME IS REQUIRED`);
    }

    let courseExit = await Course.findOne({ name }).exec();

    if (courseExit) {
      return res.status(400).send(`USE ANOTHER NAME`);
    }

    const course = new Course({
      name,
      syllabus,
    });
    await course.save();

    return res
      .status(200)
      .json({ ok: true, message: "COURSE CREATED SUCCESSFULLY" });
  } catch (err) {
    console.log(err);
    return res.status(400).send(`ERROR: ${err}`);
  }
};

export const getCourse = async (req, res) => {
  try {
    const { courseId } = req.params.id;

    let course = await Course.findOne({ courseId }).exec();

    return res
      .status(200)
      .json({ course: course, message: "COURSE RETRIEVED SUCCESSFULLY" });
  } catch (err) {
    console.log(err);
    return res.status(400).send(`ERROR: ${err}`);
  }
};

export const getCourses = async (req, res) => {
  try {
    let courses = await Course.find();
    return res
      .status(200)
      .json({ courses: courses, message: "COURSES RETRIEVED SUCCESSFULLY" });
  } catch (err) {
    console.log(err);
    return res.status(400).send(`ERROR: ${err}`);
  }
};

export const getMyCourse = async (req, res) => {
  try {
    const { userId } = req.body;
    let user = await User.findById(userId);
    const myCourses = user.courses;

    return res
      .status(200)
      .json({ courses: myCourses, message: "COURSE RETRIEVED SUCCESSFULLY" });
  } catch (err) {
    console.log(err);
    return res.status(400).send(`ERROR: ${err}`);
  }
};
