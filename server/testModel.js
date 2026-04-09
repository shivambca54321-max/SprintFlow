require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
     console.log("Testing API Key...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1beta' });
    const result = await model.generateContent("hello");
    console.log("Success with gemini-1.5-flash v1beta:", result.response.text());
  } catch (err) {
    console.error("1.5-flash failed:", err.message);
  }
}

run();
