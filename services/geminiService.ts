
import { GoogleGenAI, Type, Chat, Modality } from "@google/genai";
import { StoryChapter, Hero, UserInput, PerformanceRecord, CopilotReportData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TEXT_MODEL = 'gemini-3-flash-preview';
const IMAGE_MODEL = 'gemini-2.5-flash-image';
const TTS_MODEL = 'gemini-2.5-flash-preview-tts';

// We'll store the chat session in memory for the duration of the app session
let currentChatSession: Chat | null = null;

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
        type: { type: Type.STRING, enum: ['multiple_choice', 'true_false', 'ordering', 'matching'] }, // REMOVED text input types
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

/**
 * Initializes the story session and generates Chapter 1.
 */
export const startStory = async (input: UserInput, hero: Hero): Promise<StoryChapter> => {
  currentChatSession = ai.chats.create({
    model: TEXT_MODEL,
    config: {
      responseMimeType: "application/json",
      responseSchema: STORY_RESPONSE_SCHEMA,
      systemInstruction: `
        You are an adaptive, gamified AI Storyteller and Tutor.
        
        **CRITICAL RULE: All text you generate (story, quiz questions, options, explanations, etc.) MUST be in the user's specified LANGUAGE.**
        
        ROLE:
        You are playing the character of ${hero.name} (${hero.role}) from ${hero.culture}.
        Adopt their personality, tone, and speech patterns strictly.
        
        USER PROFILE:
        Name: ${input.preferences.userName}
        Language for all output: ${input.preferences.language}
        Gender: ${input.preferences.gender}
        Interests: ${input.preferences.interests}
        Difficulty: ${input.preferences.difficulty}
        Desired Length: ${input.preferences.chapterCount} chapters.
        
        GOAL:
        Teach the user about the TOPIC provided by creating a ${input.preferences.chapterCount}-chapter interactive story in their chosen language.
        
        STRUCTURE:
        - Generate one chapter at a time.
        - **IMPORTANT:** Keep the story content EXTREMELY CONCISE and PUNCHY. **Maximum 50 words per chapter.**
        - Use **bold** markdown to highlight key educational terms.
        
        QUIZ VARIETY (CRITICAL):
        - You must use a **variety of question types**. Do not use the same type multiple times in a row.
        - The ONLY allowed quiz types are: 'multiple_choice', 'true_false', 'ordering', 'matching'.
        - **DO NOT USE 'fill_blank' or 'correct_the_sentence'.**
        
        VISUAL INSTRUCTION (CRITICAL):
        - The 'imagePrompt' must be a VISUAL EXPLANATION of the 'educationalConcept' for this chapter, written in ENGLISH for the image generation model.
        - It must not just be a scene. It should be an educational diagram, infographic, or visualization.
      `
    }
  });

  const parts: any[] = [];
  
  if (input.fileData && input.mimeType) {
    const base64Data = input.fileData.split(',')[1] || input.fileData;
    parts.push({
      inlineData: { mimeType: input.mimeType, data: base64Data }
    });
  }

  const depthInstruction = input.preferences.chapterCount <= 5 
    ? "Scope: Surface level." 
    : input.preferences.chapterCount <= 12 
        ? "Scope: Standard Curriculum." 
        : "Scope: Deep Dive.";

  const prompt = `
    TOPIC: "${input.topic}"
    INSTRUCTION: ${depthInstruction}
    
    Please generate Chapter 1 of ${input.preferences.chapterCount} in ${input.preferences.language}.
    Introduce the world and the first basic concept.
    For this first chapter, use a 'multiple_choice' or 'true_false' question.
    **CRITICAL**: All text output must be in ${input.preferences.language}. The 'imagePrompt' must remain in English.
  `;
  
  parts.push({ text: prompt });

  try {
    const response = await currentChatSession.sendMessage({ message: parts });
    if (!response.text) throw new Error("No response");
    return JSON.parse(response.text) as StoryChapter;
  } catch (error) {
    console.error("Start Story Error:", error);
    throw error;
  }
};

/**
 * Generates the next chapter based on the previous interaction.
 */
export const nextChapter = async (userAnswer: string, isCorrect: boolean): Promise<StoryChapter> => {
  if (!currentChatSession) throw new Error("Session not initialized");

  const prompt = `
    User Answered: "${userAnswer}".
    Result: ${isCorrect ? "CORRECT" : "INCORRECT"}.
    
    Generate the NEXT chapter.
    - If correct: Advance the plot.
    - If incorrect: Briefly weave a clarification into the start of this new chapter's story.
    - REMEMBER: Use a DIFFERENT quiz type than the last one from this list: ['multiple_choice', 'true_false', 'ordering', 'matching'].
    **CRITICAL**: All text output must be in the previously specified language. The 'imagePrompt' must remain in English.
  `;

  try {
    const response = await currentChatSession.sendMessage({ message: prompt });
    if (!response.text) throw new Error("No response");
    return JSON.parse(response.text) as StoryChapter;
  } catch (error) {
    console.error("Next Chapter Error:", error);
    throw error;
  }
};

const COPILOT_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    grade: { type: Type.STRING, description: "A letter grade like A+, B, C-, etc." },
    summary: { type: Type.STRING, description: "A brief, encouraging summary in the hero's voice." },
    focusAreas: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of specific concepts the user struggled with." },
    studyPlan: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A 3-4 step actionable study plan." }
  },
  required: ['grade', 'summary', 'focusAreas', 'studyPlan']
};

