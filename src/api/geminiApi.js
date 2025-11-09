const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";

const API_KEY = "AIzaSyDrPc68tDtCF1kNCZW6-dkylhpcjVdKaps";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

// --- 2. The System Prompt (The AI's "Personality") ---

// This is where we give the AI its context and rules.
const systemPrompt = `
You are a friendly and professional AI assistant for a network technician. 
Your name is "Tech Assist."

Your primary job is to answer the technician's questions about the current installation task.

**YOUR RULES:**
1.  You will be given the task's data as a JSON object under the "TASK DATA" heading.
2.  You MUST base your answers *only* on the provided "TASK DATA" JSON.
3.  DO NOT make up information. If the answer is not in the JSON, politely say "I do not have that information in the task details."
4.  Be concise and helpful. Format technical details (like serial numbers) clearly.
5.  You also have knowledge of the 3-step installation checklist, which is:
    * Step 1: "Test fiber signal from splitter port"
    * Step 2: "Connect ONT and check power/light"
    * Step 3: "Connect router and test LAN/WiFi signal"
    You can answer general questions about these 3 steps.
`;

// --- 3. Exponential Backoff Fetcher (Robust API calling) ---

const fetchWithBackoff = async (payload, retries = 5, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Handle non-200 responses
        if (response.status === 429 || response.status >= 500) {
          // Throttling or server error, worth retrying
          throw new Error(`API Error (Retryable): ${response.status}`);
        } else {
          // Other client-side error (e.g., 400 Bad Request), don't retry
          const errData = await response.json();
          console.error("API Request Failed (Non-retryable):", errData);
          throw new Error(
            errData.error?.message || "Failed to call Gemini API"
          );
        }
      }

      return await response.json(); // Success
    } catch (error) {
      console.warn(
        `Attempt ${i + 1} failed: ${error.message}. Retrying in ${delay}ms...`
      );
      if (i === retries - 1) {
        // Last retry failed, throw the error
        console.error("All retry attempts failed.");
        throw error;
      }
      // Wait for the delay, then double it for the next attempt
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
};

// --- 4. The Main Exportable Function ---

export const getChatbotResponse = async (
  taskContext,
  chatHistory,
  newUserQuestion
) => {
  // 1. Format the user's message with the task context
  const userMessage = `
---
TASK DATA:
${JSON.stringify(taskContext, null, 2)}
---

USER QUESTION:
${newUserQuestion}
  `;

  // 2. Format the API history
  // The API expects a specific format: { role: 'user' | 'model', parts: [{ text: '...' }] }
  // We add the new user message to the end of the history
  const apiHistory = [
    ...chatHistory,
    {
      role: "user",
      parts: [{ text: userMessage }],
    },
  ];

  // 3. Construct the final payload
  const payload = {
    contents: apiHistory,
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    generationConfig: {
      // Controls creativity. Lower is more factual.
      temperature: 0.3,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    },
  };

  try {
    // 4. Call the API
    const result = await fetchWithBackoff(payload);

    // 5. Extract the text response
    const candidate = result.candidates?.[0];
    if (candidate && candidate.content?.parts?.[0]?.text) {
      return candidate.content.parts[0].text;
    } else {
      console.error("Invalid response structure from Gemini:", result);
      return "I'm sorry, I encountered an error and couldn't process your request.";
    }
  } catch (error) {
    console.error("Error in getChatbotResponse:", error);
    return `I'm sorry, I'm having trouble connecting to my brain right now. Please check your connection and try again. (${error.message})`;
  }
};
