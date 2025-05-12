# OneWeekFit Backend

This is the backend server for the OneWeekFit application, which generates personalized fitness and meal plans using Google's Gemini AI.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- A Gemini API key from Google AI Studio

## Setup

1. Clone this repository
2. Navigate to the backend directory
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the backend directory with the following contents:
   ```
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   Replace `your_gemini_api_key_here` with your actual Gemini API key.

## Running the Server

### Development Mode

To run the server in development mode with auto-restart on file changes:

```
npm run dev
```

### Production Mode

To run the server in production mode:

```
npm start
```

The server will start and listen on the port specified in your `.env` file (default: 3000).

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

## Error Handling

The API returns appropriate HTTP status codes and error messages for different scenarios:

- `400 Bad Request`: Missing required fields or invalid input data
- `500 Internal Server Error`: Server-side errors, including issues with the Gemini API

## License

This project is licensed under the MIT License. 