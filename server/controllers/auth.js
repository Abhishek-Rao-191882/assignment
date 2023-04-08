import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";
const nodemailer = require("nodemailer");
import { nanoid } from 'nanoid';

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name) {
      return res.status(400).send(`NAME IS REQUIRED`);
    }
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send(`PASSWORD IS REQUIRED AND SHOULD BE MIN 6 CHARACTERS LONG`);
    }
    let userExist = await User.findOne({ email }).exec();
    if (userExist) {
      return res.status(400).send(`EMAIL IS TAKEN`);
    }

    const hashedPassword = await hashPassword(password);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "Student",
    });
    await user.save();

    return res
      .status(200)
      .json({ status: true, message: "USER CREATED SUCCESSFULLY" });
  } catch (err) {
    console.log(err);
    return res.status(400).send(`ERROR: ${err}`);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send(`PASSWORD IS REQUIRED AND SHOULD BE MIN 6 CHARACTERS LONG`);
    }
    let user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(400).send(`NO USER FOUND`);
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).send(`PASSWORD IS INCORRECT`);
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    user.password = undefined;
    res.cookie("token", token, {
      httpOnly: true,
    });
    res.json({status:true, data: user, token: token });
  } catch (error) {
    return res.status(400).send("ERROR. TRY AGAIN.");
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({staus: true, message: "SIGNOUT SUCCESS" });
  } catch (error) {
    return res.json({ status: false, message: "ERROR IN GETTING USER DETAILS" });
  }
};

export const currentUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).select("-password").exec();
    return res.json({ status: true, data: user });
  } catch (error) {
    return res.json({ status: false, message: "ERROR IN GETTING USER DETAILS" });
  }
};

export const enrollMe = async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    const user = await User.findById(userId).select("-password").exec();

    if (!user) {
      return res.json({ status: true, message: "user Not found" });
    }

    const updatedUser = await User.updateOne(
      { _id: user._id },
      {
        $set: {
          courses: courseId,
        },
      }
    );
    return res.json({ status: true, data: updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(400).send("FAILED TO ENROLL, PLEASE TRY AGAIN...");
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const shortCode = nanoid(6).toUpperCase();
    const user = await User.findOneAndUpdate(
      { email },
      { passwordResetCode: shortCode }
    );
    if (!user) return res.status(400).send(`USER NOT FOUND`);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mukmrjup@gmail.com",
        pass: "wjfzxxixvcpnkzyj",
      },
    });

    const mailOptions = {
      from: "Abhishekrao",
      to: email,
      subject: "Reset Password",
      html: `<h2>Use this OTP to reset your password<h2/>
    <h2>${shortCode}</h2>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(200).send({
          message: "invalid email sent",
        });
      } else {
        return res.status(200).send({
          message: "email sent",
        });
      }
    });
  } catch (error) {
    res.status(400).send(`AN ERROR OCURRED`);
    console.log(error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const hashedPassword = await hashPassword(newPassword);
    const user = await User.findOneAndUpdate(
      { email, passwordResetCode: code },
      { password: hashedPassword, passwordResetCode: "" }
    ).exec();
    res.json({ status: true, message: "PASSWORD CHANGED SUCCESSFULLY" });
  } catch (error) {
    console.log(error);
    return res.status(400).send(`ERROR`);
  }
};
