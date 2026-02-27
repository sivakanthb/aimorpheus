# ⚡ SkillForge - Forge Your AI Learning Path

Welcome to **SkillForge**, the ultimate personalized AI learning portal that guides you through your self-sourced journey to mastering artificial intelligence. Whether you're a complete novice or an experienced developer, SkillForge intelligently recommends learning paths tailored to your unique profile.

## 🚀 Features

- **Smart Personalization**: Tell us about your skills, time availability, interests, and learning style
- **Intelligent Recommendations**: AI-powered algorithm suggests the perfect learning paths for you
- **Match Scoring**: See how well each path aligns with your profile (0-100%)
- **7 Comprehensive Paths**: From AI Fundamentals to Reinforcement Learning and Generative AI
- **Hands-On Resources**: Direct links to platforms where you can practice and experiment
- **Detailed Modules**: Each path includes structured modules with duration and skill outcomes
- **Beautiful UI**: Responsive, modern interface built with Tailwind CSS

## 🎯 How It Works

1. **Profile Builder**: Answer 6 quick questions about your skills, time, interests, and expertise
2. **Smart Matching**: Our algorithm analyzes 4 key compatibility factors
3. **Get Recommendations**: See your top 5 personalized learning paths
4. **Deep Dive**: Explore complete module breakdowns for any path
5. **Start Learning**: Get links to hands-on platforms to practice

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.6 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Linting**: ESLint 9
- **Runtime**: Node.js 24.14.0+

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 24.14.0+
- npm 11.9.0+

### Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   ```
   http://localhost:3000
   ```

## 📊 Available Learning Paths

| Path | Level | Duration | Focus Area |
|------|-------|----------|-----------|
| AI Fundamentals | Beginner | 40h | Core AI concepts |
| Applied Machine Learning | Intermediate | 50h | Production ML systems |
| Deep Learning Mastery | Advanced | 80h | Neural networks |
| Natural Language Processing | Intermediate | 60h | Language models & NLP |
| Computer Vision Mastery | Advanced | 70h | Image processing |
| Reinforcement Learning | Expert | 90h | Agents & RL |
| Generative AI & LLMs | Intermediate | 55h | Modern AI tools |

## 📚 Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting checks
npm run lint
```

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx           # Main entry point
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global Tailwind styles
│
├── components/
│   ├── AILearningPortal.tsx      # Main app component
│   ├── OnboardingForm.tsx        # User profile form
│   ├── LearningPathCard.tsx      # Path cards
│   ├── RecommendationsDisplay.tsx # Results display
│   └── PathDetailModal.tsx       # Path details modal
│
├── lib/
│   ├── recommendations.ts # Matching algorithm
│   ├── learningPaths.ts   # Learning paths database
│
└── types/
    └── index.ts           # TypeScript interfaces
```

## 🧠 Smart Recommendation Algorithm

SkillForge uses a weighted scoring system that considers:

- **Skill Level Compatibility** (25%): Matches your current level with path difficulty
- **Time Feasibility** (25%): Ensures the path fits your weekly availability
- **Interest Alignment** (30%): Prioritizes paths matching your interests
- **Capability Building** (20%): Values paths that enhance your existing skills

## 🎨 UI/UX Highlights

- **Color-Coded Sections**: Visual distinction for different preference categories
- **Progress Bars**: Match score visualization at a glance
- **Responsive Grid**: Mobile-friendly layout that adapts to any screen size
- **Modal Details**: Deep dive into path details without leaving the page
- **Inspirational Design**: Beautiful gradient headers and engaging visuals

## 🌟 Special Features

### For Beginners
- "No Coding Experience" option for complete novices
- Beginner-friendly recommendations
- Foundation-focused learning paths

### Hands-On Learning Resources
- **Python & ML**: Kaggle, Google Colab, TensorFlow Playground
- **Generative AI**: ChatGPT, Hugging Face, Runway ML
- **Computer Vision**: OpenCV, Roboflow, MediaPipe
- **Community**: GitHub, Stack Overflow, Course Platforms

### Feedback System
- Share your thoughts on UI, layout, and navigation
- Help us improve SkillForge with your valuable feedback

## 🚀 Getting Started

1. Visit http://localhost:3000
2. Provide your learning profile information
3. Get personalized AI learning path recommendations
4. Explore detailed course modules
5. Access hands-on learning resources
6. Share your feedback to help us improve

## 🔮 Future Enhancements

- User authentication and profile persistence
- Progress tracking across learning paths
- Certificate generation upon completion
- Community forums and peer learning
- Real course content integration
- Adaptive difficulty adjustment
- Advanced learning analytics dashboard

## 📝 Notes

- The recommendation algorithm is highly customizable
- Learning paths can be updated in `src/lib/learningPaths.ts`
- Add new preference types in `src/types/index.ts`
- Tailwind CSS makes styling easy and consistent

## 🤝 Contributing

We'd love your feedback! Please share your thoughts on:
- UI/UX and design
- Navigation and usability
- Feature suggestions
- Bug reports

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ to help you master AI and forge your own learning path!**

🚀 Start your journey now at http://localhost:3000
