const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const AIService = {
  /**
   * Analyze a resume and return strengths, weaknesses, suggestions.
   * @param {string} resumeText
   * @returns {Promise<{strengths: string[], weaknesses: string[], suggestions: string[]}>}
   */
  async analyzeResume(resumeText) {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: `Analyze this resume:\n\n${resumeText}`,
      config: {
        systemInstruction: 'You are an expert career coach and resume reviewer. Analyze the resume and return a JSON object with three arrays: "strengths", "weaknesses", and "suggestions". Each array should contain 3-5 concise bullet points. Return ONLY valid JSON, no markdown.',
        temperature: 0.7,
        maxOutputTokens: 1000,
        responseMimeType: 'application/json'
      }
    });

    const content = response.text.trim();
    return JSON.parse(content);
  },

  /**
   * Compare a resume against a job description and return a match score.
   * @param {string} resumeText
   * @param {string} jobDescription
   * @returns {Promise<{match_score: number, missing_skills: string[], suggestions: string[]}>}
   */
  async matchJob(resumeText, jobDescription) {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: `Compare this resume with the job description.\n\nReturn:\n1. Match score (0-100)\n2. Missing skills\n3. Suggestions\n\nResume:\n${resumeText}\n\nJob Description:\n${jobDescription}`,
      config: {
        systemInstruction: 'You are an expert recruiter and career advisor. Compare the resume with the job description. Return a JSON object with: "match_score" (0-100 integer), "missing_skills" (array of strings), and "suggestions" (array of improvement strings). Return ONLY valid JSON, no markdown.',
        temperature: 0.7,
        maxOutputTokens: 1000,
        responseMimeType: 'application/json'
      }
    });

    const content = response.text.trim();
    return JSON.parse(content);
  },

  /**
   * Generate general improvement suggestions for a resume.
   * @param {string} resumeText
   * @returns {Promise<string[]>}
   */
  async generateSuggestions(resumeText) {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: resumeText,
      config: {
        systemInstruction: 'You are an expert career coach. Provide 5 actionable suggestions to improve this resume. Return ONLY a JSON array of strings, no markdown.',
        temperature: 0.7,
        maxOutputTokens: 600,
        responseMimeType: 'application/json'
      }
    });

    const content = response.text.trim();
    return JSON.parse(content);
  }
};

module.exports = AIService;
