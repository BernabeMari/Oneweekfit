# OneWeekFit - AI-Powered Fitness & Meal Plan Generator

OneWeekFit is a web application that generates personalized 7-day fitness and meal plans using Google's Gemini AI. The application takes into account user details like age, gender, weight, height, religious dietary restrictions, and preferred exercises to create customized plans.

## Project Structure

The project consists of two main parts:

- **Frontend**: A responsive web interface built with HTML, CSS, and JavaScript
- **Backend**: A Node.js/Express server that interfaces with the Google Gemini AI API

## Features

- User profile input form for personal details
- Exercise selection interface with visual gallery
- AI-generated 7-day personalized fitness and meal plans
- Responsive design that works on desktop and mobile devices
- Print and share functionality for generated plans

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- A Gemini API key from Google AI Studio (https://ai.google.dev/)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following content:
   ```
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   Replace `your_gemini_api_key_here` with your actual Gemini API key.

4. Start the backend server:
   ```
   npm run dev
   ```
   The server will start on http://localhost:3000

### Frontend Setup

The frontend is static HTML, CSS, and JavaScript. You can serve it using any web server. For development, you can use the built-in server in the backend:

1. Make sure the backend server is running.
2. Open a web browser and navigate to http://localhost:3000

## Usage

1. Fill in your personal details in the form
2. Select exercises you'd like to include in your plan by clicking on the images in the gallery
3. Click "Generate My Plan" button
4. Wait for the AI to generate your personalized plan (this may take 10-20 seconds)
5. View your generated plan, which includes detailed meal plans and workout routines
6. Use the print or download options to save your plan

## API Endpoints

### Generate Plan

**Endpoint:** `POST /api/generate-plan`

**Request Body:**

```json
{
  "userData": {
    "name": "John Doe",
    "age": 30,
    "gender": "male",
    "religion": "Christianity",
    "weight": 80,
    "weightUnit": "kg",
    "height": 180,
    "heightUnit": "cm"
  },
  "exercises": [
    {
      "title": "Running",
      "type": "cardio"
    },
    {
      "title": "Push-ups",
      "type": "strength"
    }
  ]
}
```

**Response:**

```json
{
  "plan": "The generated fitness and meal plan as text"
}
```

### Health Check

**Endpoint:** `GET /api/health`

**Response:**

```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## Technology Stack

- **Frontend**:
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - jQuery for DOM manipulation
  - Parallax.js for scrolling effects

- **Backend**:
  - Node.js
  - Express.js
  - Google Generative AI SDK (@google/generative-ai)
  - dotenv for environment variables
  - CORS for cross-origin resource sharing

## Development

### Frontend Modifications

The main files for frontend development are:
- `index.html` - Main structure and content
- `css/custom.css` - Custom styling for OneWeekFit components
- `js/app.js` - Application logic and API interactions

### Backend Modifications

The main files for backend development are:
- `backend/server.js` - Express server and API endpoints
- `backend/package.json` - Dependencies and scripts

## License

This project is licensed under the MIT License.

## Credits

- Template by [Tooplate](https://www.tooplate.com/view/2124-vertex)
- AI functionality powered by [Google Gemini AI](https://ai.google.dev/) 