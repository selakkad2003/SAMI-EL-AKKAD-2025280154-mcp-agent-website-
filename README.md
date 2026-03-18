# AI-Based Emergent Narrative Experience Design and Implementation

## 🚀 Project Overview

**Project Name:** SSO2: Magical Learning Adventure (Gamified Learning Odyssey)

**Brief Description:** 
SSO2 (Story-based Study Odyssey 2) is an emergent narrative educational application powered by generative AI. It transforms the mundane learning process into a fantastical "Hero's Journey." By deeply integrating Large Language Models (LLMs), the app dynamically generates unique narrative text, interactive challenges, and visual guidance based on any learning topic or document provided by the user, achieving a peak "edutainment" experience.

---

## 🤖 MCP (Model Context Protocol) Agent

### What the Agent Does
This application acts as an intelligent educational agent. It takes any learning topic and dynamically weaves it into a personalized, interactive "Hero's Journey" narrative. It generates story chapters, educational concepts, visual prompts, and interactive quizzes to test the user's knowledge as they progress. 

### Why it is an MCP Server
This project implements the **Model Context Protocol (MCP)** via Server-Sent Events (SSE). By being an MCP server, SSO2 doesn't just serve human users through its web UI—it exposes its core educational storytelling engine to *other AI assistants* (like Claude Desktop or custom agents). External AIs can connect to this server and use its tools to generate gamified learning experiences for their own users seamlessly.

### Available MCP Tools
The agent exposes a comprehensive suite of educational tools to external clients:

1. **`start_learning_journey`**
   * **Description:** Initializes a new educational story adventure.
   * **Parameters:** `topic`, `heroName`, `heroRole`, `userName`, `language`, `chapterCount`.
   * **Action:** Prompts the Gemini AI to generate the opening chapter, establishing the world, the first educational concept, and the initial quiz.

2. **`get_next_chapter`**
   * **Description:** Advances the story based on the user's quiz performance.
   * **Parameters:** `previousChapterText`, `userAnswer`, `isCorrect`, `heroName`, `language`.
   * **Action:** Evaluates the user's answer. If correct, the story advances to the next concept. If incorrect, the AI weaves a clarification of the misunderstood concept into the narrative before moving forward.

3. **`get_hint`**
   * **Description:** Provides an in-character hint for a specific question.
   * **Parameters:** `question`, `concept`, `heroName`, `language`.
   * **Action:** Generates a short, helpful hint without giving away the exact answer, maintaining the persona of the selected hero.

4. **`explain_concept`**
   * **Description:** Performs a deep dive into a specific educational concept.
   * **Parameters:** `concept`, `heroName`, `language`, `depth` (surface, standard, deep).
   * **Action:** Generates a detailed, engaging explanation of a concept using analogies, tailored to the requested depth level.

5. **`generate_copilot_report`**
   * **Description:** Generates a personalized performance review and study plan.
   * **Parameters:** `topic`, `correctCount`, `totalQuestions`, `struggleAreas`, `heroName`, `userName`, `language`.
   * **Action:** Analyzes the user's performance data to create an encouraging summary and a 3-step actionable study plan for areas they struggled with.

*(Note: The web UI features a real-time toast notification system that visually broadcasts whenever an external agent calls one of these MCP tools).*

---

## 🌟 1. Background & Vision

### **Background**
Traditional narrative works often rely on pre-scripted plot branches, leading to high production costs and limited breadth of experience. The emergence of Large Language Models has made "Emergent Narrative" possible—stories are no longer pre-written but are dynamically generated through system rules, character behaviors, and user interactions.

### **Vision**
SSO2's mission is to break the barrier between entertainment and education. We leverage the powerful capabilities of Google Gemini AI to create a personalized, immersive world where students become protagonists and the curriculum becomes an adventure.

---

## 🎯 2. Core Requirements Implementation

*   **Emergence:** Story content is not pre-set but generated in real-time based on user-selected learning topics.
*   **User Participation:** Users define the narrative background and drive the plot through knowledge quizzes. Success or failure directly affects the story's development.
*   **Deep AI Integration:** AI (Google Gemini 3 Flash) serves as the core engine for narrative generation and acts as an "AI Copilot" to generate personalized review suggestions.

---

## 🚀 Deployment Guide (GitHub & Vercel)

### 1. Push to GitHub for Review
To share this code for review, you should push it to a GitHub repository:
1. Initialize a git repository in your project folder: `git init`
2. Add all files: `git add .`
3. Commit your changes: `git commit -m "Initial commit with MCP server and UI"`
4. Link your GitHub repository and push: 
   ```bash
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

### 2. Deploying to Vercel
While this app uses a custom Express server (which is naturally best suited for containerized environments like Google Cloud Run), you can deploy it to Vercel by configuring it as a Serverless Function.

**Steps for Vercel Deployment:**
1. Create a `vercel.json` file in the root directory to route traffic to the Express server:
   ```json
   {
     "version": 2,
     "builds": [
       { "src": "server.ts", "use": "@vercel/node" },
       { "src": "package.json", "use": "@vercel/static-build" }
     ],
     "rewrites": [
       { "source": "/api/(.*)", "destination": "/server.ts" },
       { "source": "/mcp/(.*)", "destination": "/server.ts" },
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
2. Connect your GitHub repository to Vercel via the Vercel Dashboard.
3. In the Vercel project settings, add your Environment Variable: `GEMINI_API_KEY`.
4. Click **Deploy**.

> **⚠️ Important Note on Vercel & MCP:** Vercel Serverless Functions have strict execution timeouts and may drop long-lived Server-Sent Events (SSE) connections used by the MCP protocol. If your MCP client disconnects frequently on Vercel, it is highly recommended to deploy the backend to a containerized service like **Google Cloud Run**, **Render**, or **Railway**.

---

## 🎓 Conclusion

SSO2 is more than just a project; it is an exploration of future educational models. By combining the narrative structure of classic RPGs with cutting-edge generative AI technology and the Model Context Protocol, we have created an addictive, efficient, and deeply personalized learning environment.

---
**Developed with ❤️ for the AI-Based Emergent Narrative Course.**
