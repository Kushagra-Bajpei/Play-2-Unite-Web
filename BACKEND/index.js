import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import contactRoutes from "./routes/contact.route.js";


dotenv.config();

const app = express();
const port = process.env.PORT;
const MONGO_URL = process.env.MONGO_URI;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5501', 'http://localhost:5501'], // Add your frontend URLs
    credentials: true
}));
app.use(express.json());


// DB Connection
mongoose
    .connect(MONGO_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB Connection Error:", error));

// Routes
app.use("/api/v1/contact", contactRoutes);


// Health check route
app.get("/", (req, res) => {
    res.json({ message: "Play 2 Unite Backend API is running!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
