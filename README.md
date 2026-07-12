# 🎙️ Vocentra

> **Turn Your Voice Into Intelligent Actions**

Vocentra is an AI-powered workflow automation platform that transforms natural spoken language into structured, actionable workflows. Speak naturally, let AI understand your intent, and receive intelligent action plans that can integrate with your favorite productivity tools.

---

## ✨ Overview

Modern professionals spend countless hours manually converting conversations into tasks, reminders, meeting notes, and workflows. Vocentra eliminates this friction by leveraging AI to understand spoken commands and generate organized, actionable outputs.

Whether you're planning your day, managing projects, or summarizing meetings, Vocentra helps you move from **voice to execution** in seconds.

---

## 🚀 Key Features

* 🎤 **Voice-to-Text Input**

  * Record commands directly from your browser.
  * Upload audio recordings for processing.

* 🧠 **AI-Powered Understanding**

  * Extracts intent from natural language.
  * Converts conversations into structured workflows.
  * Generates actionable task lists.

* 📋 **Workflow Generation**

  * Meeting summaries
  * Action items
  * Task planning
  * Project workflows
  * Daily planners

* 📚 **History Dashboard**

  * Access previously generated workflows.
  * Search and organize past commands.

* 👤 **User Authentication**

  * Secure signup and login.
  * JWT-based authentication.
  * Protected user dashboard.

* 📊 **Analytics**

  * Command history
  * Usage statistics
  * Productivity insights

* 🌙 **Modern User Experience**

  * Responsive design
  * Dark mode
  * Smooth animations
  * Mobile-friendly interface

---

## 🏗️ Architecture

```text
                 Browser
                     │
                     ▼
         React + TypeScript + Vite
                     │
              REST API (Axios)
                     │
                     ▼
          Node.js + Express Server
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
    AI Engine    Authentication   Validation
        │
        ▼
 PostgreSQL (Prisma ORM)
```

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* React Query
* Framer Motion
* Axios
* React Hook Form
* Zod

### Backend

* Node.js
* Express.js
* OpenAI SDK
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Zod Validation

### DevOps

* Docker
* Docker Compose
* GitHub Actions (Planned)
* Render
* Vercel
* Supabase PostgreSQL

---

## 📂 Project Structure

```text
Vocentra
│
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       ├── styles/
│       ├── types/
│       └── utils/
│
├── server/
│   └── src/
│       ├── ai/
│       ├── config/
│       ├── controllers/
│       ├── db/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       └── validators/
│
├── prisma/
├── docker/
├── docs/
├── README.md
└── docker-compose.yml
```

---

## 💡 Example

### User Command

> "Schedule a meeting with the development team tomorrow at 4 PM and remind everyone on Slack."

### AI Output

```text
Meeting
───────────────
Title:
Development Team Sync

Date:
Tomorrow

Time:
4:00 PM

Tasks
───────────────
✔ Create calendar event
✔ Notify Slack channel
✔ Send meeting reminder
```

---

## 🚧 Development Roadmap

### Phase 1

* Project restructuring
* Modern architecture
* Frontend foundation

### Phase 2

* Responsive landing page
* Authentication
* Dashboard

### Phase 3

* Voice recording
* Speech-to-text
* AI workflow generation

### Phase 4

* Workflow history
* Saved templates
* User analytics

### Phase 5

* Third-party integrations
* Deployment
* Performance optimization

---

## ⚙️ Local Development

### Clone the Repository

```bash
git clone https://github.com/your-username/vocentra.git
cd vocentra
```

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create a `.env` file:

```env
OPENAI_API_KEY=your_api_key
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
```

### Start the Development Server

```bash
npm run dev
```

---

## 🌐 Deployment

| Service          | Platform            |
| ---------------- | ------------------- |
| Frontend         | Vercel              |
| Backend          | Render              |
| Database         | Supabase PostgreSQL |
| Containerization | Docker              |

---

## 📈 Future Enhancements

* Google Calendar Integration
* Slack Integration
* Microsoft Teams Integration
* Notion Integration
* Jira Integration
* Trello Integration
* AI Workflow Templates
* Multi-language Speech Recognition
* Real-time Collaboration
* Mobile Application

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository, submit issues, or create pull requests to improve Vocentra.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Nayan Kumar Shukla**

B.Tech Computer Science Engineering

Building AI-powered software solutions with modern web technologies.

---

# ⭐ If you like this project, consider giving it a star and following its development.
