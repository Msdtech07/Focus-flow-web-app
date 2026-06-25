# FocusFlow — Know Your Next 3 Moves 🎯✅

A productivity web app that eliminates decision fatigue by analyzing your task list and surfacing the **3 highest-impact tasks** to focus on each day, with a calculated score and a plain-English reason for every pick. Built with React, TypeScript, and a Supabase backend, with an optional AI-powered scoring mode using OpenAI GPT-4o.

## 🚀 Features

* Add, edit, and complete tasks with priority, deadline, and effort estimates
* Auto-generates your **Top 3** tasks every day, ranked by score
* Each pick comes with a short reason (e.g. "due in 8 hours", "quick win")
* Personal analytics — completion rate, streaks, focus score
* Team workspace with shared priorities and team analytics
* Daily reflections log
* Subscription billing (Pro / Team plans)
* Automatic daily "Focus Email" sent every morning
* Optional AI-powered scoring mode (GPT-4o) as an alternative to the fixed formula

## 🛠️ Technologies Used

* React 19 + TypeScript
* Vite 7
* TanStack Start / Router / Query
* Tailwind CSS v4 + shadcn/ui
* Zustand (local state / demo mode)
* Supabase (PostgreSQL, Auth, Row Level Security)
* Groq + Llama 3.
* n8n (workflow automation)
* Razorpay (payments)
* PostHog (analytics, optional)

## 📂 Project Structure

```
FocusFlow/
│
├── src/
│   ├── components/        # UI components (sidebar, dialogs, marketing sections)
│   ├── lib/
│   │   ├── store.ts        # Local demo data store (swap for Supabase)
│   │   ├── auth.ts          # Auth logic (swap for Supabase Auth)
│   │   └── types.ts         # Shared data types
│   └── routes/             # Pages (marketing, auth, app screens)
│
├── supabase/
│   └── full-schema.sql      # Database tables + RLS policies
│
├── n8n/
│   ├── workflow-1-priority-generator.json     # AI-powered Top 3 generator
│   ├── workflow-2-daily-focus-email.json       # Daily 7am email
│   └── workflow-3-razorpay-subscriptions.json  # Billing webhook sync
│
├── .env.example
├── package.json
└── README.md
```

## ⚙️ Installation

### 1️⃣ Clone the Repository

```
git clone https://github.com/your-username/FocusFlow.git
cd FocusFlow
```

### 2️⃣ Install Dependencies

```
bun install
```

Or with npm:

```
npm install
```

## ▶️ Run the Application

```
bun run dev
```

The app runs immediately against a built-in local demo store — no database or API keys required to try it out.

## 🧠 Scoring Logic

The Top 3 are chosen using a weighted score:

```
score = priority_weight + deadline_bonus + quick_win_bonus
```

* **priority_weight** → Urgent = 100, High = 70, Medium = 40, Low = 15
* **deadline_bonus** → +60 if due in <24h, +30 if <72h, +10 if <7 days
* **quick_win_bonus** → up to +30 extra for short, low-effort tasks

All active tasks are scored, sorted highest to lowest, and the **top 3** are shown with an auto-generated reason explaining the pick.

## 📌 How It Works

1. User adds tasks with a priority, optional deadline, and estimated effort
2. Each task is scored using the formula above
3. Tasks are sorted and the top 3 are selected
4. A short reason is generated for each selected task
5. Results are displayed on the **Today** screen

## 🔍 Prediction Output Example

```
#1 Finish client proposal — Score: 142
Reason: urgent priority • due within 24h

#2 Fix login bug — Score: 98
Reason: high priority • quick win

#3 Reply to investor email — Score: 70
Reason: high priority
```

## 📈 Future Improvements

* Switch the AI scoring mode (Groq + Llama 3) to the default ranking engine
* Confidence/impact visualization for each task
* Native mobile app
* Calendar integration
* Slack/Notion integration for task import
* Smarter team-level prioritization

## 🔒 Use Cases

* Personal daily planning and focus
* Startup/small team task prioritization
* Reducing decision fatigue in busy work environments
* Daily standup prep for teams

## 👨‍💻 Author

Developed by Priyanshu Tiwari as a productivity SaaS project.

## 📜 License

No license has been set yet — all rights reserved by default. Add a `LICENSE` file (MIT is common for SaaS starters) if you plan to open-source this.

