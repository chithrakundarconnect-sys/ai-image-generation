const axios = require("axios");
const fs = require("fs");
const path = require("path");

const generateImage = async (prompt) => {
  try {
    const response = await axios({
      method: "POST",
      url: "https://clipdrop-api.co/text-to-image/v1", // ✅ FIXED domain
      headers: {
        "x-api-key": process.env.CLIPDROP_API_KEY,
        "Content-Type": "application/json",
      },
      data: { prompt, negative_prompt: "blurry, low quality" },
      responseType: "arraybuffer",
    });

    const imagesDir = path.join(__dirname, '../images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir);
    }

    const filename = `image-${Date.now()}.png`;
    const filepath = path.join(imagesDir, filename);

    fs.writeFileSync(filepath, response.data);

    return `/image/${filename}`;
  } catch (error) {
    console.error("Clipdrop API Error:", error.response?.data || error.message);
    throw new Error("Image generation failed.");
  }
};

module.exports = generateImage;