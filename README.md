# 🚗 Rage Roads - Leaderboard Backend API

This is the **Node.js backend** service for the **Rage Roads** game. It supports login via wallet address, game score updates, leaderboard tracking, and automatic weekly rewards for top players. Data is stored in **MongoDB**, and authentication is handled with **JWT tokens**.

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **JWT Authentication**
- **ES Modules**
- **CORS + Dotenv**
- **NodeCron**

---

## 📂 Project Structure

/Leaderboard-backend
│-src
├── models/ # Mongoose schemas
├── routes/ # Express route files
├── controllers/ # Business logic
├── .env # Environment config
├── index.js # App entry point
├── middelware # jwt auth logic
├── utils # nodeCron logic
└── config # db configration



## 🚀 Getting Started

### 1. **Clone the Repo**
git clone https://github.com/your-username/Rage-Roads-backend.git

cd Rage-Roads-backend

2. Install Dependencies
npm install

4. Create .env File

5. Run the Server

npm start

Server will start on http://localhost:5002.

📌 API Documentation
1. 🔐 Login / Register (Get JWT Token)

POST /api/login
📥 Body

{
  "wallet": "0x123..."
}
If the wallet doesn’t exist, a new user is created.

If it exists, the user is logged in.

🧪 Testing Tip: You can use a random string like 0xTest123 if you don't have a real wallet.

📤 Response

{
  "user": {
    "_id": "user_id",
    "wallet": "0x123...",
    "score": 0,
    "track": null,
    "raceTime": null
  },
  "token": "JWT_TOKEN_HERE"
}


2. 🎮 Update Game Data

POST /api/update/game-data
🧾 Headers

Authorization: Bearer <JWT_TOKEN>
📥 Body

{
  "wallet": "0x123...",
  "track": "Monaco",
  "score": 500,
  "raceTime": 72000
}
📤 Response

{
  "message": "Game data updated successfully"
}
3. 🏆 Get Leaderboard

GET /api/leaderboard?page=1
🧾 Headers

Authorization: Bearer <JWT_TOKEN>
📤 Response

{
  "currentLeaderboard": [...top10],
  "lastWeekWinners": [...top10FromLastWeek],
  "user": {
    "_id": "user_id",
    "wallet": "0x123...",
    "score": 500,
    ...
  }
}
🏅 Weekly Rewards
Every Sunday, the top 10 users on the leaderboard will be stored as weekly winners.
Importent Note:- for default there will be same lask week winner and cureent winner as there is no last week winers nodecron will now keep an eye on the current winner,
wait for next week to come or manualy set the lask week winner to avoid this.
 
These winners can be viewed in the /leaderboard API response.

🛠️ Cron job or scheduler should be implemented to handle weekly reward snapshot (not included here by default).


👨‍💻 Author
Sparsh Saxena
