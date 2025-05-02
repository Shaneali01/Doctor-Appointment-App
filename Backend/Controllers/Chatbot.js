import axios from "axios";
export const Chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }
    // System prompt to enforce medical-only responses
    const systemPrompt = `
      You are a medical assistant specialized in providing accurate and helpful information
       related to the medical field, including health, diseases, symptoms, treatments, and 
       medical advice. Only respond to questions related to medical topics. If the user asks
        a non-medical question, politely respond with: "I'm sorry, I can only assist with medical-related questions. Please ask about health, symptoms, treatments,
         or other medical topics."
    `;
    // Call Google Gemini API
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt }, { text: message }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.AI_API_KEY, // Gemini uses API key in header
        },
      }
    );
    const aiResponse = response.data.candidates[0].content.parts[0].text;
    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error(
      "Error processing chat:",
      error.response?.data || error.message
    );
    if (error.response?.status === 429) {
      return res
        .status(429)
        .json({ message: "Rate limit exceeded. Please try again later." });
    }
    if (error.response?.status === 401) {
      return res
        .status(401)
        .json({
          message:
            "Invalid API key. Please check your Gemini API key in the backend.",
        });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
