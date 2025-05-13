import "./env.js";
import "./src/utils/nodeCron.js";
import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import router from "./src/routes/index.js";

const app = express();
const PORT = process.env.PORT || 5004;

app.use(cors());
app.use(express.json());

// Routes
app.get("/demo", (req, res) => {
  res.send("Welcome to the API!");
});

app.use("/api", router);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
