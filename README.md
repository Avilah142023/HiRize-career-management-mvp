# HIRIZE – Career Management & Recruitment Platform

HIRIZE is a full-stack MERN application that connects **job seekers and recruiters** in a single platform.  
It allows candidates to manage resumes, coverletters, documents and apply for jobs, while recruiters can post jobs and track applicants efficiently.

---

## Problem Statement

Job seekers often manage multiple resumes but lack a system to track job applications.  
Recruiters, on the other hand, need a simple platform to post jobs and manage candidates.

HIRIZE solves both by providing:
- A **career management system for candidates**
- A **job posting and applicant tracking system for recruiters**

---

## Features

### Candidate Features
- Secure Login & Registration (JWT Authentication)
- Upload resumes, cover letters, and documents
- Preview uploaded files directly in the browser
- Persistent file storage (data remains after refresh)
- Browse available jobs
- Search jobs by:
  - Job Title  
  - Skills  
  - Company Name  
- Apply to jobs
- Clean and responsive dashboard UI

---

### Recruiter Features
- Secure Recruiter Login
- Post new job openings
- View all posted jobs (My Jobs)
- View detailed job information
- Track number of applicants per job
- Toggle job status (Active / Closed)
- View applicants for each job
- Shortlist or reject candidate using ATS score
- Structured recruiter dashboard with sidebar navigation

---

### Core System Features
- Role-based access control (Candidate / Recruiter)
- Protected routes using JWT authentication
- RESTful API architecture
- Debounced job search (optimized performance)
- Dynamic UI updates using React state management

---

## User Experience (UX)

- Minimal and clean UI using Tailwind CSS
- Responsive dashboard layouts
- Smooth navigation with React Router
- Real-time search experience
- Consistent UI across candidate and recruiter dashboards
- Optimized performance using debouncing

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer (File Upload Handling)

---

## Project Structure

HIRIZE/
│
├── Backend/
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ ├── uploads/
│ └── server.js
│
├── Frontend/
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ └── App.jsx
│ └── vite.config.js
│
└── README.md


---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Avilah142023/HiRize-career-management-mvp.git

### 2. Backend Setup
```bash
cd Backend
npm install
npm start

### 3. Frontend Setup
Frontend Setup: 
```bash
cd frontend
npm install
npm start