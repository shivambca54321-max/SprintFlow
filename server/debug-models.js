require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // We'll try to reach the API and see what it says
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Checking API access...");
        const result = await model.generateContent("test");
        console.log("SUCCESS: gemini-1.5-flash is working!");
    } catch (err) {
        console.log("FAILED: gemini-1.5-flash is NOT working.");
        console.log("Error details:", err.message);
        console.log("\nTIP: Check if your API Key is active in Google AI Studio.");
    }
}

listModels();
