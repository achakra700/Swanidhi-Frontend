# Swanidhi - AI Powered Digital Health Companion

Swanidhi is a modern, AI-powered healthcare management system designed to bridge the gap between patients and healthcare providers through intuitive interfaces and advanced AI capabilities.

![Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## 🚀 Key Features

- **AI-Driven Symptom Analysis**: Powered by Google Gemini for accurate health insights.
- **Modern User Dashboard**: Real-time health metrics and activity tracking.
- **3D Visualization**: Interactive medical models using React Three Fiber.
- **Smart Forms**: Validated patient and donor registration systems using Zod and React Hook Form.
- **Secure Authentication**: Integrated role-based access control.

## 🛠️ Tech Stack

- **Framework**: React 18 / Vite
- **Styling**: Vanilla CSS with modern Glassmorphism principles
- **State Management**: TanStack Query (React Query)
- **3D Engine**: Three.js / React Three Fiber
- **AI**: Google Generative AI (Gemini Studio)
- **Validation**: Zod & React Hook Form

## 💻 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/achakra700/Swanidhi-Frontend.git
   cd Swanidhi-Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```
   > [!NOTE]
   > Use `--legacy-peer-deps` to resolve specific version alignments between React 18 and Three.js ecosystem.

3. **Configure Environment:**
   Create a `.env.local` file and add your credentials:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

## 🏗️ Build and Deploy

To build the project for production:

```bash
npm run build
```

The production-ready files will be available in the `dist` directory. This project is optimized for deployment on platforms like Netlify and Vercel.

---

Built with ❤️ for a healthier future.
