# MOON AI — Cosmic Education Platform 🌙

> **"Learn Beyond Limits. Reach for the Moon."**  
> Creator & Owner: **Chandrashekhar Singh**

MOON AI is a futuristic, AI-powered education platform engineered to help students learn, practise, simulate exams, track academic progress, and achieve peak performance.

---

## 🚀 Visual Identity & Design System

- **Official Brand Mark**: Crescent moon embracing a neural-brain symbol (`/assets/aistudio/IMG_20261030_075419_812ab8ea.jpg`).
- **Cosmic Color Palette**: Deep navy and midnight-blue (`#050814`, `#0c1228`), cyan, violet, and electric blue accents.
- **Atmosphere**: Subtle galaxy, stars, planets, and glassmorphism cards.
- **Reference Dashboard**: Accurately recreated from the MOON AI Cosmic Learning Dashboard (`/assets/aistudio/MOON_AI_Cosmic_Learning_Dashboard_e5f070f6.png`).

---

## 📚 Complete Learning Modules

1. **Home Dashboard**:
   - Personalized Hero Welcome with Cosmic Astronaut illustration.
   - Live Student Stats: Daily Streak, Virtual Coins, Study Minutes, XP level bar.
   - Quick Actions grid (AI Tutor, Quiz Arena, Flashcards, PDF Learning, Notes, Focus Timer).
   - Today's Missions with live progress and XP claim buttons.
   - Recent Quiz Results with circular accuracy indicators.
   - Chapter Completion progress bars.
   - Weak Topics diagnostic with instant "Practise Now" launch.
   - Upcoming Exams countdown timer.
   - Overall Study Progress bottom cosmic banner.

2. **AI Tutor**:
   - Powered by Google Gemini (`gemini-3.8-flash` via secure server-side SSE).
   - Step-by-step doubt solving, formula breakdowns, follow-up questions, and Hindi/English support.

3. **Curriculum**:
   - Classes 1 to 12 syllabus support (CBSE, ICSE, State Boards).
   - Subject and chapter organization with practice quizzes.

4. **Quiz Arena**:
   - Timed MCQ quizzes with 30s timers, live score calculation, option selection, and explanations.

5. **Exam Simulator**:
   - Full mock exam mode with 15-minute countdown, question palette (Answered, Marked for Review, Not Answered), and score report.

6. **Flashcards**:
   - 3D interactive flip animation, deck filtering, and "Mastered" progress tracker.

7. **Study Planner**:
   - Daily and weekly task scheduler with completion checkboxes and XP rewards.

8. **Focus Timer**:
   - Pomodoro timer (25m Focus, 5m Short Break, 15m Long Break) that logs study minutes to student stats.

9. **PDF Learning**:
   - Document upload with Gemini AI summaries and chapter questions.

10. **Notes Library**:
    - Categorized chapter notes with search and live editor.

11. **Visual Learning**:
    - Concept maps and diagrams (Photosynthesis, Trigonometry, Heart Circulation).

12. **Voice Learning**:
    - Speech synthesis and voice inquiry for auditory learning.

13. **Weak Topics**:
    - Targeted diagnostic drills to boost accuracy in difficult chapters.

14. **Progress Analytics**:
    - Weekly study-time activity bars and syllabus completion analytics.

15. **Missions & Rewards**:
    - XP leveling system and virtual coins shop.

16. **Admin Panel**:
    - Restricted to Owner **Chandrashekhar Singh** (`csingh19.com@gmail.com`) with system metrics, active learner analytics, and Gemini API usage telemetry.

---

## 📱 PWA & Android Compatibility

- Web App Manifest configured (`/public/manifest.json`).
- Standalone viewport support for mobile browsers and Android home-screen installations.
- Responsive layout tailored for mobile phones, tablets, and desktops.

---

## 🧪 Testing Checklist

- [x] Login page renders Moon AI brain-crescent logo and tagline.
- [x] Google sign-in and guest access work seamlessly.
- [x] Student onboarding updates Class, Board, and Subjects with immediate persistence.
- [x] Home Dashboard matches the cosmic reference design.
- [x] All 16 sidebar navigation tabs navigate to working modules.
- [x] Quiz Arena starts real quizzes with timers, answer selection, and score calculation.
- [x] Focus Timer logs actual study minutes and updates daily missions.
- [x] AI Tutor streams responses using Gemini 3.8 Flash.
- [x] Admin Panel is protected for Chandrashekhar Singh.
- [x] Build passes with zero compilation or lint errors.

---

## 👤 Credits

Created and Owned by **Chandrashekhar Singh**.  
*Learn Beyond Limits. Reach for the Moon.*
