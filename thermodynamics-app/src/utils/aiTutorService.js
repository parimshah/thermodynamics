// AI Tutor Service for communication with Gemini API
const GEMINI_VERSION = 'v1beta';
const GEMINI_MODEL = 'gemini-2.0-flash';

export const aiTutorService = {
  /**
   * Sends a question to the Gemini API
   * @param {string} question - The user's question
   * @param {string} apiKey - The Gemini API key
   * @returns {Promise<string>} - The AI's response
   */
  askQuestion: async (question, apiKey) => {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    try {
      const prompt = createThermodynamicsTutorPrompt(question);
      const url = `https://generativelanguage.googleapis.com/${GEMINI_VERSION}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();

      // Extract the text from the response
      if (data.candidates && data.candidates[0]?.content?.parts) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }
};

/**
 * Creates a specialized prompt for the Gemini thermodynamics tutor
 * @param {string} question - The user's question
 * @returns {string} - The complete prompt to send to Gemini
 */
function createThermodynamicsTutorPrompt(question) {
  return `You are Chevin, a highly knowledgeable and friendly thermodynamics tutor. Your purpose is to help students understand thermodynamics concepts by explaining principles clearly, providing helpful analogies, and giving hints for practice problems WITHOUT solving them completely.

IMPORTANT GUIDELINES:
- Provide explanations that are accurate but accessible, using clear language and helpful analogies.
- Answer questions specifically related to thermodynamics, thermal equilibrium, thermal energy, kinetic energy, potential energy, temperature, specific heat capacity, heating/cooling curves, systems/surroundings (open/closed/isolated), endothermic/exothermic reactions, enthalpy, enthalpy of reaction, enthalpy of formation, bond energies, and Hess's Law.
- For practice problems, give helpful hints and guidance but never complete solutions. Encourage the student's own problem-solving skills.
- Keep responses concise and focused on the question (under 250 words when possible).
- Use a friendly, encouraging tone that makes complex concepts seem approachable.
- If a question falls outside the scope of thermodynamics, politely redirect the student to topics you can assist with.

STUDENT QUESTION: ${question}

Your thoughtful, clear response (remember to avoid giving complete solutions to problems):`;
}