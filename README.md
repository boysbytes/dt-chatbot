# Design Thinking Chatbot

This is a React application that guides users through the Design Thinking process, using a chatbot powered by Google's Gemini API to simulate user interviews and testing.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js and npm (or yarn)
- A Firebase project
- A Gemini API key

### Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd dt-chatbot
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```
4. Create a `.env` file in the root of the project and add the following environment variables:

   ```
   REACT_APP_FIREBASE_CONFIG={"apiKey":"...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key
   ```

   Replace the values with your actual Firebase project configuration and Gemini API key.

5. Start the development server:
   ```sh
   npm start
   ```

   The application will be available at `http://localhost:3000`.

## Building for Production

To create a production build, run:

```sh
npm run build
```

This will create a `build` folder with the optimized and minified files.

## Deployment to Vercel

This application is ready to be deployed to Vercel.

1. Push your code to a GitHub repository.
2. Create a new project on Vercel and import your GitHub repository.
3. Vercel should automatically detect that this is a Create React App project and configure the build settings.
4. In the project settings on Vercel, add the following environment variables:
   - `REACT_APP_FIREBASE_CONFIG`: Your Firebase configuration as a JSON string.
   - `REACT_APP_GEMINI_API_KEY`: Your Gemini API key.
5. Deploy the application.

Vercel will automatically build and deploy your application. Each time you push a change to your GitHub repository, Vercel will trigger a new deployment.
