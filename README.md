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
#️⃣	API Name	Method	Endpoint	Headers	Request Body / Params	Description
1️⃣	Login / Register	POST	/api/login	None	wallet (string)
✅ Example: "0x123..."
🧪 Use a dummy wallet like 0xTest123 for testing	Logs in a user with wallet address. Creates account if not existing. Returns JWT token.
2️⃣	Update Game Data	POST	/api/update/game-data	Authorization: Bearer <JWT_TOKEN>	wallet (string)
track (string)
score (number)
raceTime (number, in ms)
✅ Example: "Monaco", 500, 72000	Updates a user's score, track, and race time. Protected route.
3️⃣	Fetch Leaderboard	GET	/api/leaderboard?page=1	Authorization: Bearer <JWT_TOKEN>	Query Param: page (number)
✅ Example: /api/leaderboard?page=1	Fetches current leaderboard (paginated), last week's winners, and logged-in user info.

🏅 Weekly Rewards
Every Sunday, the top 10 users on the leaderboard will be stored as weekly winners.
 
These winners can be viewed in the /leaderboard API response.

🛠️ Cron job or scheduler should be implemented to handle weekly reward snapshot (not included here by default).


👨‍💻 Author
Sparsh Saxena
