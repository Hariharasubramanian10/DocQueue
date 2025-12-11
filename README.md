# DocQueue - Smart Clinic Manager

DocQueue is a modern, client-side clinic management application built with React. It simplifies patient queue management, digitizes appointment notes, generates PDF prescriptions, and features an AI-powered medical assistant using the Google Gemini API.

## 🚀 Features

*   **Secure Authentication**: Multi-user support with secure login and registration for doctors.
*   **Smart Queue System**: Visual dashboard to manage patient flow (Waiting → In Consultation → Completed).
*   **Digital Records**: Save symptoms, diagnoses, and prescriptions locally.
*   **PDF Prescriptions**: Instantly generate and download professional PDF prescriptions.
*   **AI Medical Assistant**: Integrated Gemini Chatbot to assist with diagnosis, symptom analysis, and drafting notes.
*   **Patient History**: Searchable database of past appointments and records.
*   **Offline-First**: Uses `localStorage` for data persistence, ensuring data remains available across reloads.

## 🛠️ Tech Stack

*   **Frontend**: React 19, React Router 7
*   **Styling**: Tailwind CSS (via CDN), FontAwesome
*   **AI Integration**: Google GenAI SDK (Gemini 2.5 Flash model)
*   **Utilities**: jsPDF (PDF generation)
*   **Build/Runtime**: ES Modules (esm.sh)

## 📂 Project Structure

```
/
├── index.html              # Entry point with Import Maps and CDNs
├── index.tsx               # Application root
├── App.tsx                 # Main routing and layout logic
├── types.ts                # TypeScript interfaces and enums
├── metadata.json           # App metadata
├── context/
│   └── ClinicContext.tsx   # Global state management (Auth & Data)
├── components/
│   ├── Navbar.tsx          # Navigation bar
│   └── ChatbotAssistant.tsx# AI Chatbot UI component
├── pages/
│   ├── Login.tsx           # Doctor authentication
│   ├── Register.tsx        # Doctor registration
│   ├── Dashboard.tsx       # Main queue management screen
│   ├── NewAppointment.tsx  # Patient entry form
│   ├── AppointmentDetails.tsx # Consultation interface
│   └── Records.tsx         # Searchable patient history
└── services/
    └── geminiService.ts    # Google Gemini API interaction logic
```

## ⚙️ Setup & Configuration

### Prerequisites
*   A modern web browser (Chrome/Edge/Firefox).
*   A Google Gemini API Key.

### API Key Configuration
This application requires a Google Gemini API key to power the AI assistant.
The application expects `process.env.API_KEY` to be available.

### Running the Project
Since this project uses ES Modules via CDN imports in `index.html`, it is designed to run in environments like:
1.  **Local Development**: Using Vite or Create React App.
2.  **Online Sandboxes**: StackBlitz, CodeSandbox.

**Note on Dependencies**:
External libraries (React, ReactDOM, React Router, GenAI SDK) are loaded via `importmap` in `index.html` pointing to `esm.sh`. This avoids the need for a heavy `node_modules` folder for quick prototyping.

## 📖 Usage Guide

1.  **Register/Login**: Create a doctor account. Data is isolated per doctor.
2.  **Add Patient**: Go to "New Appt" to add a patient to the waiting queue.
3.  **Dashboard**: View the queue. Click "Call Next Patient" or select a specific patient.
4.  **Consultation**:
    *   Enter Symptoms, Diagnosis, and Prescription.
    *   **Use AI**: Click the robot icon in the bottom right or follow the tips to ask Gemini for help with the diagnosis.
    *   **Save**: Saves data to local storage.
    *   **Print**: Download a PDF prescription.
5.  **Finish**: Mark the patient as "Done".

## 🛡️ Data Persistence
All data (doctors, appointments, notes) is stored in the browser's `localStorage`.
*   `docqueue_users`: Registered doctors.
*   `docqueue_appointments`: Appointment records.
*   `docqueue_current_user`: Active session.