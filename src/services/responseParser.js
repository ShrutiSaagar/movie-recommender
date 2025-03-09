import axios from 'axios';
import { constructOpenAIPrompt } from '../utils/promptBuilder';
// import { parseResponse } from './responseParser';

// Function to send chat request to OpenAI API
export const sendChatRequest = async (userInput, preferences, conversationHistory) => {
  try {
    // Construct the prompt
    const prompt = constructOpenAIPrompt(userInput, preferences, conversationHistory);
    
    // Call the OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: prompt.systemMessage
          },
          {
            role: "user",
            content: prompt.userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Parse the response
    const responseData = response.data.choices[0].message.content;
    console.log('Response from OpenAI:', responseData);
    // return responseData;
    return this.parseResponse(responseData);
    
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error(`Failed to get recommendations: ${error.message}`);
  }
};

// Mock API for testing without OpenAI
export const mockSendChatRequest = async (userInput, preferences, conversationHistory) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Sample response format
      resolve({
        message: "Based on your preferences, I think you might enjoy these movies:\n\n1. The Grand Budapest Hotel (2014) - A quirky comedy with visual flair\n2. Blade Runner 2049 (2017) - An atmospheric sci-fi with stunning visuals\n3. Parasite (2019) - A genre-defying thriller with social commentary",
        reasoning: "I noticed you have a preference for Comedy (3) and SciFi (2) genres. You also mentioned 'visual style' in your messages, which suggests you appreciate films with strong visual aesthetics. The Grand Budapest Hotel matches your comedy preference with Wes Anderson's distinctive visual style. Blade Runner 2049 aligns with your sci-fi interest and is renowned for its cinematography. I added Parasite for diversity since it's highly acclaimed and offers a unique viewing experience.",
        updatedPreferences: {
          genres: {
            ...preferences.genres,
            Comedy: Math.min(10, preferences.genres.Comedy + 1),
            SciFi: Math.min(10, preferences.genres.SciFi + 1)
          },
          keywords: [...preferences.keywords, "visual style"]
        },
        recommendations: [
          {
            title: "The Grand Budapest Hotel",
            year: 2014,
            rating: 8.1,
            runtime: 99,
            genres: ["Comedy", "Adventure"],
            description: "A quirky comedy with visual flair directed by Wes Anderson",
            imageUrl: null
          },
          {
            title: "Blade Runner 2049",
            year: 2017,
            rating: 8.0,
            runtime: 164,
            genres: ["Sci-Fi", "Action", "Drama"],
            description: "An atmospheric sci-fi with stunning visuals",
            imageUrl: null
          },
          {
            title: "Parasite",
            year: 2019,
            rating: 8.5,
            runtime: 132,
            genres: ["Thriller", "Drama", "Comedy"],
            description: "A genre-defying thriller with social commentary",
            imageUrl: null
          }
        ]
      });
    }, 1500);
  });
};

export const parseResponse = (response) => {
  console.log('parseResponse called');
  // const lines = response.split('\n');
  // find string until REASONING
  var responseLine = parseStringBetweenMarkers(response, '', 'REASONING');
  //lines.find(line => line.includes('RESPONSE'));
  // responseLine = responseLine.join(' ');
  // search for REASONING in the response and parse it
  var reasoningLine = parseStringBetweenMarkers(response, 'REASONING', 'PREFERENCES_JSON');
  reasoningLine = reasoningLine.join(' ');

  // const reasoningLine = lines.find(line => line.includes('REASONING'));
  // search for PREFERENCES_JSON in the response and parse it till the end
  var preferences = parseStringBetweenMarkers(response, 'PREFERENCES_JSON');
  preferences = preferences.join(' ');
  // console.log('responseLine ', responseLine);
  // console.log('reasoningLine ', reasoningLine);
  // console.log('preferencesLine ', preferences);
  return {
    updatedPreferences: preferences? JSON.parse(preferences) : {},
    reasoning: reasoningLine ? reasoningLine : '',
    message: responseLine ? responseLine : ''
  }
} 

export function parseStringBetweenMarkers(inputString, startMarker, endMarker) {
  // Split the input string into lines
  const lines = inputString.split('\n');
  // Initialize a flag to start collecting lines
  let collecting = startMarker === '' ? true : false;
  const resultLines = [];
  for (const line of lines) {
      // Check if the line contains the start marker
      if ( !collecting && line.includes(startMarker)) {
          collecting = true;  // Start collecting lines
          continue; // Move to the next line
      }

      // Check if the line contains the end marker
      if (line.includes(endMarker)) {
          collecting = false; // Stop collecting lines
          break; // Exit the loop since we reached the end marker
      }

      // If we are collecting, add the current line to the result
      if (collecting) {
          resultLines.push(line);
      }
  }

  return resultLines;
}
