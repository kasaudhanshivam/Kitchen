# Kitchen – A Version Control System

**Kitchen** is a web-based version control system that allows users to manage repositories, track commits, and view project history through a simple interface.  
The project combines a **CLI-style workflow**, a **backend API**, and a **React-based frontend** to demonstrate core version control concepts.

---

## Overview

Kitchen is built as a **learning-focused version control system**, where users can:

- Create and manage repositories
- Track commits over time
- View repository and commit history
- Sync actions between users in real time

The system is divided into three main parts:
- A **React (Vite) frontend** for user interaction
- A **Node.js + Express backend** for APIs and data handling
- A **CLI layer** that interacts with the backend APIs

---

## Features

- User authentication (signup & login)
- Repository listing and management
- Commit creation and history tracking
- Backend-powered push and pull operations
- Real-time synchronization using Socket.io

---

## Frontend

The frontend is built using **React with Vite**.

### Frontend Responsibilities
- User authentication (login/signup)
- Displaying repository lists
- Showing commit history for repositories
- Communicating with backend APIs

The frontend is deployed separately and consumes backend APIs for all data operations.

---

## Backend

The backend is built using **Node.js and Express** and acts as the core of the system.

### Backend Responsibilities
- User authentication using JWT
- Managing repositories and commits
- Storing data in MongoDB
- Handling push and pull operations
- Providing APIs for the frontend
- Enabling real-time updates via Socket.io

---

## Command-Line Interface (CLI)

Kitchen includes a CLI-style interface implemented using `yargs`.

### CLI Characteristics
- Commands are parsed using arguments
- CLI operations interact with backend APIs
- Designed to simulate basic version control commands

Example commands:
```bash
kitchen init
kitchen add <file>
kitchen commit "message"
kitchen push
kitchen pull
kitchen revert <commitId>
```

## Real-Time Synchronization

Socket.io is used to enable **real-time synchronization** between users, allowing updates to be reflected instantly when repository-related actions occur.

---

## Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React (Vite) |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose, AWS S3 |
| Authentication | JWT |
| Realtime | Socket.io |
| CLI Tooling | Yargs |
| Deployment | Vercel (Frontend), Render (Backend) |

## Project Structure
```
KITCHEN
├── backend
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── index.js
│   ├── db.js
│   ├── package.json
│   └── .env
│
└── frontend
    ├── src
    ├── public
    ├── package.json
    ├── vite.config.js
    ├── vercel.json
    └── README.md
```

## Deployment

- **Frontend:** Deployed on Vercel  
- **Backend:** Deployed on Render  
- **Database:** Hosted on MongoDB Atlas and AWS S3 Bucket

Environment variables are configured through the respective deployment platforms.

---

## Project Type

This project is developed as a **learning and academic project**, focused on understanding how version control systems work internally using modern web technologies.

---

## Developed By

**Shivam Kasaudhan**

If you find this project useful, consider starring the repository ⭐  
*Kitchen is built to learn, explore, and understand version control systems.*
