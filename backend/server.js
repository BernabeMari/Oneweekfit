// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyCFssB19KAxYQplRmI5uBSs2YWusevMdDs');

// Generate meal and exercise plan based on user profile and selected exercises
async function generatePlan(userData, exercises) {
  try {
    // Access the model (Gemini Pro)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Format user data and exercises for the prompt
    const userAge = userData.age || 'unknown age';
    const userGender = userData.gender || 'unspecified gender';
    const userWeight = userData.weight ? `${userData.weight} ${userData.weightUnit || ''}` : 'unspecified weight';
    const userHeight = userData.height ? `${userData.height} ${userData.heightUnit || ''}` : 'unspecified height';
    const userReligion = userData.religion || 'unspecified';
    
    const exerciseNames = exercises.map(ex => ex.title).join(', ');

    // Create a detailed, structured prompt for the AI
    const prompt = `
    You are an expert fitness and nutrition coach. Create a personalized one-week meal and exercise plan for a client with the following details:

    Profile:
    - Name: ${userData.name || 'Client'}
    - Age: ${userAge}
    - Gender: ${userGender}
    - Religion: ${userReligion} (consider any dietary restrictions if applicable)
    - Weight: ${userWeight}
    - Height: ${userHeight}

    Selected exercises: ${exerciseNames}

    Please create a comprehensive plan that includes:
    1. A daily meal plan for 7 days with breakfast, lunch, dinner, and two snacks (include specific portions and calorie estimates)
    2. A workout schedule that incorporates the selected exercises
    3. Weekly goals and expected outcomes
    4. Tips for staying motivated

    Format your response in a structured way with clear headings and sections to make it easy to follow.
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating plan:', error);
    throw new Error('Failed to generate personalized plan');
  }
}

// API Endpoints
app.post('/api/generate-plan', async (req, res) => {
  try {
    const { userData, exercises } = req.body;
    
    // Validate input
    if (!userData || !exercises || !Array.isArray(exercises)) {
      return res.status(400).json({ error: 'Invalid input. Please provide userData and exercises.' });
    }
    
    // Generate plan using Gemini AI
    const plan = await generatePlan(userData, exercises);
    
    res.json({ plan });
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Failed to generate plan', details: error.message });
  }
});

// Serve static files from the main directory in production
app.use(express.static('../'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the API at http://localhost:${PORT}/api/generate-plan`);
}); 