<p align="center">
    <img src="https://github.com/JustNormalProgrammer/StudyUp/blob/main/frontend/public/StudyUpLogo.png" width="300" alt="StudyUp Logo"/>
</p>

# StudyUp – Learning Session Tracker with AI Quizzes

StudyUp is a fullstack web application designed to support the learning process by helping users organize their study sessions, track progress over time, and actively verify their knowledge using AI-generated quizzes.

The application focuses on structured learning. Instead of passively consuming material, users can log detailed study sessions, associate them with specific resources, and later validate their understanding through dynamically generated quizzes. By combining data tracking with AI, StudyUp encourages consistent learning habits and active recall.

<img width="1286" height="856" alt="Dashboard" src="https://github.com/user-attachments/assets/a9f00e6c-6d67-49de-b828-9744dc6a894d" />

## Application Overview

At the core of the application are study sessions, which represent individual learning activities. Each session allows the user to define what they studied, studying duration, and what materials they used. This creates a structured history of learning that can be easily reviewed and analyzed.

<img width="1203" height="966" alt="SessionView" src="https://github.com/user-attachments/assets/b24af8f7-6424-45d3-a36f-cd7d6ee1974e" />
<img width="1304" height="965" alt="SessionDetailView" src="https://github.com/user-attachments/assets/5c3eb601-bc88-4c33-a42c-43648a2667ac" />

All learning activity is visualized through an interactive calendar, where users can quickly see when they studied and how often they completed quizzes. This provides a clear overview of consistency and engagement over time.

<img width="1215" height="963" alt="CalendarView" src="https://github.com/user-attachments/assets/b0a9c94d-01a8-4b16-a65c-a5d74cd7a4b1" />

One of the key features of StudyUp is the integration with a large language model, which generates quizzes based on previously created study sessions. This allows users to test their knowledge on exactly the material they have covered, reinforcing learning through active recall rather than passive review.

<img width="1284" height="1081" alt="QuizAttempt" src="https://github.com/user-attachments/assets/eb00d42d-fa15-482b-a156-fa0316795c9c" />

The application also includes a resource management system. Users can store learning materials such as books, articles, or videos and reuse them across multiple study sessions without duplication. Each resource can be enriched with additional context using labels, for example specifying which chapters or sections were studied during a session.

<img width="1147" height="855" alt="ResourcesList" src="https://github.com/user-attachments/assets/1ba06a4b-804c-43fc-a072-a4de1e39fed2" />

## Tech Stack

### Frontend
- React
- TypeScript
- TanStack Query / Router
- Shadcn UI
- Recharts
- FullCalendar

### Backend
- Node.js (Express)
- PostgreSQL
- Drizzle ORM
- JWT authentication (access and refresh tokens)
