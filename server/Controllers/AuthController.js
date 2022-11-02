import UserModel from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

// Registering a new User
export const registerUser = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);

  const oldUser = await UserModel.findOne({ userName: req.body.userName });
  if (oldUser) {
    return res.status(400).json({ mssg: "User already exist" });
  }

  const newUser = new UserModel({
    ...req.body,
    password: hashedPass,
  });

  try {
    const user = await newUser.save();
    const token = jwt.sign(
      {
        userName: user.userName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ ...newUser._doc, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// login User

export const loginUser = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await UserModel.findOne({ userName: userName });

    if (!user) {
      return res.status(404).json("User does not exists");
    }

    const validity = await bcrypt.compare(password, user.password);
    if (!validity) {
      return res.status(400).json("Wrong userName Or Password");
    }

    const token = jwt.sign(
      {
        userName: user.userName,
        id: user._id
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(200).json({...user._doc, token})

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
