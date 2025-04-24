require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Add urlencoded parser for form data

// Properly serve static files from current directory
app.use(express.static(path.join(__dirname)));

// Initialize Gemini API with the correct API key
const API_KEY = 'AIzaSyCFssB19KAxYQplRmI5uBSs2YWusevMdDs';
const genAI = new GoogleGenerativeAI(API_KEY);

// Configure nodemailer transporter
let transporter = null;

// Create transporter with hardcoded credentials
transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'spradax20@gmail.com', // Match the sender email
    pass: 'cdob gsda rokg shkn'  // Using the provided password
  }
});
console.log('Email transport configured with hardcoded credentials');

// Generate meal and exercise plan based on user profile and selected exercises
async function generatePlan(userData, exercises) {
  try {
    // Use the correct model for the latest API version
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Format user data and exercises for the prompt
    const userAge = userData.age || 'unknown age';
    const userGender = userData.gender || 'unspecified gender';
    const userWeight = userData.weight ? `${userData.weight} ${userData.weightUnit || ''}` : 'unspecified weight';
    const userHeight = userData.height ? `${userData.height} ${userData.heightUnit || ''}` : 'unspecified height';
    const userReligion = userData.religion || 'unspecified';
    
    const exerciseNames = exercises.map(ex => ex.title).join(', ');

    // Create a detailed, structured prompt for the AI
    const prompt = `
    You are an expert Filipino fitness and nutrition coach. Create a personalized one-week meal and exercise plan for a client with the following details:

    Profile:
    - Name: ${userData.name || 'Client'}
    - Age: ${userAge}
    - Gender: ${userGender}
    - Religion: ${userReligion} (consider any dietary restrictions if applicable)
    - Weight: ${userWeight}
    - Height: ${userHeight}

    Selected exercises: ${exerciseNames}

    Please create a 7-day fitness and meal plan with these requirements:
    1. ONLY include a daily meal plan for 7 days (Monday-Sunday) with breakfast, lunch, dinner, and snacks
    2. Use Filipino-friendly dishes and ingredients that are easily available in the Philippines
    3. Include specific portions and calorie estimates for each meal
    4. Incorporate the selected exercises into a workout schedule

    IMPORTANT FORMATTING INSTRUCTIONS:
    - DO NOT use asterisks (*) or any markdown formatting
    - Format each day like this:
      DAY NAME (e.g., MONDAY)
          Workout: (description)
          Breakfast: (meal) (calories)
          Snack: (snack) (calories)
          Lunch: (meal) (calories) 
          Snack: (snack) (calories)
          Dinner: (meal) (calories)

    - At the end, include a section titled "NUTRITIONAL REFERENCES" with 3-4 Filipino nutrition references
    - Include actual website URLs for each nutritional reference (e.g., http://www.fnri.dost.gov.ph)

    Focus ONLY on the 7-day plan without extra details or explanations.
    `;

    // Generate content using the new API approach
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (apiError) {
      console.error('API Error:', apiError);
      
      // Try an alternative model if the first one fails
      try {
        console.log("Attempting with alternative model...");
        const altModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        const altResult = await altModel.generateContent(prompt);
        return altResult.response.text();
      } catch (altError) {
        console.error('Alternative model also failed:', altError);
        return generateMockPlan(userData, exercises);
      }
    }
  } catch (error) {
    console.error('Error generating plan:', error);
    return generateMockPlan(userData, exercises);
  }
}

