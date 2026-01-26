# HIRIZE – Career Management Platform

HIRIZE is a full-stack web application designed to help job seekers manage multiple resumes, cover letters, and supporting documents in one place.  
The project is built as a Proof of Concept (POC) with a strong focus on usability, modular design, and extensibility for future career-tracking features.

---

## Problem Statement

Job seekers often maintain multiple versions of resumes for different roles, but managing, previewing, and organizing them efficiently is difficult. HIRIZE solves this problem by allowing users to upload, preview, and manage resumes and documents in one place. Users can also keep note of the details about the Interviews they have attended such as: Company name, Job role, Interview date and place, pros & Cons of their experience.

---

## Features

HIRIZE provides a simple, intuitive dashboard where users can:
- Register and log in securely
- Upload resumes, cover letters, and documents
- Preview uploaded files directly in the browser
- Retain uploaded files even after page refresh
- Manage files with a clean UI built for scalability

The application architecture allows easy expansion into advanced features such as job tracking, analytics, and AI-driven recommendations in the future.

---

## User Experience (UX) Rationale

- **Minimal and clean UI** to reduce cognitive load
- **Immediate file preview** to improve usability
- **Persistent uploads** using backend storage and database mapping
- **Clear separation of concerns** between frontend and backend
- **Modular structure** to support future enhancements

> The Job Preference screen currently serves as a foundation for future career-tracking features

---

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer (File upload handling)

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

##  Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Avilah142023/HiRize-career-management-mvp.git

'''

### 2.Backend Setup
```bash
cd Backend
npm install
npm start

### 3. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
