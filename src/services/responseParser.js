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
  
  // Helper function to extract content between start and end markers
  const extractBetweenMarkers = (text, startMarker, endMarker) => {
    const startIndex = text.indexOf(startMarker);
    if (startIndex === -1) return '';
    
    const contentStartIndex = startIndex + startMarker.length;
    const endIndex = text.indexOf(endMarker, contentStartIndex);
    if (endIndex === -1) return '';
    
    return text.substring(contentStartIndex, endIndex);
  };
  function extractAndParseJson(inputString) {
    try {
      // Use regex to find content between <PREFERENCES_JSON> tags
      const regex = /<PREFERENCES_JSON>(.*?)<\/PREFERENCES_JSON>/s;
      const match = inputString.match(regex);
      
      // Check if we found a match
      if (match && match[1]) {
        // Parse the extracted JSON string
        const jsonData = JSON.parse(match[1]);
        return jsonData;
      } else {
        // No match found
        return null;
      }
    } catch (error) {
      // Handle any errors (like invalid JSON)
      console.error("Error extracting or parsing JSON:", error);
      return null;
    }
  }
  // Extract message
  const message = extractBetweenMarkers(response, '<MESSAGE>', '</MESSAGE>');
  
  // Extract table
  let table = extractBetweenMarkers(response, '<TABLE>', '</TABLE>');
  console.log('table ', table);
  table = table.split('\n').filter(row => row.trim() !== '');

  
  // Extract reasoning
  const reasoning = extractBetweenMarkers(response, '<REASONING>', '</REASONING>');
  console.log('reasoning ', reasoning); 
  // Extract preferences JSON
  // const preferencesStr = extractBetweenMarkers(response, '<PREFERENCES_JSON>', '</PREFERENCES_JSON>');
  const preferences = extractAndParseJson(response);
  
  return {
    updatedPreferences: preferences,
    recommendations: table || '',
    reasoning: reasoning || '',
    message: message || ''
  };
};