/**
 * Generates a personalized report card based on user performance.
 */
export const generateCopilotReport = async (
    performanceData: PerformanceRecord[], 
    hero: Hero, 
    topic: string, 
    preferences: UserInput['preferences']
): Promise<CopilotReportData> => {

    const incorrectAnswers = performanceData.filter(p => !p.isCorrect);
    const correctCount = performanceData.length - incorrectAnswers.length;
    
    let performanceSummary: string;
    if (incorrectAnswers.length === 0) {
        performanceSummary = "The user answered all questions correctly. A flawless performance!";
    } else {
        performanceSummary = `The user answered ${correctCount} out of ${performanceData.length} questions correctly. They struggled with the following concepts: ${incorrectAnswers.map(p => `"${p.chapter.educationalConcept}"`).join(', ')}.`;
    }

    const prompt = `
      You are an AI Copilot in character as ${hero.name}.
      The user, ${preferences.userName}, has just completed a learning adventure about "${topic}".
      
      **PERFORMANCE DATA:**
      ${performanceSummary}
      
      **YOUR TASK:**
      Generate a final report card for ${preferences.userName} in their language (${preferences.language}).
      - **Grade:** Assign a fair letter grade based on their performance.
      - **Summary:** Write a short (2-3 sentences), encouraging summary in the voice of ${hero.name}.
      - **Focus Areas:** List the specific educational concepts they got wrong.
      - **Study Plan:** Create a simple, 3-step actionable study plan to help them improve on the focus areas. Keep each step concise.
      
      **CRITICAL**: Respond in the specified JSON format. All text must be in ${preferences.language}.
    `;

    try {
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: COPILOT_RESPONSE_SCHEMA,
            }
        });

        if (!response.text) throw new Error("No response from Copilot");
        return JSON.parse(response.text) as CopilotReportData;
    } catch (error) {
        console.error("Copilot Report Error:", error);
        // Provide a fallback report on error
        return {
            grade: "A",
            summary: `Well done, ${preferences.userName}! You've shown great promise on this journey. But an error in the scroll prevents me from seeing your full results. A true hero overcomes all challenges!`,
            focusAreas: ["Overcoming magical interference"],
            studyPlan: ["Try another adventure!", "Consult the ancient texts (Google).", "Rest and prepare for the next challenge."]
        };
    }
};


/**
 * Generates an image for the chapter.
 */
export const generateChapterImage = async (imagePrompt: string, heroStyle: string): Promise<string> => {
  const fullPrompt = `Educational infographic style or detailed scientific illustration blended with art style: ${heroStyle}. Content: ${imagePrompt}. Make it clear, detailed, and informative. High fidelity, 8k, dramatic lighting.`;
  
  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: fullPrompt,
      config: { imageConfig: { aspectRatio: '16:9' } }
    });

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return `https://picsum.photos/1920/1080?blur=2`;
  } catch (error) {
    console.error("Error generating image:", error);
    return `https://picsum.photos/1920/1080?grayscale`;
  }
};

// --- TTS Rate Limiting ---
let lastTtsCallTimestamp = 0;
// The free tier for preview TTS models can have very strict rate limits (e.g., < 10 RPM).
// Setting a conservative delay to prevent 429 errors. 60s / 6 RPM = 10,000ms.
const TTS_RATE_LIMIT_MS = 10000;

/**
 * Generates audio speech for the given text using the specified Gemini voice.
 * Includes a client-side rate limiter to prevent 429 errors.
 */
export const generateSpeech = async (text: string, voiceName: string): Promise<ArrayBuffer | null> => {
  const now = Date.now();
  if (now - lastTtsCallTimestamp < TTS_RATE_LIMIT_MS) {
    console.warn(`TTS rate limit approached. Falling back to browser TTS to avoid 429 error.`);
    // Return null to signal the calling function to use the fallback.
    return null;
  }

  try {
    lastTtsCallTimestamp = now; // Update the timestamp before making the API call.
    const response = await ai.models.generateContent({
      model: TTS_MODEL,
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName } } },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
    return null;
  } catch (error) {
    console.error("Error generating speech:", error);
    // In case of an API error (like the one reported), return null to trigger the fallback.
    return null;
  }
};

export const decodeAudioData = async (
  arrayBuffer: ArrayBuffer,
  audioContext: AudioContext
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(arrayBuffer);
  const frameCount = dataInt16.length;
  const buffer = audioContext.createBuffer(1, frameCount, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
};
    