
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import { GoogleGenAI, Type } from "@google/genai";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- Gemini Setup ---
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
const TEXT_MODEL = 'gemini-3-flash-preview';

const STORY_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    chapterNumber: { type: Type.INTEGER },
    totalChapters: { type: Type.INTEGER },
    chapterTitle: { type: Type.STRING },
    storyContent: { type: Type.STRING },
    educationalConcept: { type: Type.STRING },
    imagePrompt: { type: Type.STRING },
    isFinal: { type: Type.BOOLEAN },
    quiz: {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING },
        type: { type: Type.STRING, enum: ['multiple_choice', 'true_false', 'ordering', 'matching'] },
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        matchOptions: { type: Type.ARRAY, items: { type: Type.STRING } },
        correctAnswer: { type: Type.STRING },
        explanation: { type: Type.STRING }
      },
      required: ['question', 'type', 'correctAnswer', 'explanation']
    }
  },
  required: ['chapterNumber', 'chapterTitle', 'storyContent', 'educationalConcept', 'imagePrompt', 'quiz']
};

// --- MCP Server Setup ---
const mcpServer = new McpServer({
  name: "Magical Learning MCP",
  version: "1.0.0",
});

// --- SSE Broadcast for UI ---
const mcpUiClients: express.Response[] = [];

app.get("/api/mcp-logs", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  mcpUiClients.push(res);
  req.on("close", () => {
    const index = mcpUiClients.indexOf(res);
    if (index !== -1) mcpUiClients.splice(index, 1);
  });
});

function broadcastMcpLog(toolName: string, args: any) {
  const message = `MCP Tool Called: ${toolName}`;
  const data = JSON.stringify({ toolName, args, message, timestamp: new Date().toISOString() });
  mcpUiClients.forEach(client => client.write(`data: ${data}\n\n`));
  console.log(`[MCP] ${message}`, args);
}

// Tool: Start Story
mcpServer.tool(
  "start_learning_journey",
  {
    topic: z.string().describe("The topic to learn about"),
    heroName: z.string().describe("The name of the hero (e.g. 'Aria', 'Kael')"),
    heroRole: z.string().describe("The role of the hero (e.g. 'Stellar Navigator')"),
    userName: z.string().describe("The user's name"),
    language: z.string().default("English").describe("The language for the story"),
    chapterCount: z.number().default(5).describe("Number of chapters in the journey"),
  },
  async ({ topic, heroName, heroRole, userName, language, chapterCount }) => {
    broadcastMcpLog("start_learning_journey", { topic, heroName, userName });
    const chat = ai.chats.create({

      model: TEXT_MODEL,
      config: {
        responseMimeType: "application/json",
        responseSchema: STORY_RESPONSE_SCHEMA,
        systemInstruction: `You are an adaptive, gamified AI Storyteller and Tutor. ROLE: ${heroName} (${heroRole}). USER: ${userName}. LANGUAGE: ${language}. GOAL: Teach about ${topic} in ${chapterCount} chapters. Keep story concise (<50 words).`
      }
    });

    const prompt = `Generate Chapter 1 of ${chapterCount} about ${topic} in ${language}.`;
    const response = await chat.sendMessage({ message: prompt });
    
    return {
      content: [{ type: "text", text: response.text || "Failed to generate story." }],
    };
  }
);

// Tool: Get Next Chapter
mcpServer.tool(
  "get_next_chapter",
  {
    previousChapterText: z.string().describe("The text of the previous chapter"),
    userAnswer: z.string().describe("The user's answer to the previous quiz"),
    isCorrect: z.boolean().describe("Whether the user's answer was correct"),
    heroName: z.string().describe("The name of the hero"),
    language: z.string().default("English").describe("The language for the story"),
  },
  async ({ previousChapterText, userAnswer, isCorrect, heroName, language }) => {
    broadcastMcpLog("get_next_chapter", { userAnswer, isCorrect, heroName });
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: `
        Previous Chapter: ${previousChapterText}
        User Answered: "${userAnswer}".
        Result: ${isCorrect ? "CORRECT" : "INCORRECT"}.
        Hero: ${heroName}
        Language: ${language}
        
        Generate the NEXT chapter in JSON format matching the story schema.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: STORY_RESPONSE_SCHEMA,
      }
    });
    
    return {
      content: [{ type: "text", text: response.text || "Failed to generate next chapter." }],
    };
  }
);

// Tool: Get Hint
mcpServer.tool(
  "get_hint",
  {
    question: z.string().describe("The current quiz question the user is stuck on"),
    concept: z.string().describe("The educational concept being tested"),
    heroName: z.string().describe("The name of the hero providing the hint"),
    language: z.string().default("English").describe("The language for the hint"),
  },
  async ({ question, concept, heroName, language }) => {
    broadcastMcpLog("get_hint", { question, concept, heroName });
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: `You are ${heroName}. The user is stuck on this question: "${question}" about the concept: "${concept}". Provide a helpful, in-character hint in ${language} without giving away the exact answer. Keep it under 30 words.`
    });
    return {
      content: [{ type: "text", text: response.text || "No hint available." }],
    };
  }
);

// Tool: Explain Concept Deep Dive
mcpServer.tool(
  "explain_concept",
  {
    concept: z.string().describe("The concept to explain"),
    heroName: z.string().describe("The name of the hero explaining"),
    language: z.string().default("English").describe("The language for the explanation"),
    depth: z.enum(["surface", "standard", "deep"]).default("standard").describe("Depth of the explanation"),
  },
  async ({ concept, heroName, language, depth }) => {
    broadcastMcpLog("explain_concept", { concept, depth, heroName });
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: `You are ${heroName}. Explain the concept of "${concept}" at a ${depth} level in ${language}. Keep it engaging, educational, and in-character. Use analogies if helpful.`
    });
    return {
      content: [{ type: "text", text: response.text || "Explanation failed." }],
    };
  }
);

// Tool: Generate Copilot Report
mcpServer.tool(
  "generate_copilot_report",
  {
    topic: z.string().describe("The topic that was learned"),
    correctCount: z.number().describe("Number of correct answers"),
    totalQuestions: z.number().describe("Total number of questions asked"),
    struggleAreas: z.array(z.string()).describe("List of concepts the user got wrong"),
    heroName: z.string().describe("The name of the hero"),
    userName: z.string().describe("The user's name"),
    language: z.string().default("English").describe("The language for the report"),
  },
  async ({ topic, correctCount, totalQuestions, struggleAreas, heroName, userName, language }) => {
    broadcastMcpLog("generate_copilot_report", { topic, correctCount, totalQuestions });
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: `You are ${heroName}. ${userName} just finished learning about ${topic}. They got ${correctCount}/${totalQuestions} correct. They struggled with: ${struggleAreas.join(", ")}. Generate a short, encouraging performance review and a 3-step study plan in ${language}.`
    });
    return {
      content: [{ type: "text", text: response.text || "Report generation failed." }],
    };
  }
);

// --- SSE Transport for MCP ---
let transport: SSEServerTransport | null = null;

app.get("/mcp/sse", (req, res) => {
  transport = new SSEServerTransport("/mcp/messages", res);
  mcpServer.connect(transport);
});

app.post("/mcp/messages", (req, res) => {
  if (transport) {
    transport.handlePostMessage(req, res);
  } else {
    res.status(400).send("No active SSE transport");
  }
});

// --- Health Check ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mcp: "active" });
});

// --- Vite Integration ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`MCP SSE endpoint: http://localhost:${PORT}/mcp/sse`);
  });
}

startServer();
