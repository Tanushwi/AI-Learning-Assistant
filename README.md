# Smart Study – AI-Powered Learning Assistant

## Overview

Smart Study is an AI-powered learning platform designed to help students study more efficiently by transforming study materials into interactive learning resources. Users can upload documents such as PDFs, DOCX files, PPTs, and images, and the platform generates AI-powered summaries, flashcards, quizzes, and answers to questions based on the uploaded content.

The project combines modern web technologies, OCR, and Generative AI to create a smart and personalized learning experience.

---

## Features

- Secure User Authentication (JWT-based)
- Smart Document Upload & Management
- OCR-Based Text Extraction from Images
- AI-Powered Summary Generation
- AI Chat for Doubt Solving
- Automatic Flashcard Generation
- Quiz Generation for Self-Assessment
- Dashboard & Progress Tracking
- Support for PDF, DOCX, PPT, and Image Files

---

## System Workflow

```text
User Uploads Document
         ↓
Text Extraction (OCR/Parsers)
         ↓
Text Chunking & Processing
         ↓
Gemini AI Integration
         ↓
Summary / Flashcards / Quiz Generation
         ↓
Results Displayed to User
```

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JWT Authentication
- bcrypt

### AI & OCR
- Google Gemini AI
- Retrieval-Augmented Generation (RAG)
- Tesseract.js OCR

### File Processing
- pdfjs-dist
- mammoth
- officeparser

---

## Key Functionalities

### AI-Powered Summarization
Generates concise summaries from uploaded study materials.

### Flashcard Generation
Automatically creates flashcards for effective revision.

### Quiz Generation
Creates quizzes for self-assessment.

### AI Chat Assistant
Allows users to ask questions related to uploaded documents and receive context-aware responses.

### OCR Integration
Extracts text from scanned documents and images using Tesseract.js.

---

## Security Features

- JWT-based Authentication
- Password Hashing using bcrypt
- Protected Routes and APIs
- Input Validation and Error Handling

---

## Future Enhancements

- Voice-Based Learning Assistant
- Personalized Study Recommendations
- Multi-Language Support
- Cloud Deployment
- Real-Time Collaborative Learning
- Advanced Analytics and Performance Tracking

---

## Learning Outcomes

- Full-Stack Development
- RESTful API Development
- JWT Authentication
- MongoDB Database Management
- OCR Implementation
- AI Integration using Google Gemini
- Retrieval-Augmented Generation (RAG)
- Scalable Application Architecture

---

## Author

**Tanushwi Singh**

- LinkedIn: https://linkedin.com/in/tanushwi-singh-003108310
- GitHub: https://github.com/Tanushwi

---

## Conclusion

Smart Study demonstrates the integration of Artificial Intelligence, OCR, and Full-Stack Development to create a smart learning platform that simplifies studying, improves revision, and enhances the overall learning experience for students.
