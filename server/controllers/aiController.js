const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.reviewSubmission = async (req, res) => {
    const { userCode, sprintTitle, constraints } = req.body;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
        const text = response.text().replace(/```json|```/g, "").trim();
        res.json(JSON.parse(text));
    } catch (error) {
        res.status(500).json({ error: "AI Audit failed. Check API quota." });
    }
};