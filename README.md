# Mémoire by L'Oréal - Bespoke Fragrance Atelier

Mémoire is a luxury fragrance experience that combines haute perfumery with AI-driven emotional resonance. This application allows users to undergo an Olfactive Diagnostic, book private atelier sessions, and control their smart home scent environment.

## Features

- **Olfactive Diagnostic**: A multi-phase sensory exploration to map emotional and sensory preferences.
- **Atelier Reservations**: Book private consultations with Master Perfumers at exclusive L'Oréal boutiques.
- **Smart Home Integration**: Control scent diffusers, air purifiers, lighting, and climate in your home.
- **AI-Powered**: Uses Gemini AI to analyze diagnostic results and generate bespoke fragrance blueprints.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Animations**: Motion (formerly Framer Motion)
- **Icons**: Lucide React
- **Backend/Database**: Firebase (Authentication & Firestore)
- **AI**: Google Gemini API (@google/genai)

## Getting Started Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository** (or download the source code).

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   VITE_APP_URL=http://localhost:3000
   ```
   *Note: The application uses `process.env.GEMINI_API_KEY` for server-side/runtime calls and `import.meta.env.VITE_APP_URL` for client-side references.*

4. **Firebase Configuration**:
   The application expects a `firebase-applet-config.json` file in the root directory. If you are setting up your own Firebase project:
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Create a new project.
   - Add a Web App to your project.
   - Copy the configuration object and save it as `firebase-applet-config.json` in the root:
     ```json
     {
       "apiKey": "...",
       "authDomain": "...",
       "projectId": "...",
       "storageBucket": "...",
       "messagingSenderId": "...",
       "appId": "...",
       "firestoreDatabaseId": "(optional: your-database-id)"
     }
     ```

### Running the App

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open your browser**:
   Navigate to `http://localhost:3000` to view the application.

## Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs TypeScript type checking.

## Project Structure

- `src/pages/`: Main application screens (Home, Diagnostic, Appointment, etc.)
- `src/components/`: Reusable UI components.
- `src/firebase.ts`: Firebase initialization and helper functions.
- `firestore.rules`: Security rules for Cloud Firestore.
- `firebase-blueprint.json`: Data structure definition for the project.
