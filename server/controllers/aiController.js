const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Generative AI with the API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.reviewSubmission = async (req, res) => {
    const { userCode, sprintTitle, constraints } = req.body;

    try {
        console.log("Starting NEO Audit for:", sprintTitle);
        
        // Using v1 for high stability
        const model = genAI.getGenerativeModel(
            { model: "gemini-1.5-flash" },
            { apiVersion: "v1" }
        );

        const prompt = `
            Act as a Senior Architect at a top tech firm. 
            Review this code for the following sprint: "${sprintTitle}".
            Verify these constraints: ${constraints.join(", ")}
            
            Code to Audit:
            ${userCode}

            Respond ONLY in valid JSON format with this exact structure:
            {
                "score": 0-100,
                "status": "Passed" | "Failed",
                "summary": "Full overview of the submission",
                "feedback": [
                    { "type": "Logic" | "Security" | "Style", "msg": "Detailed description of issue", "fix": "Specific fix instruction" }
                ]
            }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        // Robust extraction of JSON block
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            res.json(JSON.parse(jsonMatch[0]));
        } else {
            throw new Error("Invalid AI Response Format");
        }
    } catch (error) {
        console.error("!!! AI_AUDIT_ERROR_DETAILS !!!");
        console.error(error);
        res.status(500).json({ 
            status: "Failed", 
            summary: "Architect node timed out. Check terminal for trace.",
            feedback: [] 
        });
    }
};