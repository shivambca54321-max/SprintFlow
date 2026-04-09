const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require('../models/User');
const Submission = require('../models/Submission');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.reviewSubmission = async (req, res) => {
  const { userCode, sprintTitle, constraints, userId, sprintId } = req.body;

  try {
    // FIX: Using the absolute latest 2026 stable model string
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

    const prompt = `Act as a Senior Architect. Review this code for: ${sprintTitle}. 
    Constraints: ${constraints.join(", ")}. 
    User Code: ${userCode}.
    Return ONLY JSON: {"score": 0-100, "status": "Passed"|"Failed", "summary": "string", "feedback": [{ "type": "Logic", "msg": "issue", "fix": "fix" }]}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, "").trim(); // Clean the AI's markdown
    
    const parsedResult = JSON.parse(text);

     // Ensure we save a fresh Submission for history
     const newSubmission = new Submission({
       sprintId: sprintId,
       code: userCode,
       status: parsedResult.status,
       score: parsedResult.score,
       feedback: parsedResult.feedback
     });
     await newSubmission.save();

     // PERSISTENCE ENGINE: Update XP and Add to Completed Sprints if Passed
     if (parsedResult.status === "Passed" && userId) {
        const user = await User.findById(userId);
        if (user) {
            user.experiencePoints += 250; // XP per sprint
            
            if (req.body.sprintId && !user.completedSprints.includes(req.body.sprintId)) {
                user.completedSprints.push(req.body.sprintId);
            }
            
            // Dynamic Rank Scaling
            if (user.experiencePoints > 5000) user.rank = "SYSTEM_ARCHITECT";
            else if (user.experiencePoints > 2000) user.rank = "SENIOR_ENFORCER";
            else if (user.experiencePoints > 1000) user.rank = "MID_LEVEL_RUNNER";
            
            await user.save();
            parsedResult.newXp = user.experiencePoints;
            parsedResult.newRank = user.rank;
        }
    }

    res.json(parsedResult);
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Architect is offline. Check API Key." });
  }
};