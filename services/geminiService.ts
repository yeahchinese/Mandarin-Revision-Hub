
import { GoogleGenAI, Type } from "@google/genai";
import { VOCABULARY, SENTENCES } from '../constants';
import { QuizQuestion } from '../types';

const combineData = () => {
    const allData = [];
    for (const category in VOCABULARY) {
        allData.push(...VOCABULARY[category].map(item => ({...item, type: 'vocabulary'})));
    }
    for (const category in SENTENCES) {
        allData.push(...SENTENCES[category].map(item => ({...item, type: 'sentence'})));
    }
    return allData;
};

export const generateQuizQuestions = async (): Promise<QuizQuestion[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const vocabularyAndSentences = combineData();

  const prompt = `
    You are an expert language teacher creating a multiple-choice quiz for Year 10 students learning Mandarin Chinese. Your task is to generate 20 questions based on the provided vocabulary and sentence list.

    **Instructions:**
    1.  Use ONLY the vocabulary and sentences from the list provided below.
    2.  For all Chinese text in questions and answers, you MUST use the format: 'Chinese Characters (pinyin)'. For example: '下巴 (xiàba)' or for a sentence '我有大眼睛。(Wǒ yǒu dà yǎnjīng)'.
    3.  Create varied questions:
        - "What is the English translation for '...'?"
        - "Which of the following means '...' in Chinese?"
        - "Complete the sentence: '...'"
        - A small number of questions can test the pinyin for a character.
    4.  Ensure there are exactly four options for each question.
    5.  One option must be correct, and the other three should be plausible but incorrect distractors, drawn from the provided vocabulary list. The distractors must be relevant to the question type (e.g., if asking for an English translation, distractors should be in English).
    6.  The output must be a JSON array of objects following the specified schema.
    7. Generate exactly 20 questions.

    **Vocabulary and Sentence List:**
    ${JSON.stringify(vocabularyAndSentences)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: {
                type: Type.STRING,
                description: 'The question text, e.g., "What is the English for \'脸 (liǎn)\'?"'
              },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'An array of four possible answers.'
              },
              correctAnswerIndex: {
                type: Type.INTEGER,
                description: 'The 0-based index of the correct answer in the options array.'
              },
              timeLimit: {
                type: Type.INTEGER,
                description: 'Time limit in seconds for the question. Use 20 or 30 seconds.'
              }
            },
            required: ['question', 'options', 'correctAnswerIndex', 'timeLimit']
          }
        }
      },
    });

    const jsonString = response.text.trim();
    const generatedQuestions: QuizQuestion[] = JSON.parse(jsonString);
    return generatedQuestions;

  } catch (error) {
    console.error("Error generating quiz questions:", error);
    throw new Error("Failed to generate quiz. The model may have returned an invalid format. Please try again.");
  }
};
