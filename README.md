# 📑 Project Title: SprintFlow NEO
**Tagline:** An AI-Agentic Code Review Platform with Neo-Brutalist Architecture.  
**Developer Tier:** Full-Stack (MERN) + AI Engineering.

## 🎯 1. Executive Summary
SprintFlow NEO is a specialized developer tool that bridges the gap between theoretical learning and production-level engineering. Unlike standard coding platforms, it utilizes a Senior AI Architect (Gemini 3 Flash) to perform deep architectural audits of user-submitted code. The platform is wrapped in a Neo-Brutalist UI, emphasizing raw functionality, high contrast, and a "developer-first" aesthetic.

## 🏗️ 2. System Architecture
### A. Tech Stack
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| Frontend | React + Vite | Fast, component-based UI. |
| Styling | Tailwind CSS v4 | Neo-Brutalist utility-first design. |
| Editor Engine | Monaco Editor | Industry-standard coding environment (VS Code core). |
| Backend | Node.js + Express | Orchestration and API management. |
| Database | MongoDB Atlas | Persistence for sprints and submissions. |
| AI Intelligence | Gemini 1.5 Flash API | Agentic code review and JSON audit generation. |

### B. The Data Model (MongoDB)
* **Sprints**: Contains title, description, starterCode, constraints (array), and xpReward.
* **Submissions**: Tracks sprintId, userCode, aiScore, status (Passed/Failed), and feedbackLog.
* **Users**: Tracks Agent ID, Rank, and XP history.

## 🎨 3. UI/UX Design Philosophy (Neo-Brutalism)
The project rejects modern "soft" design (shadows, gradients) in favor of:

* **High Contrast Palette**: #FDFBD4 (Cream), #C05800 (Orange), #38240D (Night).
* **Visual Weight**: 8px solid black borders and 8px hard offset shadows (no blur).
* **Typography**: Black-weight, oversized sans-serif fonts for headings; JetBrains Mono for code.
* **Asymmetrical Layouts**: Purposefully "unpolished" grids to evoke a raw, industrial feel.

## 🧠 4. AI Logic & Prompt Engineering
The "Senior Architect" agent is configured via the Google Generative AI SDK using stable production models.

**The Process:**

1. **Context Injection**: The backend injects the specific "Sprint Constraints" into the prompt.
2. **Strict Persona**: The AI is instructed to ignore "politeness" and focus on logic, security leaks, and optimization.
3. **Structured Output**: The AI utilizes JSON Mode to return a machine-readable object:

```json
{
  "score": 85,
  "status": "Failed",
  "summary": "Logic is sound but leaks environment variables.",
  "feedback": [{ "type": "Security", "msg": "Don't hardcode JWT secrets.", "fix": "Use process.env" }]
}
```

## 🛠️ 5. Key Features & Functionality
### I. The Sprint Dashboard
A grid-based gallery that fetches challenges from MongoDB. Each card shows the difficulty and XP reward, enticing the user to "Start Sprint."

### II. The NEO-Editor Workspace
* **Dossier View**: A side-panel containing mission-critical constraints.
* **Monaco Integration**: Provides syntax highlighting, auto-completion, and a professional coding experience.
* **The Audit Trigger**: A high-contrast "Submit" button that sends the code for real-time analysis.

### III. The Result Slam (Modal)
An animated modal that "slams" onto the screen after the AI finishes thinking. It provides a visual "Certified" stamp or a "Critical Failure" warning based on the AI's audit.

## 🚀 6. Installation & Deployment

### Backend Setup
1. Navigate to `/server`.
2. Run `npm install`.
3. Configure `.env`: `PORT`, `MONGO_URI`, `GEMINI_API_KEY`, `JWT_SECRET`.
4. Run `node scripts/seed.js` to populate challenges.
5. Start: `npm run server` (or `npm run dev`).

### Frontend Setup
1. Navigate to `/client`.
2. Run `npm install`.
3. Start: `npm run dev`.

## 🔮 7. Future Roadmap (v2.0)
* **Real-time Collaboration**: Using WebSockets to allow pair-programming.
* **Language Versatility**: Expanding beyond JavaScript to Rust, Go, and Python.
* **Historical Timeline**: A visual graph of a user's code quality improvement over months.

---
### Final Status: READY FOR DEPLOYMENT.
*SprintFlow NEO represents a modern approach to developer education—raw, honest, and powered by the cutting edge of Generative AI.*
