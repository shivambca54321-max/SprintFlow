const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const User = require('../models/User');

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.reviewSubmission = async (req, res) => {
    const { userCode, sprintTitle, constraints, userId } = req.body;

    try {
        console.log("Starting NEO Audit (Latest) for:", sprintTitle);
        
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash-latest",
            generationConfig: {
                temperature: 0.2,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8192,
                responseMimeType: "application/json",
            },
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            ],
        });
        
        const prompt = `
            Act as a Senior FAANG Architect. Audit this code for the sprint: "${sprintTitle}".
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