// Generate a mock plan when API is not available
function generateMockPlan(userData, exercises) {
  const name = userData.name || 'Client';
  const exerciseList = exercises.map(ex => ex.title).join(', ');
  
  return `ONE WEEK FITNESS PLAN FOR ${name.toUpperCase()}

7-DAY FILIPINO FITNESS & MEAL PLAN

Your Profile
    Name: ${userData.name || 'Not specified'}
    Age: ${userData.age || 'Not specified'}
    Gender: ${userData.gender || 'Not specified'}
    Weight: ${userData.weight || 'Not specified'} ${userData.weightUnit || ''}
    Height: ${userData.height || 'Not specified'} ${userData.heightUnit || ''}
    Selected Exercises: ${exerciseList}

MONDAY
    Workout: 30 minutes cardio + ${exercises[0]?.title || 'Walking'} (3 sets of 12 reps)
    Breakfast: Champorado with low-fat milk (350 cal)
    Snack: Banana (100 cal)
    Lunch: Sinigang na Isda with vegetables (450 cal)
    Snack: Kamote Cue (1 piece, 200 cal)
    Dinner: Ginisang Monggo with malunggay and small portion of fish (400 cal)

TUESDAY
    Workout: Strength training with ${exercises[1]?.title || 'Push-ups'} and ${exercises[2]?.title || 'Squats'}
    Breakfast: Whole grain pandesal with kesong puti and fresh papaya (400 cal)
    Snack: Boiled saba banana (150 cal)
    Lunch: Chicken Tinola with malunggay and sayote (400 cal)
    Snack: Fresh mango slices (120 cal)
    Dinner: Ginisang Togue with tofu and lean pork (380 cal)

WEDNESDAY
    Workout: Rest day or light walking (30 minutes)
    Breakfast: Arroz Caldo with egg white and ginger (320 cal)
    Snack: Singkamas sticks (80 cal)
    Lunch: Inihaw na Bangus with ensaladang talong (450 cal)
    Snack: Fresh langka (100 cal)
    Dinner: Nilagang Baka (lean cuts) with vegetables (420 cal)

THURSDAY
    Workout: Full body workout with all selected exercises
    Breakfast: Oatmeal with latik and banana (350 cal)
    Snack: Boiled kamote (sweet potato) (130 cal)
    Lunch: Pinakbet with small portion of grilled fish (420 cal)
    Snack: Chico fruit (150 cal)
    Dinner: Chicken Afritada with vegetables (400 cal)

FRIDAY
    Workout: Cardio and core exercises
    Breakfast: Scrambled egg with tomatoes and malunggay, paired with brown rice (380 cal)
    Snack: Avocado with condensed milk (200 cal)
    Lunch: Sinigang na Hipon with vegetables (400 cal)
    Snack: Boiled peanuts (150 cal)
    Dinner: Ginisang Ampalaya with egg and lean ground pork (350 cal)

SATURDAY
    Workout: Strength training with selected exercises
    Breakfast: Bibingka with egg (350 cal)
    Snack: Fresh lanzones (100 cal)
    Lunch: Chicken Adobo (lean cut) with half cup of brown rice (450 cal)
    Snack: Star apple (80 cal)
    Dinner: Pancit Canton with vegetables and small portion of chicken (400 cal)

SUNDAY
    Workout: Rest day or light exercises
    Breakfast: Whole wheat ensaymada with hot chocolate (using tablea) (400 cal)
    Snack: Fresh atis fruit (150 cal)
    Lunch: Kare-kare (mostly vegetables) with small portion of meat (480 cal)
    Snack: Turon (1 small piece, 180 cal)
    Dinner: Tinolang Manok with malunggay and sayote (380 cal)

NUTRITIONAL REFERENCES
    Pinggang Pinoy - Food and Nutrition Research Institute (FNRI): http://www.fnri.dost.gov.ph/index.php/tools-and-standard/pinggang-pinoy
    Philippine Food Composition Tables by FNRI: http://www.fnri.dost.gov.ph/index.php/tools-and-standard/philippine-food-composition-tables
    Department of Health Nutritional Guidelines: https://doh.gov.ph/node/839
    National Nutrition Council of the Philippines: http://www.nnc.gov.ph/plans-and-programs/philippine-plan-of-action-for-nutrition`;
}

// New endpoint for contact form
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide name, email and message' 
      });
    }
    
    // Log the submission
    console.log('Contact form submission:');
    console.log(`From: ${name} (${email})`);
    console.log(`Message: ${message}`);
    console.log(`To be sent to: spradax20@gmail.com`);
    
    // Email options
    const mailOptions = {
      from: '"OneWeekFit Contact" <spradax20@gmail.com>', // REPLACE WITH YOUR ACTUAL GMAIL
      to: 'spradax20@gmail.com',
      subject: `OneWeekFit Contact Form: Message from ${name}`,
      text: `You received a message from ${name} (${email}):\n\n${message}`,
      html: `
        <h2>OneWeekFit Contact Form Submission</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to send email. Please try again later.'
        });
      }
      
      console.log('Email sent: ' + info.response);
      res.json({
        success: true,
        message: 'Thank you for your message! We will contact you soon.'
      });
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process your request. Please try again later.' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// API Endpoints
app.post('/api/generate-plan', async (req, res) => {
  try {
    const { userData, exercises } = req.body;
    
    // Validate input
    if (!userData) {
      return res.status(400).json({ error: 'Invalid input. Please provide userData.' });
    }
    
    // Use default exercises if none provided
    const exerciseList = exercises && Array.isArray(exercises) && exercises.length > 0 
      ? exercises 
      : [
          { title: "Walking", type: "cardio" },
          { title: "Push-ups", type: "strength" },
          { title: "Squats", type: "strength" }
        ];
    
    // Generate plan using Gemini AI
    const plan = await generatePlan(userData, exerciseList);
    
    res.json({ plan });
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Failed to generate plan', details: error.message });
  }
});

// For debugging - log all requests to see what's being requested
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

// Handle all other routes - serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the application at http://localhost:${PORT}`);
  console.log(`API endpoint available at http://localhost:${PORT}/api/generate-plan`);
}); 