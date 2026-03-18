# SSO2: Magical Learning Adventure 🧙‍♂️📚

**SSO2 (Story-based Study Odyssey 2)** is an emergent narrative educational application powered by generative AI. It transforms the mundane learning process into a fantastical "Hero's Journey." By deeply integrating Large Language Models (LLMs), the app dynamically generates unique narrative text, interactive challenges, and visual guidance based on any learning topic or document provided by the user, achieving a peak "edutainment" experience.

---

## ✨ Key Features

*   **Emergent Narrative:** Story content is not pre-set but generated in real-time based on user-selected learning topics.
*   **Interactive Gameplay:** Users define the narrative background and drive the plot through knowledge quizzes. Success or failure directly affects the story's development.
*   **AI Copilot Integration:** Powered by Google Gemini 3.1 Flash, the AI serves as the core engine for narrative generation and acts as an "AI Copilot" to generate personalized review suggestions.
*   **MCP Server Capabilities:** Exposes its educational engine to other AI agents via the Model Context Protocol.

---

## 🤖 MCP (Model Context Protocol) Integration

This application acts as an intelligent educational agent and a fully compliant **MCP Server** via Server-Sent Events (SSE). 

By acting as an MCP server, SSO2 doesn't just serve human users through its web UI—it exposes its core educational storytelling engine to *other AI assistants* (like Claude Desktop or custom agents). External AIs can connect to this server and use its tools to generate gamified learning experiences for their own users seamlessly.

### Available MCP Tools

External clients and agents can utilize the following tools:

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

---

## 🛠️ Getting Started (Local Development)

To run this project locally, follow these steps:

### Prerequisites
* Node.js (v18 or higher)
* A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/sso2-magical-learning.git
   cd sso2-magical-learning
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

---

## 🚀 Deployment

### Deploying to Vercel
This application can be deployed to Vercel. Because it utilizes a custom Express server for the MCP SSE connections, it requires a specific `vercel.json` configuration.

1. Ensure you have the following `vercel.json` in your project root:
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
2. Connect your GitHub repository to Vercel.
3. Add `GEMINI_API_KEY` to your Vercel Environment Variables.
4. Deploy.

> **⚠️ Important Note on Vercel & MCP:** Vercel Serverless Functions have strict execution timeouts and may drop long-lived Server-Sent Events (SSE) connections used by the MCP protocol. For production MCP usage, deploying the backend to a containerized service like **Google Cloud Run**, **Render**, or **Railway** is highly recommended.

---

## 🎓 Vision & Background

Traditional narrative works often rely on pre-scripted plot branches, leading to high production costs and limited breadth of experience. The emergence of Large Language Models has made "Emergent Narrative" possible—stories are no longer pre-written but are dynamically generated through system rules, character behaviors, and user interactions.

SSO2's mission is to break the barrier between entertainment and education. We leverage the powerful capabilities of generative AI to create a personalized, immersive world where students become protagonists and the curriculum becomes an adventure.

---
*Developed as an exploration of AI-Based Emergent Narrative Experience Design.*
