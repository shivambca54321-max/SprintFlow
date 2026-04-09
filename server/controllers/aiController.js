const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require('../models/User');

// Initialize Google Generative AI with the API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.reviewSubmission = async (req, res) => {
    const { userCode, sprintTitle, constraints, userId } = req.body;

    try {
        console.log("Starting NEO Audit for:", sprintTitle);
        
        // Using v1 for high stability
        // Optimized for Stability: gemini-1.5-flash with JSON Mode
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: {
              responseMimeType: "application/json",
            }
        });

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
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const auditResult = JSON.parse(jsonMatch[0]);

            // PERSISTENCE ENGINE: Update XP if Passed
            if (auditResult.status === "Passed" && userId) {
                const xpEarned = 250;
                const user = await User.findById(userId);
                if (user) {
                    user.experiencePoints += xpEarned;
                    // Dynamic Rank Scaling
                    if (user.experiencePoints > 5000) user.rank = "SYSTEM_ARCHITECT";
                    else if (user.experiencePoints > 2000) user.rank = "SENIOR_ENFORCER";
                    else if (user.experiencePoints > 1000) user.rank = "MID_LEVEL_RUNNER";
                    
                    await user.save();
                    auditResult.newXp = user.experiencePoints;
                    auditResult.newRank = user.rank;
                }
            }

            res.json(auditResult);
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