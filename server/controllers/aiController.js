const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.reviewSubmission = async (req, res) => {
    const { userCode, sprintTitle, constraints } = req.body;

    try {
        console.log("Starting AI Audit for:", sprintTitle);
        if (!process.env.GEMINI_API_KEY) {
            console.error("CRITICAL: GEMINI_API_KEY is missing from .env");
            return res.status(500).json({ error: "Server Configuration Error: Missing API Key" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        const result = await model.generateContent(`Act as a Senior FAANG Architect. Audit this code for the sprint: "${sprintTitle}".
          Constraints to check: ${constraints.join(", ")}
          
          User's Code:
          ${userCode}

          Return ONLY a JSON object with this structure:
          {
            "score": number,
            "status": "Passed" | "Refactor Needed",
            "summary": "string",
            "issues": [{ "type": "string", "line": number, "msg": "string", "fix": "string" }]
          }`);

        const response = await result.response;
        const text = response.text();
        
        // Robust Extraction: Find the JSON block even if Gemini includes extra text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            res.json(JSON.parse(jsonMatch[0]));
        } else {
            throw new Error("Invalid AI Response Format");
        }
    } catch (error) {
        console.error("!!! AI_AUDIT_ERROR_DETAILS !!!");
        console.error("Status Code:", error.status);
        console.error("Message:", error.message);
        console.error("Full Trace:", error);
        
        res.status(500).json({ 
            error: "AI Audit failed.", 
            details: error.message 
        });
    }
};