import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("file"), (req, res) => {
    console.log("i was called");
  try {
    return res.status(200).json({ mssg: "File uploaded successfully" });
  } catch (err) {
    console.log(err);
  }
});

export default router