const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const callGeminiAPI = async (payload) => {
  const response = await fetch(GEMINI_API_KEY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("API call failed with status:", response.status, response.statusText, "Body:", errorBody);
    throw new Error(`API call failed: ${response.statusText || 'Unknown error'} - Body: ${errorBody.substring(0, 200)}`);
  }

  return response.json();
};

export const sendChatMessage = async (promptText, chatHistory) => {
  const chatHistoryForGemini = chatHistory.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  chatHistoryForGemini.push({ role: "user", parts: [{ text: promptText }] });

  const payload = { contents: chatHistoryForGemini };
  console.log("Payload sent to Gemini API:", JSON.stringify(payload, null, 2));

  const result = await callGeminiAPI(payload);

  if (result.candidates && result.candidates.length > 0 &&
      result.candidates[0].content && result.candidates[0].content.parts &&
      result.candidates[0].content.parts.length > 0) {
    return result.candidates[0].content.parts[0].text;
  } else {
    console.error("Unexpected API response structure (no candidates found or malformed):", result);
    return "Sorry, I couldn't generate a response based on that. It might be due to content policy. Please try rephrasing.";
  }
};

export const evaluateProblemStatement = async (prompt) => {
  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          score: { type: "NUMBER" },
          feedback: { type: "STRING" }
        },
        required: ["score", "feedback"]
      }
    }
  };

  const result = await callGeminiAPI(payload);

  if (result.candidates && result.candidates.length > 0 &&
      result.candidates[0].content && result.candidates[0].content.parts &&
      result.candidates[0].content.parts.length > 0) {
    return JSON.parse(result.candidates[0].content.parts[0].text);
  } else {
    console.error("Unexpected AI evaluation response structure:", result);
    throw new Error("Failed to get AI evaluation. Please try again.");
  }
};
