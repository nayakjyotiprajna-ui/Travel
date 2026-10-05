# 🌍 TravelTwin — AI-Powered Virtual Travel & Accessibility Platform

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Immersive 3D Destinations • AI Personal Travel Twin • Real-Time Collaborative Rooms • Digital Passport • Memory Scrapbook**

[Explore Features](#-key-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Environment Variables](#-environment-variables) • [Project Structure](#-project-structure)

</div>

---

## 📖 Overview

**TravelTwin** is a full-stack, next-generation virtual travel platform that makes the world accessible to everyone. Powered by **Three.js** 3D visualization, **Google Gemini AI**, **Firebase**, and real-time **Socket.io** collaboration, TravelTwin allows users to explore hyper-realistic 3D global destinations, simulate tailored journeys, travel together with friends in virtual rooms, collect digital passport stamps, and preserve vacation memories.

Designed with accessibility at its core, TravelTwin features dedicated modes for reduced motion, high contrast, and screen-reader assistance so that physical limitations never prevent anyone from exploring the globe.

---

## ✨ Key Features

### 🌐 1. Interactive 3D World & Destinations
- **Interactive 3D Globe**: Built with Three.js / React Three Fiber, featuring interactive destination markers, smooth orbit controls, and atmospheric glow.
- **Dynamic 3D Scenes**: Explore procedural 3D environments with dynamic day/night cycles, weather effects (sunny, rainy, foggy, snowy), and mini-maps.
- **Spatial Audio Ambiance**: Custom synthesized web-audio ambient soundscapes for beaches, bustling cities, temples, and tranquil nature.

### 🤖 2. AI Travel Twin & Virtual Tour Guide
- **Personalized Travel Twin**: Generates personalized travel personalities and itineraries based on traveler preferences, budget, pace, and interests.
- **Intelligent In-Tour Guide**: Context-aware AI tour guide answering real-time questions about architecture, local culture, customs, and hidden gems.
- **Interactive Stage Simulations**: Step-by-step interactive journey simulations with choices, budget tracking, and real-time advice.

### 👥 3. Real-Time "Travel Together" Rooms
- **Multiplayer Synchronized Exploration**: Create or join virtual rooms using Socket.io to experience destinations simultaneously with friends or family.
- **Live Room Chat & Reactions**: Express emotions with live floating emoji reactions, chat messaging, and synchronized destination navigation.

### 🛂 4. Digital Passport & Gamification
- **Custom Digital Passport**: A book-style interactive passport displaying visited countries, stamps, and traveler rank.
- **Achievements & Badges**: Unlock milestones (e.g., *Globe Trotter*, *Culture Explorer*, *Eco Wanderer*).
- **Travel Stats**: Track total virtual miles travelled, countries unlocked, and simulation stages completed.

### 📸 5. Memory Scrapbook & Journaling
- **Capture Moments**: Take snapshots of 3D views during virtual experiences.
- **Photo Journaling**: Upload photos and write travel memoirs saved directly to **Firebase Cloud Storage** and MongoDB.

### ♿ 6. Inclusive Accessibility Features
- **High-Contrast Mode**: Enhanced color contrast compliant with accessibility guidelines.
- **Reduced Motion**: Disables intensive 3D rotations, transitions, and particle effects for motion-sensitive users.
- **Custom Font Scaling & Screen Reader Friendly UI**: Tailored typography and ARIA labels throughout the entire application.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS, Lucide React icons, Glassmorphism design system
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Real-Time Client**: `socket.io-client`
- **Authentication & Storage**: Firebase SDK (Google Auth, Email/Password, Cloud Storage)
- **Routing**: React Router v7

### Backend
- **Runtime**: Node.js & Express with TypeScript (`tsx` execution)
- **Database**: MongoDB with Mongoose ODM
- **Real-Time Engine**: Socket.io server with room management
- **Authentication**: JWT authentication & Firebase Admin verification
- **AI Integration**: Google Gemini API (`@google/genai` / REST) with built-in heuristic fallback engine
- **Security & Utilities**: CORS, dotenv, bcryptjs

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or a MongoDB Atlas cluster URI)
- (Optional) [Firebase Project](https://console.firebase.google.com/) for Google Sign-in & image uploads
- (Optional) [Google Gemini API Key](https://aistudio.google.com/) for AI generation features

---

### 1. Clone the Repository
```bash
git clone https://github.com/nayakjyotiprajna-ui/Travel.git
cd Travel
```

### 2. Install Dependencies
Install dependencies for both client and server with a single command:
```bash
npm run install:all
```
*(Or run `npm install` in root, `client/`, and `server/` separately).*

---

### 3. Configure Environment Variables

#### Backend (`server/.env`):
Create `server/.env` based on `server/.env.example`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/traveltwin
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
AI_API_KEY=your_gemini_api_key_here
AI_MODEL=gemini-1.5-flash
```

#### Frontend (`client/.env`):
Create `client/.env` based on `client/.env.example`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# Optional: Firebase Authentication & Storage
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

### 4. Seed Database with Curated Destinations
Populate MongoDB with world wonders, Kyoto shrines, Paris landmarks, and simulated activities:
```bash
npm run seed
```

---

### 5. Launch the Development Server
Run both frontend and backend concurrently:
```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 📁 Project Structure

```plaintext
TRAVELTWIN/
├── client/                     # Vite + React + TypeScript Frontend
│   ├── public/                 # Static assets, SVG icons, favicons
│   ├── src/
│   │   ├── assets/             # Images and graphic assets
│   │   ├── components/         # Reusable modular UI components
│   │   │   ├── 3d/             # Three.js 3D Globe, Scenes, Audio Ambiance, MiniMap
│   │   │   ├── common/         # Navbar, Footer, Modals, Error/Empty states
│   │   │   ├── experience/     # AI Guide Drawer, Activities, Memory Capture
│   │   │   ├── passport/       # Digital Passport Book component
│   │   │   ├── room/           # Collaborative Travel Room views
│   │   │   └── simulation/     # Itinerary planner & interactive stage views
│   │   ├── config/             # Firebase SDK client initialization
│   │   ├── context/            # AuthContext and AccessibilityContext
│   │   ├── pages/              # Route pages (Home, Explore, Simulate, Passport, etc.)
│   │   ├── services/           # Axios API, Socket.io, Firebase Auth & Storage
│   │   └── types/              # Comprehensive TypeScript interfaces
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── server/                     # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config/             # MongoDB connection configuration
│   │   ├── controllers/        # Express handlers (Auth, AI, Destination, Rooms, etc.)
│   │   ├── middleware/         # JWT Auth, Admin guards, Error handling
│   │   ├── models/             # Mongoose schemas (User, Destination, Memory, Room, etc.)
│   │   ├── routes/             # REST API endpoint definitions
│   │   ├── services/           # Gemini AI service integration & fallback engine
│   │   ├── sockets/            # Socket.io real-time room communication
│   │   ├── utils/              # Seed datasets for worldwide destinations
│   │   ├── seed.ts             # Database seeding script
│   │   └── server.ts           # HTTP & Socket.io server entry point
│   ├── tsconfig.json
│   └── package.json
│
├── .env.example                # Global environment templates
├── .gitignore                  # Git ignore rules for node_modules, .env, build output
├── package.json                # Root orchestration scripts
└── README.md                   # Project documentation
```

---

## 📡 REST API Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `GET` | `/api/destinations` | List destinations with category & search filter | No |
| `GET` | `/api/destinations/:id` | Retrieve detailed destination information | No |
| `POST` | `/api/ai/guide` | Real-time question response from AI tour guide | No |
| `POST` | `/api/ai/plan` | Generate AI-powered itinerary & simulation | Yes |
| `GET` | `/api/passport` | Retrieve user digital passport and stamps | Yes |
| `POST` | `/api/rooms/create` | Create a real-time collaborative travel room | Yes |
| `GET` | `/api/memories` | List captured travel moments and memories | Yes |
| `POST` | `/api/memories` | Save a new memory with photo and notes | Yes |

---

## 🔒 Security & Best Practices

- **Zero Secret Exposure**: `.env` files are strictly excluded from source control via `.gitignore`.
- **Protected Endpoints**: User routes protected via JSON Web Tokens (JWT) and Firebase tokens.
- **Fail-Safe AI**: Intelligent fallback engine provides high-quality guidance even if external AI rate limits or network issues occur.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
Developed with ❤️ by <a href="https://github.com/nayakjyotiprajna-ui">nayakjyotiprajna-ui</a>
</div>
