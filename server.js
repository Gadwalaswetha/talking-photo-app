require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.post("/talking-avatar", upload.single("photo"), async (req, res) => {
  try {
    const { text, language } = req.body;
    const photo = req.file.path;

    const response = await axios.post(
      "https://api.vidnoz.com/talking-avatar",
      { text, language, photo },
      { headers: { Authorization: `Bearer ${process.env.API_KEY}` } }
    );

    res.json({ videoUrl: response.data.videoUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate talking avatar" });
  }
});

app.post("/generate-avatar", async (req, res) => {
  try {
    const { description } = req.body;

    const response = await axios.post(
      "https://api.vidnoz.com/text-to-avatar",
      { description },
      { headers: { Authorization: `Bearer ${process.env.API_KEY}` } }
    );

    res.json({ avatarUrl: response.data.avatarUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate avatar" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
